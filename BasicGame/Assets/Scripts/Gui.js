#pragma strict

var utilityKey : UtilityKey;
var characterHealth : CharacterHealth;
var target : Texture2D;

function OnGUI () {
	var ammoString = "Ammo \n" + utilityKey.ammoCount;
	GUI.Box (new Rect (Screen.width - 100,Screen.height - 50,100,50), ammoString);
	//GUI.Box (new Rect (0,0,100,50), "HP \n" + characterHealth.hp);

}