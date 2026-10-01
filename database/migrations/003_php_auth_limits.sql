CREATE TABLE dbo.RumboAuthAttempts (
  Id bigint IDENTITY NOT NULL PRIMARY KEY,
  IpHash char(64) NOT NULL,
  AttemptedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_RumboAuthAttempts_Ip ON dbo.RumboAuthAttempts(IpHash, AttemptedAt);
