#pragma strict

var utilityKey : UtilityKey;

function OnGUI () {
	var ammoString = "Ammo \n" + utilityKey.ammoCount;
	GUI.Box (new Rect (Screen.width - 100,Screen.height - 50,100,50), ammoString);
	
}