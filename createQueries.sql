create table CharTable (id MEDIUMINT NOT NULL AUTO_INCREMENT,
	char_name varchar(255),
	char_class varchar(255),
	char_stats MEDIUMINT,
	initiative int,
	pass_perception int,
	hp_max int,
	hp_current int,
	ac int,
	notes varchar(1000),
	image varchar(1000),
	is_active bool,
	campaign_id MEDIUMINT,
	PRIMARY KEY (id),
	FOREIGN KEY (char_stats) REFERENCES CharStats(id),
	FOREIGN KEY (campaign_id) REFERENCES Campaign(id));
							  
create table CharStats ( id MEDIUMINT NOT NULL AUTO_INCREMENT,
	strength int,
	dexterity int,
	constitution int,
	intelligence int,
	wisdom int,
	charisma int,
	PRIMARY KEY (id));

create table CampaignNotes (id MEDIUMINT NOT NULL AUTO_INCREMENT,
	notes LONGTEXT, 
	PRIMARY KEY (id));

create table Campaign (id MEDIUMINT NOT NULL AUTO_INCREMENT,
	notes_id MEDIUMINT,
	PRIMARY KEY(id),
	FOREIGN KEY(notes_id) REFERENCES CampaignNotes(id));



insert into CampaignNotes (notes) VALUES("");
insert into Campaign (notes_id) values(1);
insert into CharStats (strength, dexterity, constitution, intelligence, wisdom, charisma) values (20, 10, 12, 13, 20, 14);
insert into CharTable (char_name, char_class, char_stats, initiative, pass_perception, hp_max, hp_current, ac, notes, image, is_active, campaign_id) values ('Galgrim Dwarvin', 'Cleric 18', 1, 0, 15, 180, 180, 18, "", "", 1, 1);

select cs.* from CharStats cs left join CharTable ct on cs.id = ct.char_stats left join Campaign c on ct.campaign_id = c.id where c.id = 1;	