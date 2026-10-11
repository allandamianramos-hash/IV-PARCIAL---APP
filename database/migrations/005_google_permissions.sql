-- Existing application role keeps only data permissions, never schema ownership.
IF DATABASE_PRINCIPAL_ID(N'RumboEquipo') IS NOT NULL
    GRANT SELECT,INSERT,DELETE ON dbo.RumboGoogleChallenges TO RumboEquipo;
