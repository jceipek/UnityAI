#pragma strict

var hp : int;

function Start () {

hp = 100;

}

function OnCollisionEnter(other : Collision){
	hp--;
}
