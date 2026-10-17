-- Contadores agregados de visitas consentidas; no son personas únicas.
-- Solo lectura. Ejecutar en la base de Rumbo desde SSMS.
SELECT ViewDate AS FechaUTC, Page AS Pagina, Views AS Visitas
FROM dbo.RumboPageViews
WHERE ViewDate >= DATEADD(day, -90, CAST(SYSUTCDATETIME() AS date))
ORDER BY ViewDate DESC, Page;

SELECT Page AS Pagina, SUM(CAST(Views AS bigint)) AS VisitasUltimos30Dias
FROM dbo.RumboPageViews
WHERE ViewDate >= DATEADD(day, -29, CAST(SYSUTCDATETIME() AS date))
GROUP BY Page
ORDER BY VisitasUltimos30Dias DESC, Page;
