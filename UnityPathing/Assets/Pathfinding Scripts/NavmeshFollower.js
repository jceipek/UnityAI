#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that makes an object randomly follow connected Waypoints.
//

import System.Collections.Generic;

var followRadius : float;
var prevPoint : Vector3;
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
 	Debug.Log("Finding Points...");
	pathPoints = aiSystem.FunnelAlgorithm(currPoint, endPoint, gameObject.transform.up);	
}

function Update () {
	//var o : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);

	var rotation : Quaternion;
	var predictedPt : Vector3 = transform.position + transform.forward * moveSpeed * 0.5;
	var projectedPt : Vector3 = ClosestPointOnLineToPoint(prevPoint, currPoint, predictedPt);
	
	var g : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);
	var o : Vector3 = new Vector3(projectedPt.x, 0, projectedPt.z);
	var t : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);
	
	if (endPoint != endTransform.position) {
		RecomputePath();
	}

	if ((g - t).magnitude <= confirmationDistance) {
		// In Range, distancewise
		if (pathPoints.Count > 0) {
			prevPoint = currPoint;
			currPoint = pathPoints[pathPoints.Count-1];
			pathPoints.RemoveAt(pathPoints.Count-1);
			Debug.Log("Removed Pt");
		}	
	} else {
		//Debug.Log((predictedPt - projectedPt).magnitude);
		if ((predictedPt - projectedPt).magnitude > followRadius) {
			
			// Correct towards projectedPt
			rotation = Quaternion.LookRotation(o-t);
	    	transform.rotation = Quaternion.Lerp (transform.rotation, rotation, Time.deltaTime * turnSpeed);
		} else {
			// Move
			// Debug.Log((predictedPt - projectedPt).magnitude);
			// controller.Move(transform.forward * moveSpeed * Time.deltaTime);
			// controller.Move(transform.up * -1 * moveSpeed * Time.deltaTime);
		}
	}

	/*
	if ((o - t).magnitude <= confirmationDistance) {
		// In Range, distancewise
		if (pathPoints.Count > 0) {
			prevPoint = currPoint;
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
	*/
	
}

// http://forum.unity3d.com/threads/8114-math-problem?p=59715
function ClosestPointOnLineToPoint(a : Vector3, b : Vector3, pt : Vector3): Vector3 {
	return Vector3.Project((pt-a),(b-a))+a;
}

function OnDrawGizmos () {
	Gizmos.color = Color.magenta;
	if (pathPoints != null) {
		for (var i = 0; i < pathPoints.Count-1; i++) {
			Gizmos.DrawWireCube(pathPoints[i], Vector3.one*0.4);
			Gizmos.DrawLine(pathPoints[i]+Vector3.up*0.2, pathPoints[i+1]+Vector3.up*0.2);
		}
		if (pathPoints.Count > 0) {
			Gizmos.color = Color.green;
			Gizmos.DrawWireSphere(pathPoints[0], 0.3f);
			Gizmos.color = Color.red;
			Gizmos.DrawWireSphere(pathPoints[pathPoints.Count-1], 0.3f);			
		}
		
	}

	Gizmos.DrawWireSphere(transform.position, confirmationDistance);
	Gizmos.color = Color.red;
	Gizmos.DrawRay(transform.position,  transform.TransformDirection (Vector3.forward) * moveSpeed * 0.5);


}