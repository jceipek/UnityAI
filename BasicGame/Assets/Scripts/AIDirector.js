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

function Update(){

	var ammo = utilityKey.ammoCount;
	var hp = characterHealth.hp;

	determineDifficulty(ammo,hp);

	if(difficulty == Difficulties.Easy){
	
	enemyHP = 1;
	totalEnemy = 3;
	//freqency of ammo drops = 1 per 30s;
	
	}
	else if(difficulty == Difficulties.Medium){
	
	enemyHP = 3;
	totalEnemy = 5;
	//freqency of ammo drops = 1 per 45s;
	
	}
	else if(difficulty == Difficulties.Hard){
	
	enemyHP = 5;
	totalEnemy = 10;
	//freqency of ammo drops = 1 per 60s;
	
	}
	else if(difficulty == Difficulties.DanteMustDie){
	
	enemyHP = 5;
	totalEnemy = 15;
	//freqency of ammo drops = 1 per 120s;
	
	}


}


function determineDifficulty(ammo : int, hp : int){

	if (hp <= 30 || ammo <= 30){
		difficulty = Difficulties.Easy;
	}
	else if (hp <= 50 || ammo <= 50){
		difficulty = Difficulties.Medium;
	}
	else if (hp <= 75 || ammo <100){
		difficulty = Difficulties.Hard;
	}
	else if (hp > 90 && ammo >200){
		difficulty = Difficulties.DanteMustDie;
	}
}