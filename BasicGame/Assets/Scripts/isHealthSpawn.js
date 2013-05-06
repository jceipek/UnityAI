#pragma strict
var other : GameObject;
var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;



function OnTriggerEnter(other : Collider){
	Debug.Log("entered2");
    gameObject.tag = "Untagged";

}

 

function OnTriggerExit(other : Collider){
	//Debug.Log("empty");
    spawnPoint.tag = "healthSpawnPoint";

}
