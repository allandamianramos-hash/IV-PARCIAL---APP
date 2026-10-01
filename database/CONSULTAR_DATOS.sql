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
