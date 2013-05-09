#pragma strict

/*function Start () {

}

function Update () {

}*/

private var characterHealth : CharacterHealth = null;

function Awake(){
	var thePlayer = GameObject.FindWithTag("Player"); //identify the player character
	characterHealth = thePlayer.GetComponent(CharacterHealth); //pull player health component
}

function OnTriggerEnter(other : Collider) { //when enemy collides with player, player loses health
	if (other.gameObject.tag == "Enemy") {
		if (characterHealth.hp) {
			characterHealth.hp-=10;
			
		}
	}
	//WaitForSeconds(5.0);
}