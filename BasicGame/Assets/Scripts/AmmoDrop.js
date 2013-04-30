#pragma strict

var aiDirector : AIDirector;
var interval : float;

function Start(){
	interval = aiDirector.ammoTimer;
	InvokeRepeating("spawnAmmo", 0, 3.0);
}

function Update(){
	interval = aiDirector.ammoTimer;
}

function spawnAmmo(){
	var spawnPoints = GameObject.FindGameObjectsWithTag ("ammoSpawnPoint");
	
	if (spawnPoints && spawnPoints.length > 0){
		var ammo : GameObject = Instantiate(Resources.Load("box_wooden")) as GameObject;
		var index : int = Random.Range(0,spawnPoints.length-1);
		ammo.transform.position = spawnPoints[index].transform.position;
	}
}
