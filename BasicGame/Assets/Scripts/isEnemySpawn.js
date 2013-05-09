#pragma strict

var other : GameObject;
var SpawnPoint : Transform;
var spawnPoint : GameObject;
collider.isTrigger = true;



function OnTriggerStay(other : Collider){ //Not a spawn point when enemy in region,  prevent spiders from being on top of each other
	//Debug.Log("stay");
    gameObject.tag = "Untagged";

}

 

function OnTriggerExit(other : Collider){ // When spawn point unoccupied, declare valid spawn point

    spawnPoint.tag = "enemySpawnPoint";
    

}

function OnDrawGizmos () { //show location of spawn point for devs
	Gizmos.color = Color.red;
	Gizmos.DrawCube(transform.position, Vector3.one);
}