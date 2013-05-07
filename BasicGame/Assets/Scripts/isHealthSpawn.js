#pragma strict
var other : GameObject;
var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;



function OnTriggerEnter(other : Collider){ // When spawn point occupied, declare invalid spawn point
	Debug.Log("entered2");
    gameObject.tag = "Untagged";

}

 

function OnTriggerExit(other : Collider){ // When spawn point unoccupied, declare valid spawn point
	//Debug.Log("empty");
    spawnPoint.tag = "healthSpawnPoint";

}
