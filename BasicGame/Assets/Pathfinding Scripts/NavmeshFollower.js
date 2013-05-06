#pragma strict

// Copyright (C) 2013 Julian Ceipek and Alex Adkins
//
// A component that makes an object follow Waypoints on a navmesh in sequence.
//

import System.Collections.Generic;

var fakeGravity : float;

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

public var recomputePathTimeInterval : float = 0.0;
private var timeTillRecomputePath : float = 0.0;

public var raycastTimeInterval : float = 0.0;
private var timeTillLocalRaycast : float = 0.0;

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
	
 	if (!(aiSystem.GetTriangleWaypointOfPoint(transform.position) == null) &&
 		!(aiSystem.GetTriangleWaypointOfPoint(endTransform.position) == null)) {
 		endPoint = endTransform.position;
 		currPoint = transform.position;
 		
 		pathPoints = aiSystem.FunnelAlgorithm(currPoint, endPoint, gameObject.transform.up);
 		timeTillRecomputePath = recomputePathTimeInterval;
 	}
	
}

function Update () {
	var rotation : Quaternion;
	var dTime : float = Time.deltaTime;
	//Uses vector and speed to predict next position of char
	predictedPt = transform.position + transform.forward * moveSpeed * followRadiusSpeedFactor;
	//Gets closest point on line to where char is going to be
	projectedPt = ClosestPointOnLineToPoint(prevPoint, currPoint, predictedPt);
	
	var currGoalVector : Vector3 = new Vector3(currPoint.x, 0, currPoint.z);
	var currProjectionVector : Vector3 = new Vector3(projectedPt.x, 0, projectedPt.z);
	var currLocVector : Vector3 = new Vector3(transform.position.x, 0, transform.position.z);

	if (endPoint != endTransform.position && timeTillRecomputePath <= 0.0) {
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
	    	transform.rotation = Quaternion.Lerp (transform.rotation, rotation, dTime * turnSpeed);
		}
//		Debug.Log("Move!");
		controller.Move(transform.forward * moveSpeed * dTime);
	}

	// Apply gravity
	controller.Move(-1 * transform.up * fakeGravity * dTime);

	timeTillRecomputePath -= Time.deltaTime;

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