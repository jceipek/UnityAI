#pragma strict

var aiDirector : AIDirector;
var interval : float;

function Start(){
	interval = aiDirector.ammoTimer; //get ammo drop interval
	InvokeRepeating("spawnAmmo", 0, interval);
}

function Update(){
	interval = aiDirector.ammoTimer;
}

function spawnAmmo(){
	var spawnPoints = GameObject.FindGameObjectsWithTag ("ammoSpawnPoint"); // check for unoccupied spawn points
	
	if (spawnPoints && spawnPoints.length > 0){ //if spawn points available and spawn called...
		var ammo : GameObject = Instantiate(Resources.Load("box_wooden")) as GameObject; //create ammo crate in randomized spawn location
		var index : int = Random.Range(0,spawnPoints.length-1);
		ammo.transform.position = spawnPoints[index].transform.position;
	}
}
