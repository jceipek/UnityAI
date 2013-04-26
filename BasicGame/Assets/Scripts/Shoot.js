#pragma strict

var utilityKey : UtilityKey;
var die : Die;

function Update () {
	var die : Die = GetComponent(Die);
	var utilityKey: UtilityKey = GetComponent(UtilityKey);
	
	if (Input.GetButtonDown ("Fire1") && utilityKey.ammoCount > 0){
		
		die.Fire();
		
		utilityKey.ammoCount -= 1;
		
		audio.Play();
		
		
	}
	if (Input.GetButtonDown ("Fire2") ){
		
		utilityKey.pickUpAmmo();
	
	}
}

