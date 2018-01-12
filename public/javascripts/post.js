var statName = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

function findMod(stat){
	let num = Math.floor((stat - 10) / 2);
	if(num > -1) num = '+' + num;
	return num;
};

function updateImage(){
	let imageURL = document.getElementById('image').value;
	document.getElementById('charImage').src = imageURL;
};

function updateMod(type){
	let fullStat = document.getElementById(type).value;
	document.getElementById(type+'_mod').textContent = findMod(fullStat);
};

function getURL(env, route){
	let base;
	if(env === 'development'){
		base = 'http://localhost:3000/';
	} else if(env === 'production'){
		base = 'http://kalebhermes.com/node/'
	}
	return base + route;
};

function postCharUpdate(id, env){
	update = {
		hp: document.getElementById('hp_'+id).value,
		// notes: document.getElementById('notes_'+id).value,
		notes: '',
		id: id
	};

	let url = getURL(env, 'updateCharacter');

	$(update, url);
};

function postSpellUpdate(id, env){
	var numbers = {};
	for(var x=1;x<10;x++){
		numbers[x] = document.getElementById('spellSlot_'+id+'_'+x).value;
	}
	numbers['id'] = id;

	let url = getURL(env, 'updateSpells');

	$(numbers, url);
};

function postStatUpdate(id, env){
	var stats = {};
	for(var x=0;x<statName.length;x++){
		stats[statName[x]] = document.getElementById(statName[x]).value;
	}
	stats['id'] = id;

	let url = getURL(env, 'updateStats');

	$(stats, url);
}

function saveFullCharacter(id, env){
	let character = {
		CharName: document.getElementById('CharName').value,
		CharClass: document.getElementById('CharClass').value,
		Initiative: document.getElementById('Initiative').value,
		PassPerception: document.getElementById('PassPerception').value,
		HPMax: document.getElementById('HPMax').value,
		HPCurrent: document.getElementById('HPCurrent').value,
		AC: document.getElementById('AC').value,
		Notes: '',
		is_active: document.getElementById('is_active').value,
		image: document.getElementById('image').value,
		id: id
	};

	postSpellUpdate(id, env);
	postStatUpdate(id, env);

	let url = getURL(env, 'updateFullCharacter/' + id);

	$(character, url);

};

function newCharacter(env){
	let stats = {};
	let spells = {};

	for(var x=0;x<statName.length;x++){
		stats[statName[x]] = document.getElementById(statName[x]).value || 10;
	}

	for(var x=0;x<9;x++){
		spells[x+1] = document.getElementById('spellSlot_'+(x+1)).value || 0;
	}

	let character = {
		CharName: document.getElementById('CharName').value || 'Placeholder',
		CharClass: document.getElementById('CharClass').value || 'Placeholder',
		Initiative: document.getElementById('Initiative').value || 0,
		PassPerception: document.getElementById('PassPerception').value || 0,
		HPMax: document.getElementById('HPMax').value  || 0,
		HPCurrent: document.getElementById('HPCurrent').value  || 0,
		AC: document.getElementById('AC').value  || 0,
		Notes: '',
		is_active: document.getElementById('is_active').value  || 1,
		image: document.getElementById('image').value,
		spells: spells,
		stats: stats
	};

	let url = getURL(env, 'newCharacter');

	$(character, url);

};

function $(data, url, env) {
	// event handler
	function reqListener () {
		console.log( this.response );
	}
  
	var newXHR = new XMLHttpRequest();
  
	newXHR.addEventListener( 'load', reqListener );
  
	newXHR.open( 'POST', url );
	newXHR.setRequestHeader("Content-type", "application/json");

	newXHR.onreadystatechange = function(){
		let redirectURL = 'updateFullCharacter/';
		if(env === 'production'){
			url = '/node/' + redirectURL;
		};

		if(url.indexOf('newCharacter') != -1){
	  		if(newXHR.readyState === XMLHttpRequest.DONE && newXHR.status === 200){
				window.location.assign(redirectURL + newXHR.responseText);
			}
		}
	}

  var formattedJsonData = JSON.stringify( data );

  newXHR.send( formattedJsonData );

};