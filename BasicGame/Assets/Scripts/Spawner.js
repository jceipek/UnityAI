#pragma strict

//enemy settings
public var numEnemy : int = 0;
public var totalEnemy : int;
public var spawnedEnemy : int = 0;

public enum SpawnTypes {

	Normal,
	Wave,
	TimedWave,
	Once

}

var spawnType : SpawnTypes = SpawnTypes.Normal; 

private var SpawnID : int;

//Spawn States
private var waveSpawn : boolean = false;
public var Spawn : boolean = true;
//public SpawnTypes spawnType = SpawnTypes.Normal;
public var waveTimer : float = 30.0f;
private var timeTillWave : float = 0.0f;
public var totalWaves : int = 5;
private var numWaves : int = 0;

var aiDirector : AIDirector;

function Start () {
	SpawnID = Random.Range(1,500);
}

function Update() {

	totalEnemy = aiDirector.totalEnemy;

	if(Spawn){
		if (spawnType == SpawnTypes.Normal){
			if(numEnemy < totalEnemy){
				spawnEnemy();
			}
		}
		else if (spawnType == SpawnTypes.Once){
			if(spawnedEnemy >= totalEnemy){
				Spawn = false;
			}
			else{
				spawnEnemy();
			}
		}
		else if (spawnType == SpawnTypes.Wave){
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
		else if (spawnType == SpawnTypes.TimedWave){
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

function spawnEnemy(){

	var spawnPoints = GameObject.FindGameObjectsWithTag ("enemySpawnPoint");
	if (spawnPoints && spawnPoints.length > 0){

		var enemy : GameObject = Instantiate(Resources.Load("CaveWorm_anim")) as GameObject;
		var index : int = Random.Range(0,spawnPoints.length-1);
		enemy.transform.position = spawnPoints[index].transform.position;

		numEnemy++;
		spawnedEnemy++;
}}

function OnDrawGizmos(){
	var posArray = new Array(Vector3(19.25551,1.3,17.81644),Vector3(-27.39346,1.3,-15.63889),Vector3(14.38626,1.3,-17.83782));
	Gizmos.color = Color.green;
	//Gizmos.DrawSphere(Vector3(19.25551,1.3,17.81644), 1);
	//Gizmos.DrawSphere(Vector3(-25.39346,1.3,-15.63889), 1);
	//Gizmos.DrawSphere(Vector3(14.38626,1.3,-16.83782), 1);

}
    
function killEnemy(){
	numEnemy--;
}

function enableSpawner(sID : int){
	if (SpawnID == sID){
		Spawn = false;
	}
}

function TimeTillWave(){
	return timeTillWave;
}

function enableTrigger(){
	Spawn = true;
}