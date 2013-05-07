#pragma strict

//dead code from outdated game structure

var utilityKey : UtilityKey;

function Used (hit : float) {

	var utilityKey: UtilityKey = GetComponent(UtilityKey);
	utilityKey.ammoCount += 10;

}