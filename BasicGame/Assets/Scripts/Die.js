#pragma strict

var source : Vector3;
var dir : Vector3; 
var tip : Transform;

function Fire () {
		var hit : RaycastHit;
		source = tip.position;
		dir = transform.right;
		if (Physics.Raycast (source, dir, hit)) {
				//send message to hit thing to disapear
				hit.collider.gameObject.SendMessage("ApplyDamage",1.0,SendMessageOptions.DontRequireReceiver);
		}

}

function OnDrawGizmos () {
	Gizmos.color = Color.red;
	//Debug.Log(source);
	//Debug.Log(dir);
	//Gizmos.DrawRay(source, dir);
	Gizmos.DrawLine(source,source+dir*20);
}

