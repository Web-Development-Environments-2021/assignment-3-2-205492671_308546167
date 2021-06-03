	CREATE TABLE [dbo].[events](
	    match_id [int] NOT NULL,
	    date [varchar](100) NOT NULL,
        min_in_game [int] NOT NULL,
        event_type [varchar](100) NOT NULL,
        description [varchar](100) NOT NULL,
	    PRIMARY KEY(match_id, date, min_in_game, event_type, description),
		CONSTRAINT FK_match_id FOREIGN KEY (match_id)
		REFERENCES match(match_id)
	)