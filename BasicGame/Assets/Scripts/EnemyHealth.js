#pragma strict

var hp : int;
var arena : GameObject;
function Start () {
	arena = GameObject.FindWithTag ("Respawn");
	hp = 3;

}

function ApplyDamage (damage : float) {
        print (damage);
        hp -= damage;
    }
    
function Update () {

	if (hp == 0) {
		Destroy(gameObject);
		arena.SendMessage("killEnemy",SendMessageOptions.DontRequireReceiver);
	}

}