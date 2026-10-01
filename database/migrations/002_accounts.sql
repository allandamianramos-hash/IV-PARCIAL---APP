CREATE TABLE dbo.RumboUsers (
  Id uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
  FullName nvarchar(120) NOT NULL,
  Email nvarchar(254) NOT NULL UNIQUE,
  PasswordHash varchar(200) NOT NULL,
  VisitorId uniqueidentifier NOT NULL UNIQUE REFERENCES dbo.RumboVisitors(Id),
  CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE TABLE dbo.RumboSessions (
  TokenHash char(64) NOT NULL PRIMARY KEY,
  UserId uniqueidentifier NOT NULL REFERENCES dbo.RumboUsers(Id),
  ExpiresAt datetime2 NOT NULL,
  CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_RumboSessions_UserId ON dbo.RumboSessions(UserId);
CREATE INDEX IX_RumboSessions_Expiry ON dbo.RumboSessions(ExpiresAt);
