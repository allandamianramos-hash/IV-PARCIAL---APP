-- Solo administrador. Conectarse DIRECTAMENTE a BD_VIAJES en SSMS.
-- Cambiar usuario y clave localmente. Una cuenta distinta por persona.
-- No compartir este archivo con claves reales guardadas.
IF DB_NAME()<>N'BD_VIAJES' THROW 51000,'Selecciona BD_VIAJES',1;
DECLARE @usuario sysname=N'CAMBIAR_USUARIO';
DECLARE @clave nvarchar(128)=N'CAMBIAR_CONTRASENA';
IF @usuario=N'CAMBIAR_USUARIO' OR @clave=N'CAMBIAR_CONTRASENA' OR LEN(@clave)<16
    THROW 51000,'Escribe un usuario y una clave unica de al menos 16 caracteres',1;
IF DATABASE_PRINCIPAL_ID(@usuario) IS NOT NULL
    THROW 51000,'Ese usuario ya existe: no se modifico su clave',1;
IF DATABASE_PRINCIPAL_ID(N'RumboEquipo') IS NULL CREATE ROLE RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboUsers TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboSessions TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboVisitors TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboVisitorState TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboAuthAttempts TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboProducts TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboDestinations TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboHotels TO RumboEquipo;
GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboSettings TO RumboEquipo;
GRANT SELECT ON dbo.RumboMigrations TO RumboEquipo;
DECLARE @sql nvarchar(max)=N'CREATE USER '+QUOTENAME(@usuario)+N' WITH PASSWORD=N'''+REPLACE(@clave,N'''',N'''''')+N'''; ALTER ROLE RumboEquipo ADD MEMBER '+QUOTENAME(@usuario)+N';';
EXEC sys.sp_executesql @sql;
PRINT 'Usuario creado. Puede trabajar con los datos de Rumbo; no puede cambiar la estructura.';
