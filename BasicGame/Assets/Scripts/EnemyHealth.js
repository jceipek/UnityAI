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
        yield WaitForAnimation( animation );
        animation.Play("walk");
}
    
function Update () {

	if (hp == 0) {
		Destroy(gameObject);
		arena.SendMessage("killEnemy",SendMessageOptions.DontRequireReceiver);
	}

}

function WaitForAnimation ( animation : Animation )
{
    yield; while ( animation.isPlaying ) yield;
}