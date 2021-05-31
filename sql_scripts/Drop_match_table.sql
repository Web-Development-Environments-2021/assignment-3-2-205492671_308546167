IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[match]') AND type in (N'U'))
DROP TABLE [dbo].[match]
GO