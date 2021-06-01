CREATE TABLE [dbo].[league_matches](
	user_id [int] NOT NULL,
	match_id [varchar](300) NOT NULL,
	PRIMARY KEY(user_id, match_id)
)