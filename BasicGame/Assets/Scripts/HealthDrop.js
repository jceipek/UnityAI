#pragma strict

function Start(){

	InvokeRepeating("spawnHealth", 0, 30.0);
}



function spawnHealth(){
	var spawnPoints = GameObject.FindGameObjectsWithTag ("healthSpawnPoint");
	
	if (spawnPoints && spawnPoints.length > 0){
		var ammo : GameObject = Instantiate(Resources.Load("HealthBox")) as GameObject;
		var index : int = Random.Range(0,spawnPoints.length-1);
		ammo.transform.position = spawnPoints[index].transform.position;
	}
}
