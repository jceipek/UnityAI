#pragma strict

var hp : int;

function Start () {

hp = 500;

}

function OnCollisionEnter(collision : Collision){
	if (collision.gameObject.tag == "Enemy"){
	Debug.Log("hit");
	hp--;
	}
}
