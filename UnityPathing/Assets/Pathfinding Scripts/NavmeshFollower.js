#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that makes an object randomly follow connected Waypoints.
//

import System.Collections.Generic;


var currPoint : Vector3;
var endTransform : Transform;
var endPoint : Vector3;
var confirmationDistance : float;
var confirmationAngle : float;
var moveSpeedWhileTurning : float;
var moveSpeed : float;
var turnSpeed : float;
private var pathPoints : List.<Vector3>;
private var aiSystem : Pathfinder;
private var controller : CharacterController;

function Start () {
	controller = GetComponent(CharacterController);
	var aiSystemContainer : GameObject;
	aiSystemContainer = GameObject.FindWithTag ("AI System");
	aiSystem = aiSystemContainer.GetComponent(Pathfinder);

	if (endTransform != null) {
		RecomputePath();
	}	
}

function RecomputePath () {
	endPoint = endTransform.position;
 	currPoint = transform.position;
 	Debug.Log(endPoint);
 	Debug.Log(currPoint);
 	Debug.Log("Finding Points:");
	pathPoints = aiSystem.FunnelAlgorithm(currPoint, endPoint, gameObject.transform.up);	
}

function Update () {
	var o : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);
	var t : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);
	var relativePos = o-t;
	var rotation;
	
	if (endPoint != endTransform.position) {
		RecomputePath();
	}

	if ((o - t).magnitude <= confirmationDistance) {
		// In Range, distancewise
		if (pathPoints.Count > 0) {
			currPoint = pathPoints[pathPoints.Count-1];
			pathPoints.RemoveAt(pathPoints.Count-1);
		}
		
	} else if ( Vector3.Angle(relativePos, transform.forward) <= confirmationAngle) {
		// In Range, anglewise
		controller.Move(transform.forward * moveSpeed * Time.deltaTime);
		controller.Move(transform.up * -1 * moveSpeed * Time.deltaTime);
	} else {
		rotation = Quaternion.LookRotation(relativePos);
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