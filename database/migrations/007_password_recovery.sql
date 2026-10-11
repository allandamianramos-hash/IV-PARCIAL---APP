CREATE TABLE dbo.RumboPasswordResets (
    Id char(64) NOT NULL PRIMARY KEY,
    EmailHash char(64) NOT NULL,
    UserId uniqueidentifier NULL REFERENCES dbo.RumboUsers(Id) ON DELETE CASCADE,
    CodeHash char(64) NULL,
    ResetHash char(64) NULL,
    Attempts int NOT NULL DEFAULT 0,
    CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt datetime2 NOT NULL,
    Delivered bit NOT NULL DEFAULT 0,
    ConsumedAt datetime2 NULL
);
CREATE INDEX IX_RumboPasswordResets_Email ON dbo.RumboPasswordResets(EmailHash,CreatedAt);
CREATE INDEX IX_RumboPasswordResets_User ON dbo.RumboPasswordResets(UserId);
IF DATABASE_PRINCIPAL_ID(N'RumboEquipo') IS NOT NULL
    GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboPasswordResets TO RumboEquipo;
