CREATE TABLE dbo.RumboVisitors (
  Id uniqueidentifier NOT NULL CONSTRAINT PK_RumboVisitors PRIMARY KEY DEFAULT NEWID(),
  TokenHash char(64) NOT NULL CONSTRAINT UQ_RumboVisitors_Token UNIQUE,
  CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE TABLE dbo.RumboVisitorState (
  VisitorId uniqueidentifier NOT NULL REFERENCES dbo.RumboVisitors(Id) ON DELETE CASCADE,
  StateKey varchar(60) NOT NULL,
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson, VALUE)=1),
  Revision int NOT NULL DEFAULT 1,
  UpdatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_RumboVisitorState PRIMARY KEY (VisitorId, StateKey)
);
CREATE TABLE dbo.RumboProducts (
  Id int NOT NULL PRIMARY KEY,
  Name nvarchar(200) NOT NULL,
  Price decimal(12,2) NOT NULL CHECK (Price>=0),
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson)=1),
  OptionsJson nvarchar(max) NOT NULL CHECK (ISJSON(OptionsJson)=1),
  AdjustmentsJson nvarchar(max) NOT NULL CHECK (ISJSON(AdjustmentsJson)=1)
);
CREATE TABLE dbo.RumboDestinations (
  Id varchar(80) NOT NULL PRIMARY KEY,
  Name nvarchar(200) NOT NULL,
  Economy decimal(12,2) NOT NULL CHECK (Economy>=0),
  SortOrder int NOT NULL,
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson)=1)
);
CREATE TABLE dbo.RumboHotels (
  DestinationId varchar(80) NOT NULL REFERENCES dbo.RumboDestinations(Id),
  Id varchar(80) NOT NULL,
  Name nvarchar(200) NOT NULL,
  Rate decimal(12,2) NOT NULL CHECK (Rate>=0),
  SortOrder int NOT NULL,
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson)=1),
  CONSTRAINT PK_RumboHotels PRIMARY KEY (DestinationId, Id)
);
CREATE TABLE dbo.RumboSettings (
  Name varchar(80) NOT NULL PRIMARY KEY,
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson)=1)
);
