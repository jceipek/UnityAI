#pragma strict
var other : GameObject;
var utilityKey : UtilityKey;
var gun : GameObject;
var ammoIncrease : int;
private var characterHealth : CharacterHealth = null;

function Awake(){
	var thePlayer = GameObject.FindWithTag("Player");
	characterHealth = thePlayer.GetComponent(CharacterHealth);
}

function OnTriggerEnter(other : Collider) {
	Debug.Log("entered1");
	var utilityKey: UtilityKey = gun.gameObject.GetComponent(UtilityKey);
	if (other.gameObject.tag == "Ammo"){
		Destroy(other.gameObject);
		utilityKey.ammoCount += ammoIncrease;
	}
	else if (other.gameObject.tag == "healthCrate"){
		Debug.Log("entered hp");
		Destroy(other.gameObject);
		characterHealth.hp += 15;
	}
	
	
}
