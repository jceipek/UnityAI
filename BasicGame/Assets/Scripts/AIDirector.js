#pragma strict

public enum Difficulties {

	Easy,
	Medium,
	Hard,
	DanteMustDie

}
var characterHealth : CharacterHealth;
var utilityKey : UtilityKey;
public var difficulty : Difficulties; 
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

//other factor to include, maybe add a timer? For every minute key is not found, increase difficulty?


function determineDifficulty(ammo : int, hp : int){
	Debug.Log(hp);
	Debug.Log(ammo);
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