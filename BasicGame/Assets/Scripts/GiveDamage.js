#pragma strict

var characterHealth : CharacterHealth;

function OnControllerColliderHit(hit : ControllerColliderHit){

	characterHealth = GetComponent(CharacterHealth);

	if (hit.collider.gameObject.name != "Floor")
		Debug.Log(hit.collider.gameObject.tag + hit.collider.gameObject);
	if (hit.collider.gameObject.tag == "Player"){
		Debug.Log("hit");
		if (characterHealth.hp)
			characterHealth.hp--;
	}
}
