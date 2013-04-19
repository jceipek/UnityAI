#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that makes an object randomly follow connected Waypoints.
//

var currWaypoint : Waypoint;
var oldWaypoints : Waypoint[] = new Waypoint[2];
var confirmationDistance : float;
var confirmationAngle : float;
var moveSpeedWhileTurning : float;
var moveSpeed : float;
var turnSpeed : float;
private var controller : CharacterController;

function Start () {
	controller = GetComponent(CharacterController);
	oldWaypoints[0] = currWaypoint;
	oldWaypoints[1] = currWaypoint;
}

function Update () {
	var o : Vector3 = new Vector3(currWaypoint.transform.position.x, 0, currWaypoint.transform.position.z);
	var t : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);
	var relativePos = o-t;//currWaypoint.transform.position - transform.position;
	var rotation = Quaternion.LookRotation(relativePos);
	//var angleOffset = Vector3.Angle(relativePos, transform.forward)
	if ((o - t).magnitude <= confirmationDistance) {
		// In Range, distancewise
		var options : Waypoint[] = currWaypoint.linkedTo;
		
		do {
			var rand : int = Random.Range(0,options.length);
			currWaypoint = options[rand];

		} while ((currWaypoint == oldWaypoints[0] || currWaypoint == oldWaypoints[1]) && options.length > 1);
		
		oldWaypoints[0] = oldWaypoints[1];
		oldWaypoints[1] = currWaypoint;
		
	} else if ( Vector3.Angle(relativePos, transform.forward) <= confirmationAngle) {
		// In Range, anglewise
		controller.Move(transform.forward * moveSpeed * Time.deltaTime);
		controller.Move(transform.up * -1 * moveSpeed * Time.deltaTime);
	} else {
    	transform.rotation = Quaternion.Lerp (transform.rotation, rotation, Time.deltaTime * turnSpeed);

		controller.Move(transform.forward * moveSpeedWhileTurning * Time.deltaTime);
		controller.Move(transform.up * -1 * moveSpeedWhileTurning * Time.deltaTime);
	}
	
}

function OnDrawGizmos () {
	Gizmos.DrawWireSphere(transform.position, confirmationDistance);
	Gizmos.color = Color.red;
	Gizmos.DrawRay(transform.position,  transform.TransformDirection (Vector3.forward) * moveSpeed * 0.5);
}