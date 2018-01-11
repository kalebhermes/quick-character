var statName = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

function findMod(stat){
	let num = Math.floor((stat - 10) / 2);
	if(num > -1) num = '+' + num;
	return num;
}

function updateImage(){
	let imageURL = document.getElementById('image').value;
	document.getElementById('charImage').src = imageURL;
}

function updateMod(type){
	console.log(type);
	let fullStat = document.getElementById(type).value;
	console.log(document.getElementById(type+'_mod'));
	document.getElementById(type+'_mod').textContent = findMod(fullStat);
}

function postCharUpdate(id){
	update = {
		hp: document.getElementById('hp_'+id).value,
		// notes: document.getElementById('notes_'+id).value,
		notes: '',
		id: id
	};
	$(update, 'http://localhost:3000/updateCharacter');
};

function postSpellUpdate(id){
	var numbers = {};
	for(var x=1;x<10;x++){
		numbers[x] = document.getElementById('spellSlot_'+id+'_'+x).value;
	}
	numbers['id'] = id;
	$(numbers, 'http://localhost:3000/updateSpells');
};

function postStatUpdate(id){
	var stats = {};
	for(var x=0;x<statName.length;x++){
		stats[statName[x]] = document.getElementById(statName[x]).value;
	}
	stats['id'] = id;
	$(stats, 'http://localhost:3000/updateStats');
}

function saveFullCharacter(id){
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
	}

	console.log(character);

	postSpellUpdate(id);
	postStatUpdate(id);
	$(character, 'http://localhost:3000/updateFullCharacter/' + id);

};

function newCharacter(){
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

	$(character, 'http://localhost:3000/newCharacter');

};

function $(data, url) {
	// event handler
	function reqListener () {
		console.log( this.response );
	}
  
	var newXHR = new XMLHttpRequest();
  
	newXHR.addEventListener( 'load', reqListener );
  
	newXHR.open( 'POST', url );
	newXHR.setRequestHeader("Content-type", "application/json");

	newXHR.onreadystatechange = function(){
  		console.log(newXHR.readyState);
  		console.log(newXHR.status);
  		console.log(newXHR.responseText);

		if(url.indexOf('newCharacter') != -1){
	  		if(newXHR.readyState === XMLHttpRequest.DONE && newXHR.status === 200){
	  			window.location.assign('/updateFullCharacter/' + newXHR.responseText);
			}
		}
	}

  var formattedJsonData = JSON.stringify( data );

  newXHR.send( formattedJsonData );

};