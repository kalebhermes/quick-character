create table CharTable (id MEDIUMINT NOT NULL AUTO_INCREMENT,
							  CharName varchar(255), 
							  CharClass varchar(255), 
							  CharStats int, 
							  Initiative int, 
							  PassPerception int, 
							  HPMax int, 
							  HPCurrent int, 
							  AC int, 
							  SpellSlots int, 
							  Notes varchar(1000),
							  image varchar(1000),
							  is_active bool,
							  PRIMARY KEY (id));
							  
create table CharStats ( id MEDIUMINT NOT NULL AUTO_INCREMENT,
						 CharacterID int,
						 Strength int,
					     Dexterity int,
						 Constitution int,
						 Intelligence int,
						 Wisdom int,
						 Charisma int,
						 PRIMARY KEY (id));
						 
create table SpellSlots (
id MEDIUMINT NOT NULL AUTO_INCREMENT,
CharacterID int,
`1` int,
`2` int,
`3` int,
`4` int,
`5` int,
`6` int,
`7` int,
`8` int,
`9` int,
PRIMARY KEY (id)
);

create table CampaignNotes (id MEDIUMINT NOT NULL AUTO_INCREMENT,
							  Notes LONGTEXT, 
							  PRIMARY KEY (id));
							  