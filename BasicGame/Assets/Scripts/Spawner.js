#pragma strict

//enemy settings
public var numEnemy : int = 0;
public var totalEnemy : int = 10;
public var spawnedEnemy : int = 0;

public enum SpawnTypes {

	Normal,
	Wave,
	TimedWave,
	Once

}

private var SpawnId : int;

//Spawn States
private var waveSpawn : boolean = false;
public var Spawn : boolean = true;
//public SpawnTypes spawnType = SpawnTypes.Normal;
public var waveTimer : float = 30.0f;
private var timeTillWave : float = 0.0f;
public var totalWaves : int = 5;
private var numWaves : int = 0;

function Start () {
	SpawnID = Range(1,500);
}

function Update() {

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
	if (Enemy != null){
		var Enemy : GameObject = Instantiate(Enemy, gameObject.transform.position, Quaternion.identity);
	}
	else{
	Debug.Log("No Enemy Prefab Loaded");
	}
	numEnemy++;
	spawnedEnemy++;
}

function killEnemy(sId : int){
	if(SpawnID == sID){
		numEnemy--;
	}
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