#pragma strict

var utilityKey : UtilityKey;
var die : Die;

function Update () {
	var die : Die = gameObject.GetComponent(Die);
	var utilityKey: UtilityKey = GetComponent(UtilityKey);
	
	if (Input.GetButtonDown ("Fire1") && utilityKey.ammoCount > 0){ //call Fire Gun on mouse click, subtract 1 ammo
		
		die.Fire();
		
		utilityKey.ammoCount -= 1;
		
		audio.Play();
		
		
	}
}

