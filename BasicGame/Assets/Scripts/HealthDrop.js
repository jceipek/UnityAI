#pragma strict

function Start(){

	InvokeRepeating("spawnHealth", 0, 30.0); //spawn health every 30 seconds
}



function spawnHealth(){
	var spawnPoints = GameObject.FindGameObjectsWithTag ("healthSpawnPoint"); //check for unoccupied health spawn points
	
	if (spawnPoints && spawnPoints.length > 0){ //when called, spawn on unoccupied spawn point
		var ammo : GameObject = Instantiate(Resources.Load("HealthBox")) as GameObject;
		var index : int = Random.Range(0,spawnPoints.length-1);
		ammo.transform.position = spawnPoints[index].transform.position;
	}
}
