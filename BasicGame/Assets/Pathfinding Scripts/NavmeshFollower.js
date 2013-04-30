#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that makes an object randomly follow connected Waypoints.
//

import System.Collections.Generic;

var followRadiusSpeedFactor : float;
var followRadius : float;
var prevPoint : Vector3;
var currPoint : Vector3;
var endTransform : Transform;
var endPoint : Vector3;
var confirmationDistance : float;
var moveSpeed : float;
var turnSpeed : float;
private var pathPoints : List.<Vector3>;
private var aiSystem : Pathfinder;
private var controller : CharacterController;

private var predictedPt : Vector3;
private var projectedPt : Vector3;

function Start () {
	controller = GetComponent(CharacterController);
	var aiSystemContainer : GameObject;
	aiSystemContainer = GameObject.FindWithTag ("AI System");
	aiSystem = aiSystemContainer.GetComponent(Pathfinder);
	endTransform = GameObject.FindWithTag("Player").transform;
	if (endTransform != null) {
		RecomputePath();
	}
}

function RecomputePath () {
	endPoint = endTransform.position;
 	currPoint = transform.position;
 	//Debug.Log(endPoint);
 	//Debug.Log(currPoint);
 	//Debug.Log("Finding Points...");
	pathPoints = aiSystem.FunnelAlgorithm(currPoint, endPoint, gameObject.transform.up);	
}

function Update () {
	//var o : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);

	var rotation : Quaternion;
	predictedPt = transform.position + transform.forward * moveSpeed * followRadiusSpeedFactor;
	projectedPt = ClosestPointOnLineToPoint(prevPoint, currPoint, predictedPt);
	
	var currGoalVector : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);
	var currProjectionVector : Vector3 = new Vector3(projectedPt.x, 0, projectedPt.z);
	var currLocVector : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);
	
	if (endPoint != endTransform.position) {
		RecomputePath();
	}

	if ((currGoalVector - currLocVector).magnitude <= confirmationDistance) {
		// In Range, distancewise
		if (pathPoints.Count > 0) {
			prevPoint = currPoint;
			currPoint = pathPoints[pathPoints.Count-1];
			pathPoints.RemoveAt(pathPoints.Count-1);
			//Debug.Log("Removed Pt");
		}
	} else {
		if ((predictedPt - projectedPt).magnitude > followRadius) {
			rotation = Quaternion.LookRotation(currProjectionVector-currLocVector);
	    	transform.rotation = Quaternion.Lerp (transform.rotation, rotation, Time.deltaTime * turnSpeed);
		}
		//Debug.Log("Move!");
		controller.Move(transform.forward * moveSpeed * Time.deltaTime);
	}

}

// http://forum.unity3d.com/threads/8114-math-problem?p=59715
function ClosestPointOnLineToPoint(vA : Vector3, vB : Vector3, vPoint : Vector3) {
    var vVector1 = vPoint - vA;
    var vVector2 = (vB - vA).normalized;
    var d = Vector3.Distance(vA, vB);
    var t = Vector3.Dot(vVector2, vVector1);

    if (t <= 0) 
        return vA;

    if (t >= d) 
        return vB;

    var vVector3 = vVector2 * t;
    var vClosestPoint = vA + vVector3;
    return vClosestPoint;
}

function OnDrawGizmos () {
	Gizmos.color = Color.magenta;
	if (pathPoints != null) {
		var i : int;
		for (i = 0; i < pathPoints.Count-1; i++) {
			Gizmos.DrawWireCube(pathPoints[i], Vector3.one*0.4);
			Gizmos.DrawLine(pathPoints[i]+Vector3.up*0.2, pathPoints[i+1]+Vector3.up*0.2);
		}
		if (pathPoints.Count > 0) {
			Gizmos.DrawWireCube(pathPoints[pathPoints.Count-1], Vector3.one*0.4);
			Gizmos.color = Color.green;
			Gizmos.DrawWireSphere(prevPoint, 0.3f);
			Gizmos.color = Color.red;
			Gizmos.DrawWireSphere(currPoint, 0.3f);			
		}
		
	}

	Gizmos.DrawWireSphere(transform.position, confirmationDistance);
	Gizmos.color = Color.red;
	Gizmos.DrawRay(transform.position,  transform.TransformDirection (Vector3.forward) * moveSpeed);

	Gizmos.color = Color.yellow;
	Gizmos.DrawWireSphere(predictedPt, 0.3f);
	Gizmos.color = Color.black;
	Gizmos.DrawWireSphere(projectedPt, 0.3f);
}