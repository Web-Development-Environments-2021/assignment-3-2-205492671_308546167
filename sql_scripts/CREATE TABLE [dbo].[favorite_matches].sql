CREATE TABLE [dbo].[favorite_matches](
	user_id [int] NOT NULL,
	match_id [int] NOT NULL,
	PRIMARY KEY(user_id, match_id),
	CONSTRAINT FK_favorite_match_id FOREIGN KEY (match_id)
	REFERENCES  match(match_id),
	CONSTRAINT FK_favorite_user_id FOREIGN KEY (user_id)
	REFERENCES  users(user_id)

)