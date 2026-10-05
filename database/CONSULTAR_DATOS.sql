-- Abrir en SSMS y pulsar F5. Solo consulta, no modifica datos.
USE BD_VIAJES;
GO
SELECT Id, FullName, Email, CreatedAt
FROM dbo.RumboUsers ORDER BY CreatedAt DESC;

SELECT u.Email, s.StateKey, s.DataJson, s.Revision, s.UpdatedAt
FROM dbo.RumboUsers AS u
JOIN dbo.RumboVisitorState AS s ON s.VisitorId = u.VisitorId
ORDER BY s.UpdatedAt DESC;

SELECT COUNT(*) AS Productos FROM dbo.RumboProducts;
SELECT COUNT(*) AS Destinos FROM dbo.RumboDestinations;
SELECT COUNT(*) AS Hoteles FROM dbo.RumboHotels;

-- Todas las tablas y columnas visibles para tu usuario.
SELECT TABLE_SCHEMA AS Esquema,TABLE_NAME AS Tabla FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_SCHEMA,TABLE_NAME;
SELECT TABLE_NAME AS Tabla,COLUMN_NAME AS Columna,DATA_TYPE AS Tipo,
       CHARACTER_MAXIMUM_LENGTH AS Longitud,IS_NULLABLE AS PermiteNulos
FROM INFORMATION_SCHEMA.COLUMNS ORDER BY TABLE_NAME,ORDINAL_POSITION;

-- Catálogo completo y configuración compartida.
SELECT * FROM dbo.RumboProducts ORDER BY Id;
SELECT * FROM dbo.RumboDestinations ORDER BY SortOrder;
SELECT * FROM dbo.RumboHotels ORDER BY DestinationId,SortOrder;
SELECT * FROM dbo.RumboSettings ORDER BY Name;
SELECT Id,CreatedAt FROM dbo.RumboVisitors ORDER BY CreatedAt DESC;
SELECT VisitorId,StateKey,DataJson,Revision,UpdatedAt
FROM dbo.RumboVisitorState ORDER BY UpdatedAt DESC;
SELECT Name,AppliedAt FROM dbo.RumboMigrations ORDER BY Name;
-- No se muestran hashes de contraseñas ni de cookies de sesión.
SELECT u.Email,s.CreatedAt,s.ExpiresAt FROM dbo.RumboSessions s
JOIN dbo.RumboUsers u ON u.Id=s.UserId ORDER BY s.CreatedAt DESC;
SELECT COUNT(*) AS IntentosDeAcceso FROM dbo.RumboAuthAttempts;
