#pragma strict

var other : GameObject;
var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;



function OnTriggerStay(other : Collider){
	//Debug.Log("stay");
    gameObject.tag = "Untagged";

}

 

function OnTriggerExit(other : Collider){

    spawnPoint.tag = "enemySpawnPoint";
    

}

function OnDrawGizmos () {
	Gizmos.color = Color.red;
	Gizmos.DrawCube(transform.position, Vector3.one);
}