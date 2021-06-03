	CREATE TABLE [dbo].[roles](
	    user_id [int] NOT NULL,
	    role_name [varchar](300) NOT NULL,
	    PRIMARY KEY(user_id, role_name)
	)

