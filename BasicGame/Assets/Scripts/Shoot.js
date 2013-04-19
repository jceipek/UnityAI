#pragma strict

var utilityKey: UtilityKey = GetComponent(UtilityKey); 

function Update () {
	if (Input.GetButtonDown ("Fire1")){
		//Fire();
		utilityKey.ammoCount -= 1;
	}
}