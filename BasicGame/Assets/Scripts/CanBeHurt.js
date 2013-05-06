#pragma strict

/*function Start () {

}

function Update () {

}*/

private var characterHealth : CharacterHealth = null;

function Awake(){
	var thePlayer = GameObject.FindWithTag("Player");
	characterHealth = thePlayer.GetComponent(CharacterHealth);
}

function OnTriggerEnter(other : Collider) {
	if (other.gameObject.tag == "Enemy") {
		if (characterHealth.hp) {
			characterHealth.hp-=10;
			
		}
	}
	//WaitForSeconds(5.0);
}