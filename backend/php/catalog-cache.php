<?php
declare(strict_types=1);

// Only public catalogue rows are cached. SQL validates their exact content on
// every request, so price changes are visible immediately and outages still fail.
function catalog_rows(): array {
    $identity = hash('sha256', implode('|', array_map(fn($key) => rumbo_config($key), ['DB_SERVER','DB_PORT','DB_NAME','DB_AUTH','DB_USER'])));
    $directory = dirname(__DIR__, 2).'/.runtime/catalog-cache';
    $file = $directory.'/'.$identity.'.json';
    $cached = null;
    if (is_file($file)) {
        $handle = @fopen($file, 'rb');
        if ($handle) {
            if (flock($handle, LOCK_SH)) { $cached = json_decode(stream_get_contents($handle), true); flock($handle, LOCK_UN); }
            fclose($handle);
        }
    }
    if (!is_array($cached) || !isset($cached['version'],$cached['rows']['Products'],$cached['rows']['Destinations'],$cached['rows']['Hotels'],$cached['rows']['Settings'])) $cached = null;
    $statement = query("SET NOCOUNT ON;
        DECLARE @snapshot nvarchar(max) = (SELECT
          (SELECT * FROM dbo.RumboProducts ORDER BY Id FOR JSON PATH) AS Products,
          (SELECT * FROM dbo.RumboDestinations ORDER BY SortOrder,Id FOR JSON PATH) AS Destinations,
          (SELECT * FROM dbo.RumboHotels ORDER BY DestinationId,SortOrder,Id FOR JSON PATH) AS Hotels,
          (SELECT * FROM dbo.RumboSettings WHERE Name NOT LIKE 'review:%' ORDER BY Name FOR JSON PATH) AS Settings
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
        DECLARE @version varchar(64) = CONVERT(varchar(64),HASHBYTES('SHA2_256',@snapshot),2);
        SELECT @version AS Version, COMPRESS(CASE WHEN @version=? THEN NULL ELSE @snapshot END) AS Payload;", [$cached['version'] ?? '']);
    $row = $statement->fetch();
    $statement->closeCursor();
    if ($cached && $row['Version'] === $cached['version']) return $cached['rows'];
    $payload = $row['Payload'];
    if (is_resource($payload)) $payload = stream_get_contents($payload);
    $rows = json_decode(mb_convert_encoding(gzdecode($payload), 'UTF-8', 'UTF-16LE'), true, 512, JSON_THROW_ON_ERROR);
    // A read-only installation can still serve the fresh SQL result.
    if (is_dir($directory) || @mkdir($directory, 0700, true)) {
        $handle = @fopen($file, 'c+b');
        if ($handle) {
            if (flock($handle, LOCK_EX)) {
                ftruncate($handle, 0);
                fwrite($handle, encode_json(['version'=>$row['Version'],'rows'=>$rows]));
                fflush($handle);flock($handle, LOCK_UN);
            }
            fclose($handle);
        }
    }
    return $rows;
}
