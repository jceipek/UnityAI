#pragma strict

var hp : int;

function Start () {

	hp = 3;

}

function ApplyDamage (damage : float) {
        print (damage);
        hp -= damage;
    }