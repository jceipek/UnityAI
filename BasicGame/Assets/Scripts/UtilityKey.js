#pragma strict

var self : GameObject;
var ammo : GameObject; //address
public var ammoCount : int;

function Update () {

	if (Input.GetKeyDown ("e")){
		//if (ammo.enabled == true) //ammo is visible within range
			ammoCount += 5;
	}

}

