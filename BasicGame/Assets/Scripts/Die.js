#pragma strict

var target : Transform;

function Fire () {
		var hit : RaycastHit;
		var source : Vector3 = gameObject.transform.position;
		var dir : Vector3 = (transform.position + Vector3.up*0.2) - source;
		if (Physics.Raycast (source, dir, hit)) {
				//send message to hit thing to disapear
				gameObject.SendMessage("ApplyDamage",1.0);
		}

}