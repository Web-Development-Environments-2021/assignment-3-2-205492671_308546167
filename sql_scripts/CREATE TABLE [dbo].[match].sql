CREATE TABLE [dbo].[match](
	match_id [varchar] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	home_team [varchar](300) NOT NULL UNIQUE,
	away_team [varchar](300) NOT NULL,
	referee_team [varchar](300) NOT NULL,
	date [varchar](300) NOT NULL,
)