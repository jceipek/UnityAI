#pragma strict

//Based on C# Spawner Script of  Garth de Wet (Corrupted Heart) at mydeathofme[at]gmail[dot]com


//enemy settings
public var numEnemy : int = 0;
public var totalEnemy : int;
public var spawnedEnemy : int = 0;

//types of spawning
public enum SpawnTypes {

	Normal,
	Wave,
	TimedWave,
	Once

}

//default state is normal
var spawnType : SpawnTypes = SpawnTypes.Normal; 

//Spawn States
private var waveSpawn : boolean = false;
public var Spawn : boolean = true;
public var waveTimer : float = 30.0f;
private var timeTillWave : float = 0.0f;
public var totalWaves : int = 5;
private var numWaves : int = 0;

var aiDirector : AIDirector;

function Update() {

	//change variable based on AI director's settings
	totalEnemy = aiDirector.totalEnemy;

	if(Spawn){
		if (spawnType == SpawnTypes.Normal){ //Normal Mode: When one enemy is destroy, spawn a new one it ints place
			if(numEnemy < totalEnemy){
				spawnEnemy();
			}
		}
		else if (spawnType == SpawnTypes.Once){ //Once Mode: Spawn Enemies until reach max number of enemies, then never spawn again
			if(spawnedEnemy >= totalEnemy){
				Spawn = false;
			}
			else{
				spawnEnemy();
			}
		}
		else if (spawnType == SpawnTypes.Wave){ //Spawn in waves, spawn to max number totalWaves # amount of times
			if(numWaves < totalWaves + 1){
				if (waveSpawn){
					spawnEnemy();
				}
				if (numEnemy == 0){
					waveSpawn = true;
					numWaves++;
				}
				if (numEnemy == totalEnemy){
					waveSpawn = false;
				}
			}
		}
		else if (spawnType == SpawnTypes.TimedWave){ //Wave is based on timer
			if (numWaves <= totalWaves){
				timeTillWave += Time.deltaTime;
				if (waveSpawn){
					spawnEnemy();
				}
				if (timeTillWave >= waveTimer){
					waveSpawn = true;
					timeTillWave = 0.0f;
					numWaves++;
					numEnemy = 0;
				}
				if (numEnemy >= totalEnemy){
					waveSpawn = false;
				}
			}
			else{
				Spawn = false;
			}
		}
	}
}

function spawnEnemy(){ //Instantiate an Enemy at availble spawn point

	var spawnPoints = GameObject.FindGameObjectsWithTag ("enemySpawnPoint");
	if (spawnPoints && spawnPoints.length > 0){
		Debug.Log("Spawn");
		var enemy : GameObject = Instantiate(Resources.Load("CaveWorm_anim")) as GameObject;
		var index : int = Random.Range(0,spawnPoints.length-1);
		enemy.transform.position = spawnPoints[index].transform.position;

		numEnemy++;
		spawnedEnemy++;
}}

function killEnemy(){ //decrease enemy number variable when one is killed
	numEnemy--;
}