-- Immutable demonstration receipts, isolated by the authenticated account.
CREATE TABLE dbo.RumboOrders (
  Id bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
  UserId uniqueidentifier NOT NULL REFERENCES dbo.RumboUsers(Id) ON DELETE CASCADE,
  Kind varchar(10) NOT NULL CHECK (Kind IN ('trip','store')),
  Fingerprint char(64) NOT NULL,
  DataJson nvarchar(max) NOT NULL CHECK (ISJSON(DataJson)=1),
  CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT UQ_RumboOrders_Checkout UNIQUE(UserId,Kind,Fingerprint)
);
CREATE INDEX IX_RumboOrders_History ON dbo.RumboOrders(UserId,Id DESC) INCLUDE(Kind,CreatedAt);
IF DATABASE_PRINCIPAL_ID('RumboEquipo') IS NOT NULL
  GRANT SELECT,INSERT,DELETE ON dbo.RumboOrders TO RumboEquipo;
