-- Optional, consented page views. No IP, account, visitor or user-agent columns.
CREATE TABLE dbo.RumboPageViews (
  ViewDate date NOT NULL,
  Page varchar(60) NOT NULL,
  Views bigint NOT NULL DEFAULT 0,
  CONSTRAINT PK_RumboPageViews PRIMARY KEY(ViewDate,Page)
);
IF DATABASE_PRINCIPAL_ID('RumboEquipo') IS NOT NULL
  GRANT SELECT,INSERT,UPDATE,DELETE ON dbo.RumboPageViews TO RumboEquipo;
