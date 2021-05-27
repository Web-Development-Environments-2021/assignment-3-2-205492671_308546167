CREATE TABLE dbo.users(
	user_id [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	username [varchar](30) NOT NULL UNIQUE,
	firstname [varchar](300) NOT NULL,
	lastname [varchar](300) NOT NULL,
	country [varchar](300) NOT NULL,
	password [varchar](300) NOT NULL,
	email [varchar](300) NOT NULL,
	profile_picture [varchar](300) NOT NULL
)