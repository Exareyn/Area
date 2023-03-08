-- Database
CREATE database if not exists AreaDB;
use AreaDB;

-- Tables
CREATE table users (
	id integer unsigned not null auto_increment primary key,
	name varchar(32) not null,
	firstname varchar(32) not null,
	mail varchar(128) not null,
	password varchar(255) not null,
	created_at datetime default NOW());

CREATE table oauth2 (
	id integer unsigned not null auto_increment primary key,
	name varchar(32));

CREATE table actions (
	id integer unsigned not null auto_increment primary key,
	type varchar(16) not null,
	description text);

CREATE table reactions (
	id integer unsigned not null auto_increment primary key,
	type varchar(16) not null,
	description text);

-- Constraints
CREATE table user_credentials (
	user_id integer unsigned not null,
	oauth2_id integer unsigned not null,
	token text not null,
	primary key (user_id, oauth2_id),
	constraint constr_credentials_user_fk
		foreign key user_fk (user_id) references users (id)
		on DELETE cascade on UPDATE cascade,
	constraint constr_credentials_oauth2_fk
		foreign key oauth2_fk (oauth2_id) references oauth2 (id)
		on DELETE cascade on UPDATE cascade);

CREATE table area (
	id integer unsigned not null auto_increment primary key,
	title varchar(32) not null,
	user_id integer unsigned not null,
	action_id integer unsigned not null,
	reaction_id integer unsigned not null,
	loaded_data text,
	constraint constr_area_user_fk
		foreign key user_fk (user_id) references users (id)
		on DELETE cascade on UPDATE cascade,
	constraint constr_area_action_fk
		foreign key action_fk (action_id) references actions (id)
		on DELETE cascade on UPDATE cascade,
	constraint constr_area_reaction_fk
		foreign key reaction_fk (reaction_id) references reactions (id)
		on DELETE cascade on UPDATE cascade);

-- Data
INSERT INTO oauth2 (name) VALUES ('google');
INSERT INTO oauth2 (name) VALUES ('twitter');
INSERT INTO oauth2 (name) VALUES ('facebook');
INSERT INTO oauth2 (name) VALUES ('discord');
INSERT INTO oauth2 (name) VALUES ('github');

INSERT INTO actions (type, description) VALUES ('getlasttweet', 'get the last tweet from a given account');
INSERT INTO actions (type, description) VALUES ('gettopic', '');

INSERT INTO reactions (type, description) VALUES ('sendtweet', 'send a tweet on a given account');
INSERT INTO reactions (type, description) VALUES ('sendmail', 'send a mail on a given address');
INSERT INTO reactions (type, description) VALUES ('sendmessage', 'send a private message on discord');
INSERT INTO reactions (type, description) VALUES ('retweet', 'retweet last tweet from action 1 or 2');
INSERT INTO reactions (type, description) VALUES ('sendpost', 'send a post on your facebook page');
INSERT INTO reactions (type, description) VALUES ('addevent', 'add an event on your calendar');
