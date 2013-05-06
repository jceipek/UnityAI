#pragma strict

var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;



function OnTriggerStay(other : Collider){
	//Debug.Log("stay");
    gameObject.tag = "Untagged";

}

 

function OnTriggerExit(other : Collider){
	//Debug.Log("empty");
    spawnPoint.tag = "healthSpawnPoint";

}
