#pragma strict

var utilityKey : UtilityKey;
var characterHealth : CharacterHealth;
var target : Texture2D;

function OnGUI () {
	//represent amount to ammo to player
	var ammoString = "Ammo \n" + utilityKey.ammoCount;
	GUI.Box (new Rect (Screen.width - 100,Screen.height - 50,100,50), ammoString);
	//GUI.Box (new Rect (0,0,100,50), "HP \n" + characterHealth.hp);

	//Tell player when they've died.
	if (characterHealth.hp == 0) {
		GUI.Box(new Rect (Screen.width/2-50, Screen.height/2-20, 100, 20), "YOU DIED");
	
	}
}