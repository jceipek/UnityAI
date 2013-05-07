#pragma strict

//inialize variables
var other : GameObject;
var utilityKey : UtilityKey;
var gun : GameObject;
var ammoIncrease : int;
private var characterHealth : CharacterHealth = null;

function Awake(){
	ammoIncrease = 20; //how much ammo you get from picking up crates
	var thePlayer = GameObject.FindWithTag("Player");	//find player
	characterHealth = thePlayer.GetComponent(CharacterHealth); //get player health
}

function OnTriggerEnter(other : Collider) { //When Player Collides with trigger
	//Debug.Log("entered1");
	var utilityKey: UtilityKey = gun.gameObject.GetComponent(UtilityKey); //increase ammo in the gun object (techincally applied to the camera as camera is raycasting)
	if (other.gameObject.tag == "Ammo"){ //destrong ammo object and increase ammo count
		Destroy(other.gameObject);
		utilityKey.ammoCount += ammoIncrease;
	}
	else if (other.gameObject.tag == "healthCrate"){ //if collision with health, increase player health and destroy health box object
		Debug.Log("entered hp");
		Destroy(other.gameObject);
		characterHealth.hp += 15;
	}
	
	
}
