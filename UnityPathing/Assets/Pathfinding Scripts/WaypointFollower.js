#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that makes an object randomly follow connected Waypoints.
//

import System.Collections.Generic;


var currWaypoint : Waypoint;
var endWaypoint : Waypoint;
var confirmationDistance : float;
var confirmationAngle : float;
var moveSpeedWhileTurning : float;
var moveSpeed : float;
var turnSpeed : float;
private var pathWaypoints : List.<Waypoint>;
private var aiSystem : Pathfinder;
private var controller : CharacterController;

function Start () {
	controller = GetComponent(CharacterController);
	var aiSystemContainer : GameObject;
	aiSystemContainer = GameObject.FindWithTag ("AI System");
	aiSystem = aiSystemContainer.GetComponent(Pathfinder);
	if (endWaypoint != null) {
		currWaypoint = aiSystem.GetClosestWaypointToPoint(transform.position);
		pathWaypoints = aiSystem.FindRoute(currWaypoint, endWaypoint);
	}	
}

function Update () {
	var o : Vector3 = new Vector3(currWaypoint.transform.position.x, 0, currWaypoint.transform.position.z);
	var t : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);
	var relativePos = o-t;//currWaypoint.transform.position - transform.position;
	var rotation = Quaternion.LookRotation(relativePos);
	//var angleOffset = Vector3.Angle(relativePos, transform.forward)
	if ((o - t).magnitude <= confirmationDistance) {
		// In Range, distancewise
		//var options : Waypoint[] = currWaypoint.linkedTo;
		
		if (pathWaypoints.Count > 0) {
			currWaypoint = pathWaypoints[pathWaypoints.Count-1];
			pathWaypoints.RemoveAt(pathWaypoints.Count-1);
		}
		
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