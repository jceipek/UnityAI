#pragma strict
var other : GameObject;
var utilityKey : UtilityKey;
var gun : GameObject;
var ammoIncrease : int;

function OnTriggerEnter(other : Collider) {
	Debug.Log("entered1");
	var utilityKey: UtilityKey = gun.gameObject.GetComponent(UtilityKey);
	if (other.gameObject.tag == "Ammo"){
		Destroy(other.gameObject);
		utilityKey.ammoCount += ammoIncrease;
	}
}
