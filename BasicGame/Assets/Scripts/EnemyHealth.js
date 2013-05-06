#pragma strict

var hp : int;
var arena : GameObject;
var aiDirector : AIDirector;

function Start () {
	arena = GameObject.FindWithTag ("Respawn");
	aiDirector = arena.GetComponent(AIDirector);
	hp = aiDirector.enemyHP;
}

function ApplyDamage (damage : float) {
        hp -= damage;
        animation.Play("dead", PlayMode.StopSameLayer);
        animation.Play("walk");
}
    
function Update () {

	if (hp == 0) {
		Destroy(gameObject);
		arena.SendMessage("killEnemy",SendMessageOptions.DontRequireReceiver);
	}

}