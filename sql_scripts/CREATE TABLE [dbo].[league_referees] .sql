CREATE TABLE [dbo].[league_referees](
	user_id [int] NOT NULL,
	league_id [varchar](300) NOT NULL,
	PRIMARY KEY(user_id, league_id)
)