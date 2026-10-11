ALTER TABLE dbo.RumboUsers ADD MicrosoftSubject varchar(255) COLLATE Latin1_General_100_BIN2 NULL;
EXEC('CREATE UNIQUE INDEX UX_RumboUsers_MicrosoftSubject ON dbo.RumboUsers(MicrosoftSubject) WHERE MicrosoftSubject IS NOT NULL');

CREATE TABLE dbo.RumboMicrosoftChallenges (
  NonceHash char(64) NOT NULL PRIMARY KEY,
  ExpiresAt datetime2 NOT NULL
);
CREATE INDEX IX_RumboMicrosoftChallenges_Expiry ON dbo.RumboMicrosoftChallenges(ExpiresAt);
IF DATABASE_PRINCIPAL_ID(N'RumboEquipo') IS NOT NULL
    GRANT SELECT,INSERT,DELETE ON dbo.RumboMicrosoftChallenges TO RumboEquipo;
