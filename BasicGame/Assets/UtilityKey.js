#pragma strict

var self : GameObject;
var ammo : GameObject; //address
var ammoCount : int;

function Update () {

	if (Input.GetKeyDown ("e")){
		if (ammo.renderer.enabled == true){ //there is ammo visible and within a certain distance
			ammo.renderer.enabled = false; //make ammo box disappear
			ammoCount+=5; //add bullets	
			}
	}
}