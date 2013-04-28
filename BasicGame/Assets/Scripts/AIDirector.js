#pragma strict

public enum Difficulties {

	Easy,
	Medium,
	Hard,
	DanteMustDie

}
var characterHealth : CharacterHealth;
var utilityKey : UtilityKey;
public var difficulty : Difficulties = Difficulties.Easy; 
var enemyHP : int;
var totalEnemy : int;
var ammoTimer : float;

function Update(){

	var ammo = utilityKey.ammoCount;
	var hp = characterHealth.hp;

	determineDifficulty(ammo,hp);

	if(difficulty == Difficulties.Easy){
	
	enemyHP = 1;
	totalEnemy = 3;
	ammoTimer = 30.0f;
	
	}
	else if(difficulty == Difficulties.Medium){
	
	enemyHP = 3;
	totalEnemy = 5;
	ammoTimer = 45.0f;
	
	}
	else if(difficulty == Difficulties.Hard){
	
	enemyHP = 5;
	totalEnemy = 10;
	ammoTimer = 60.0f;
	
	}
	else if(difficulty == Difficulties.DanteMustDie){
	
	enemyHP = 5;
	totalEnemy = 15;
	ammoTimer = 120.0f;
	
	}


}

//other factor to include, maybe add a timer? For every minute key is not found, increase difficulty?


function determineDifficulty(ammo : int, hp : int){

	if (hp <= 30 && ammo <= 30){
		difficulty = Difficulties.Easy;
	}
	else if (hp <= 50 && ammo <= 50){
		difficulty = Difficulties.Medium;
	}
	else if (hp <= 75 && ammo <100){
		difficulty = Difficulties.Hard;
	}
	else if (hp > 90 && ammo >200){
		difficulty = Difficulties.DanteMustDie;
	}
}