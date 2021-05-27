CREATE TABLE [dbo].[match](
	match_id [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	home_team [varchar](300) NOT NULL UNIQUE,
	away_team [varchar](300) NOT NULL,
	league [varchar] (300) NOT NULL,
	season [varchar] (300) NOT NULL,
	fixture [varchar] (300) NOT NULL,
	court [varchar] (300) NOT NULL,
	referee_name [varchar](300) NOT NULL,
	date [varchar](300) NOT NULL,
	score [varchar] (300) NOT NULL
)