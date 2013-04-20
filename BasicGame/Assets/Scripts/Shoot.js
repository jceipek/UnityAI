#pragma strict

var utilityKey : UtilityKey;
var die : Die;

function Update () {
	if (Input.GetButtonDown ("Fire1") && utilityKey.ammoCount > 0){
		var die : Die = GetComponent(Die);
		die.Fire();
		var utilityKey: UtilityKey = GetComponent(UtilityKey);
		utilityKey.ammoCount -= 1;
	}
}

