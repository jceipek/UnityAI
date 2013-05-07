#pragma strict

var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;

function OnTriggerStay(other : Collider){ //When Ammo is in spawn point, declare point unavailable for spawning
	//Debug.Log("stay");
    gameObject.tag = "Untagged";

}


function OnTriggerExit(other : Collider){ // When spawn point unoccupied, declare valid spawn point

    spawnPoint.tag = "ammoSpawnPoint";

}
