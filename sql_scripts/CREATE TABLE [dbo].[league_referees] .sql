CREATE TABLE [dbo].[league_referees](
	user_id [int] NOT NULL,
	league_id [varchar](300) NOT NULL,
	PRIMARY KEY(user_id, league_id),
	CONSTRAINT FK_league_ref_user FOREIGN KEY (user_id)
	REFERENCES users(user_id),
	CONSTRAINT FK_league_ref_league FOREIGN KEY (league_id)
	REFERENCES league(league_id)
)