#pragma strict

var source : Vector3;
var dir : Vector3; 
//var tip : Transform;

function Fire () {
	var hit : RaycastHit;
//		source = tip.position;
//		dir = transform.right;
//		if (Physics.Raycast (source, dir, hit)) {
//				//send message to hit thing to disapear
//				hit.collider.gameObject.SendMessage("ApplyDamage",1.0,SendMessageOptions.DontRequireReceiver);
//		}

	var x = Screen.width / 2;
    var y = Screen.height / 2;

    var ray = camera.ScreenPointToRay(Vector3(x, y, 0));

    Debug.DrawRay(ray.origin, ray.direction * 1000, Color.yellow);
    
    		if (Physics.Raycast (ray, hit)) {
			//send message to hit thing to disapear
				hit.collider.gameObject.SendMessage("ApplyDamage",1.0,SendMessageOptions.DontRequireReceiver);
		}
	

}

//function OnDrawGizmos () {
//	Gizmos.color = Color.red;
//	//Debug.Log(source);
//	//Debug.Log(dir);
//	//Gizmos.DrawRay(source, dir);
//	Gizmos.DrawLine(source,source+dir*20);
//}

