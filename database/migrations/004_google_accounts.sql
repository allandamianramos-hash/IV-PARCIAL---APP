ALTER TABLE dbo.RumboUsers ADD GoogleSubject varchar(255) COLLATE Latin1_General_100_BIN2 NULL;
EXEC('CREATE UNIQUE INDEX UX_RumboUsers_GoogleSubject ON dbo.RumboUsers(GoogleSubject) WHERE GoogleSubject IS NOT NULL');

CREATE TABLE dbo.RumboGoogleChallenges (
  NonceHash char(64) NOT NULL PRIMARY KEY,
  ExpiresAt datetime2 NOT NULL
);
CREATE INDEX IX_RumboGoogleChallenges_Expiry ON dbo.RumboGoogleChallenges(ExpiresAt);
