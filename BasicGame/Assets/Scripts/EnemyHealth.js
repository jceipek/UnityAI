#pragma strict

//initiate variables
var hp : int;
var arena : GameObject;
var aiDirector : AIDirector;

function Start () {
	arena = GameObject.FindWithTag ("Arena"); //find arena
	aiDirector = arena.GetComponent(AIDirector);
	hp = aiDirector.enemyHP;
}

function ApplyDamage (damage : float) { //when hit, apply damage and play damaged animation
        hp -= damage; 
        animation.Play("dead", PlayMode.StopSameLayer);
        yield WaitForAnimation( animation );
        animation.Play("walk");
}
    
function Update () {

	if (hp == 0) { // if enemy is dead, destroy enemy object
		Destroy(gameObject);
		arena.SendMessage("killEnemy",SendMessageOptions.DontRequireReceiver);
	}

}

function WaitForAnimation ( animation : Animation ) //start next animation after current one finished
{
    yield; while ( animation.isPlaying ) yield;
}