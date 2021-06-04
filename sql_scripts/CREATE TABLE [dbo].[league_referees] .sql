CREATE TABLE [dbo].[league_referees](
	user_id [int] NOT NULL,
	league_id [varchar](300) NOT NULL,
	PRIMARY KEY(user_id, league_id),
	CONSTRAINT FK_league_ref FOREIGN KEY (user_id)
	REFERENCES users(user_id)
)