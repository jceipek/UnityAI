#pragma strict

var hp : int;
var self : GameObject;

function Start () {

	hp = 3;

}

function ApplyDamage (damage : float) {
        print (damage);
        hp -= damage;
    }
    
function Update () {

	if (hp == 0) {
		Destroy(self);
	}

}