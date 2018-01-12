var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var creds = require('../creds');

moment().format();


function findMod(stat){
	let num = Math.floor((stat - 10) / 2);
	if(num > -1) num = '+' + num;
	return num;
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : creds.username,
  password : creds.password,
  database : 'quick_character'
});

var statName = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

connection.connect();


router.get('/', function(req, res, next) {

	let query = `select ct.*,
		GROUP_CONCAT(ss.\`1\`, ',', ss.\`2\`, ',', ss.\`3\`, ',', ss.\`4\`, ',', ss.\`5\`, ',', ss.\`6\`, ',', ss.\`7\`, ',', ss.\`8\`, ',', ss.\`9\`) as SpellSlots,
		GROUP_CONCAT(cs.strength, ',', cs.dexterity, ',', cs.constitution, ',', cs.intelligence, ',', cs.wisdom, ',', cs.charisma) as Stats
		from CharTable ct
		inner join SpellSlots ss
		on ct.id = ss.CharacterID
		inner join CharStats cs
		on ct.id = cs.CharacterID
		where ct.is_active = 1
		group by ct.id;`

	connection.query(query, function (err, rows, fields) {
	  	if (err) throw err
	  	for(character in rows){

	  		rows[character].SpellSlots = rows[character].SpellSlots.split(',');
	  		let spells = [];
	  		for(spell in rows[character].SpellSlots){
	  			spells.push({
	  				name: parseInt(spell)+1,
	  				numSlots: rows[character].SpellSlots[spell]
	  			})
	  		}
	  		rows[character].SpellSlots = spells;
	  		
	  		rows[character].Stats = rows[character].Stats.split(',');
	  		let stats = [];
	  		for(stat in rows[character].Stats){
	  			stats.push({
	  				name: statName[stat],
	  				stat: rows[character].Stats[stat],
	  				mod: findMod(rows[character].Stats[stat])
	  			})
	  		}
	  		rows[character].Stats = stats;
	  	}

	  	res.render('quick_character', { rows: rows });	
	})
  
});

router.get('/updateFullCharacter/:id', function(req, res, next){

	let query = `select ct.*,
		GROUP_CONCAT(ss.\`1\`, ',', ss.\`2\`, ',', ss.\`3\`, ',', ss.\`4\`, ',', ss.\`5\`, ',', ss.\`6\`, ',', ss.\`7\`, ',', ss.\`8\`, ',', ss.\`9\`) as SpellSlots,
		GROUP_CONCAT(cs.strength, ',', cs.dexterity, ',', cs.constitution, ',', cs.intelligence, ',', cs.wisdom, ',', cs.charisma) as Stats
		from CharTable ct
		inner join SpellSlots ss
		on ct.id = ss.CharacterID
		inner join CharStats cs
		on ct.id = cs.CharacterID
		where ct.id = ${req.params.id}
		group by ct.id;`;
	
	connection.query(query, function(err, rows, fields){
		if (err) throw err;

		let character = rows[0];

		character.SpellSlots = character.SpellSlots.split(',');
		let spells = [];
		for(spell in character.SpellSlots){
			spells.push({
				name: parseInt(spell)+1,
				numSlots: character.SpellSlots[spell]
			})
		}
		character.SpellSlots = spells;
		
		character.Stats = character.Stats.split(',');
		let stats = [];
		for(stat in character.Stats){
			stats.push({
				name: statName[stat],
				stat: character.Stats[stat],
				mod: findMod(character.Stats[stat])
			})
		}
		character.Stats = stats;

		res.render('edit_character.pug', {character: character });
	})
})

router.post('/updateFullCharacter/:id', function(req, res, next){
	console.log(req.body);

	var q = `
		update CharTable SET
		CharName="${req.body.CharName}",
		CharClass="${req.body.CharClass}",
		Initiative=${req.body.Initiative},
		PassPerception=${req.body.PassPerception},
		HPMax=${req.body.HPMax},
		HPCurrent=${req.body.HPCurrent},
		AC=${req.body.AC},
		Notes="${req.body.Notes}",
		is_active=${req.body.is_active},
		image="${req.body.image}"
		where id=${req.body.id}
	`

	console.log(q);

	connection.query(q, function(err, rows, fields){
		if (err) throw err;
		console.log(rows);
		res.json(rows);
	})
})

router.get('/newCharacter', function(req, res, next){

	let SpellSlots = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	res.render('new_character.pug', {Stats: statName, SpellSlots: SpellSlots });
})

router.post('/newCharacter', function(req, res, next){

	let characterQuery = `
		insert into CharTable (CharName, CharClass, Initiative, PassPerception, HPMax, HPCurrent, AC, image, is_active) 
		VALUES 
		("${req.body.CharName}", "${req.body.CharClass}", ${req.body.Initiative}, ${req.body.PassPerception}, ${req.body.HPMax}, ${req.body.HPCurrent}, ${req.body.AC}, '${req.body.image}', ${req.body.is_active});`;

	let statsQuery = `
		insert into CharStats (CharacterID, Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
		VALUES
		(?, ${req.body.stats.Str}, ${req.body.stats.Dex}, ${req.body.stats.Con}, ${req.body.stats.Int}, ${req.body.stats.Wis}, ${req.body.stats.Cha});`;

	let spellsQuery = `
		insert into SpellSlots(CharacterID, \`1\`, \`2\`, \`3\`, \`4\`, \`5\`, \`6\`, \`7\`, \`8\`, \`9\`)
		VALUES
		(?, ${req.body.spells['1']}, ${req.body.spells['2']}, ${req.body.spells['3']}, ${req.body.spells['4']}, ${req.body.spells['5']}, ${req.body.spells['6']}, ${req.body.spells['7']}, ${req.body.spells['8']}, ${req.body.spells['9']});`;

	let updateCharacterQuery = `
		update CharTable SET CharStats=?, SpellSlots=? where id=?;
	`;

	connection.beginTransaction(function(err){
		if (err) throw err;

		connection.query(characterQuery, function(err, rows, fields){
			if (err) { connection.rollback(function(){ throw err; }); };
			let id = rows.insertId;

			connection.query(statsQuery, id, function(err, rows, fields){
				if (err) { connection.rollback(function(){ throw err; }); };
				let cs = rows.insertId;

				connection.query(spellsQuery, id, function(err, rows, fields){
					if (err) { connection.rollback(function(){ throw err; }); };
					let ss = rows.insertId;

					connection.query(updateCharacterQuery, [cs, ss, id], function(err, rows, fields){
						if (err) { connection.rollback(function(){ throw err; }); };

						connection.commit(function(err){
							if (err) { connection.rollback(function(){ throw err; }); };
							console.log('New Character with ID: ' + id + ' added.');
							res.json(id);
						});
					});
				});
			});
		});
	});
});

router.post('/updateSpells', function(req, res, next){
	console.log(req.body);

	var q = `update SpellSlots SET \`1\`=${req.body['1']}, \`2\`=${req.body['2']}, \`3\`=${req.body['3']}, \`4\`=${req.body['4']}, \`5\`=${req.body['5']}, \`6\`=${req.body['6']}, \`7\`=${req.body['7']}, \`8\`=${req.body['8']}, \`9\`=${req.body['9']} where id=${req.body.id};`

	connection.query(q, function(err, rows, fields){
		if (err) throw err;
		console.log(rows);

		res.json(rows);
	})
});

router.post('/updateStats', function(req, res, next){
	console.log(req.body);

	var q = `update CharStats SET Strength=${req.body.Str}, Dexterity=${req.body.Dex}, Constitution=${req.body.Con}, Intelligence=${req.body.Int}, Wisdom=${req.body.Wis}, Charisma=${req.body.Cha} where CharacterID=${req.body.id};`

	connection.query(q, function(err, rows, fields){
		if (err) throw err;
		console.log(rows);

		res.json(rows);
	})
});

router.post('/updateCharacter', function(req, res, next){
	console.log(req.body);

	var q = `update CharTable SET HPCurrent=${req.body.hp}, Notes='${req.body.notes}' where id=${req.body.id};`

	connection.query(q, function(err, rows, fields){
		if (err) throw err;
		console.log(rows);

		res.json(rows);
	})
});

module.exports = router;
