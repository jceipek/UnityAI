#pragma strict

var utilityKey : UtilityKey;

function Used (hit : float) {

	var utilityKey: UtilityKey = GetComponent(UtilityKey);
	utilityKey.ammoCount += 10;

}