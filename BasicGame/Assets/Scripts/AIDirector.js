#pragma strict

//create list of modes
public enum Difficulties {

	Easy,
	Medium,
	Hard,
	DanteMustDie

}

//set variables
var characterHealth : CharacterHealth;
var utilityKey : UtilityKey;
public var difficulty : Difficulties; 
var enemyHP : int;
var totalEnemy : int;
var ammoTimer : float;

function Update(){
	//update variables in other scripts
	var ammo = utilityKey.ammoCount;
	var hp = characterHealth.hp;

	//check to see if the difficulty needs to be switches
	determineDifficulty(ammo,hp);

	if(difficulty == Difficulties.Easy){ //easy mode variables
	
	enemyHP = 1;
	totalEnemy = 3;
	ammoTimer = 30.0;
	
	}
	else if(difficulty == Difficulties.Medium){
	
	enemyHP = 3;
	totalEnemy = 5;
	ammoTimer = 45.0;
	
	}
	else if(difficulty == Difficulties.Hard){
	
	enemyHP = 5;
	totalEnemy = 10;
	ammoTimer = 60.0;
	
	}
	else if(difficulty == Difficulties.DanteMustDie){
	
	enemyHP = 5;
	totalEnemy = 15;
	ammoTimer = 120.0;
	
	}


}

//Things to consider is we expand to goal oriented game model:
//Other factor to include, maybe add a timer? For every minute key is not found, increase difficulty?

//change difficulty based on player reasources
function determineDifficulty(ammo : int, hp : int){
	//Debug.Log(hp);
	//Debug.Log(ammo);
	if (hp <= 30 || ammo <= 10){
		difficulty = Difficulties.Easy;
	}
	else if (hp > 50 && ammo > 20 && hp < 80){
		difficulty = Difficulties.Medium;
	}
	else if (hp > 80 && ammo >40 && ammo > 200){
		difficulty = Difficulties.Hard;
	}
	else if (ammo > 200){
		difficulty = Difficulties.DanteMustDie;
	}
}