#pragma strict

var aiDirector : AIDirector;
var interval : float;
var timer : float;

function Start(){
	//timer = Time.time + interval;
}

function Update(){

	interval = aiDirector.ammoTimer;

	if(Time.time >= timer){
		Debug.Log("Spawned Ammo");
    	spawnAmmo();
    	timer = Time.time + interval;
  }

}


function spawnAmmo(){

	var spawnPoints = GameObject.FindGameObjectsWithTag ("ammoSpawnPoint");
	var ammo : GameObject = Instantiate(Resources.Load("box_wooden")) as GameObject;
	var index : int = Random.Range(1,spawnPoints.length + 1) -1;
	ammo.transform.position = spawnPoints[index].transform.position;

}
