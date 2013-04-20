#pragma strict

var source : Vector3;
var dir : Vector3; 
		

function Fire () {
		Debug.Log("fire");
		var hit : RaycastHit;
		source = gameObject.transform.position;
		dir = transform.forward;
		if (Physics.Raycast (source, dir, hit)) {
				//send message to hit thing to disapear
				hit.collider.gameObject.SendMessage("ApplyDamage",1.0);
		}

}

function OnDrawGizmos () {
	Gizmos.color = Color.red;
	Debug.Log(source);
	Debug.Log(dir);
	//Gizmos.DrawRay(source, dir);
	Gizmos.DrawLine(source,source+dir*20);
}