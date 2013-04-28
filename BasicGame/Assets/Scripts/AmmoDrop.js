#pragma strict



function spawnAmmo(){

	var posArray = new Array(Vector3(-25.77965,1.3,11.06246),Vector3(-4.533064,1.3,2.952221),Vector3(19.22656,1.3,9.120594));
	var ammo : GameObject = Instantiate(Resources.Load("box_wooden")) as GameObject;
	var index : int = Random.Range(1,4) -1;
	ammo.transform.position = posArray[index];

}
