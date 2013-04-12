#pragma strict

// Copyright (C) 2013 Julian Ceipek & Alex Adkins
//
// A component for pathfinding.
// It requires objects with Waypoint components as children.
// Use PathfindingEditor.js for testing.
//

import System.Collections.Generic;

var startWaypoint : Waypoint;
var endWaypoint : Waypoint;

@HideInInspector
var idealWaypointPath : List.<Waypoint>; // Used to debug the path found during search

function HeuristicCostEstimate(from : Waypoint, to : Waypoint) : float {
	return (from.gameObject.transform.position - to.gameObject.transform.position).magnitude;
}

function WaypointCost(from : Waypoint, to : Waypoint) : float {
	return (from.gameObject.transform.position - to.gameObject.transform.position).magnitude;
}

function FindRoute (start : Waypoint, goal : Waypoint) : List.<Waypoint> {
	var frontier : SortedList.<float, Waypoint> = new SortedList.<float, Waypoint>(); // Priority Queue, what have we not explored?
	var explored : HashSet.<Waypoint> = new HashSet.<Waypoint>(); // Set, what have we explored?

	var pathTo = new Dictionary.<Waypoint,Waypoint>();  // Used to keep track of the path
	var gCost = new Dictionary.<Waypoint,float>();  // Used to keep track of the path

   	pathTo[start] = null;
   	gCost[start] = 0.0;


	frontier.Add(0.0 + HeuristicCostEstimate(start, goal), start);

	var startTime : float = Time.realtimeSinceStartup;
	while (frontier.Count > 0) {
		var leaf : Waypoint = frontier.Values[0];
		if (leaf == goal) {
			// We found the solution! Reconstruct it.
			var path : List.<Waypoint> = new List.<Waypoint>();
			var pointer : Waypoint = goal;
			/*for(var e=pathTo.GetEnumerator(); e.MoveNext();) {
				if (e.Current.Value != null) {
					Debug.Log(e.Current.Key.gameObject.name + " : " + e.Current.Value.gameObject.name);	
				} else {
					Debug.Log(e.Current.Key.gameObject.name + " : null");	
				}
				
			}*/

			while (pointer != null) {
				path.Add(pointer);
				pointer = pathTo[pointer];
			}
			Debug.Log("Found path in " + (Time.realtimeSinceStartup - startTime) + " seconds.");
			return path;
		}
		frontier.RemoveAt(0);

		explored.Add(leaf);
		for (var i = 0; i < leaf.linkedTo.length; i++) {
			var connected : Waypoint = leaf.linkedTo[i];
			if (!explored.Contains(connected) && !frontier.ContainsValue(connected)) {
				/*if (pathTo.ContainsKey(leaf)) {
					Debug.Log("OVERWRITE "+leaf.gameObject.name);
				} else {
					Debug.Log("Nope");
				}*/
				gCost[connected] = gCost[leaf] + WaypointCost(leaf, connected);
				pathTo[connected] = leaf;
				frontier.Add(gCost[connected]+HeuristicCostEstimate(connected, goal), connected);
			}			
		}
	}

	return null;
}

function GetClosestWaypointToPoint (point : Vector3) : Waypoint {
    var minDist : float = Mathf.Infinity;
    var closest : Waypoint;
    
    var waypoints : Component[];
    waypoints = gameObject.GetComponentsInChildren (Waypoint);
    for (var waypoint : Component in waypoints) {
        var currDist = (waypoint.gameObject.transform.position - point).magnitude;
        if (currDist < minDist) {
            minDist = currDist;
            closest = waypoint as Waypoint;
        }
    }        

    return closest;
}

function OnDrawGizmos () {
	if (idealWaypointPath != null) {
		var offset : Vector3 = new Vector3(0,3,0);
		var i : int;
		//Draws the path between the waypoints
		for (i = 0; i < idealWaypointPath.Count-1; i++) {
			Gizmos.color = Color.yellow;
			var next : Vector3 = idealWaypointPath[i+1].gameObject.transform.position;
			Gizmos.DrawLine (idealWaypointPath[i].gameObject.transform.position + offset, next + offset);

			if (i == 0) {
				Gizmos.color = Color.green;
			}
			Gizmos.DrawCube(idealWaypointPath[i].gameObject.transform.position + offset, Vector3.one*0.4);
		}
		if (idealWaypointPath.Count > 0) {
			Gizmos.color = Color.red;
			Gizmos.DrawCube(idealWaypointPath[i].gameObject.transform.position + offset, Vector3.one*0.4);	
		}
		var tempVal : Vector3[,] = GetEdgesFromWaypointList(idealWaypointPath, Vector3.up);
		Gizmos.color = Color.white;
		for (i = 0; i < tempVal.length/2; i++) {
			Gizmos.DrawCube(tempVal[i,0], Vector3.one*0.3);
		}
		Gizmos.color = Color.red;
		for (i = 0; i < tempVal.length/2; i++) {
			Gizmos.DrawCube(tempVal[i,1]+Vector3.up, Vector3.one*0.3);
		}
	}
}

//Returns list of vertices in order of left-right-left, etc. (edges)
function GetEdgesFromWaypointList (waypointList : List.<Waypoint>, agentUp : Vector3) : Vector3[,]	{
	var edgeList : Vector3[,] = new Vector3[waypointList.Count-1,2];
	var waypointRef : Waypoint;
	var prevWaypoint : Waypoint;
	var navGeo : NavmeshGeometry;
	var prevNavGeo : NavmeshGeometry;
	var forwardVector : Vector3;
	var tempVert : Vector3;
	var tempVar : Vector3[];
	
	for (var i : int = 1; i < waypointList.Count; i++)	{
		waypointRef = waypointList[i];
		prevWaypoint = waypointList[i-1];
		
		navGeo = waypointRef.gameObject.GetComponent(NavmeshGeometry) as NavmeshGeometry;
		prevNavGeo = prevWaypoint.gameObject.GetComponent(NavmeshGeometry) as NavmeshGeometry;
		tempVar = sharedEdge(navGeo, prevNavGeo);
		edgeList[i-1,0] = tempVar[0];
		edgeList[i-1,1] = tempVar[1];
		
		//edgeList[i-1,] = sharedEdge(navGeo, prevNavGeo);
		
		forwardVector = waypointRef.gameObject.transform.position - prevWaypoint.gameObject.transform.position;
		if (AngleDir(forwardVector, edgeList[i-1,0], agentUp) == 1) {
			tempVert = edgeList[i-1,1];
			edgeList[i-1,1] = edgeList[i-1,0];
			edgeList[i-1,0] = tempVert;
		}
	}
	return edgeList;
}



// Determines if the passed in triangle shares an edge with this triangle
function sharedEdge(waypointA : NavmeshGeometry, waypointB : NavmeshGeometry) : Vector3[] {
	var sharedVertCount : int = 0; // Counter for verts shared between the triangles.
	var CLOSENESS : float = 0.0000000001; // If two verts are separated by this distance or less, 
	                                             // we treat them as the same point
	var thisVtIdx : int; var otherVtIdx : int;
	var aVerts : Vector3[] = waypointA.getTransformedVerts();
	var bVerts : Vector3[] = waypointB.getTransformedVerts();
	var sharedVerts : Vector3[] = new Vector3[2];
	
	for (thisVtIdx = 0; thisVtIdx < 3; thisVtIdx++) { // For each vertex in this triangle
		for (otherVtIdx = 0; otherVtIdx < 3; otherVtIdx++) { // For each vertex in the other triangle
			if ((aVerts[thisVtIdx] - bVerts[otherVtIdx]).magnitude <= CLOSENESS) { // If the verts are the same i.e. on top of one another
				sharedVerts[sharedVertCount] = aVerts[thisVtIdx];
				sharedVertCount++;
				break; // Since a vertex is shared at most once
			}
		}
		if (sharedVertCount > 1) { // If triangles share two points, they must share an edge
			return sharedVerts;
		}
	}
	return null;
}
		
function FunnelAlgorithm (startPt : Vector3, goalPt : Vector3, agentUp : Vector3) : Vector3[,] {
	var start : Waypoint = GetClosestWaypointToPoint(startPt);
	var goal : Waypoint = GetClosestWaypointToPoint(goalPt);
	var waypointList : List.<Waypoint> = FindRoute (start, goal);
	var edgeList : Vector3[,] = GetEdgesFromWaypointList(waypointList, agentUp);
	return edgeList;
	//TODO: not finished, implement actual funnel algorithm
}

//returns -1 when to the left, 1 to the right, and 0 for forward/backward
//adapted from: http://forum.unity3d.com/threads/31420-Left-Right-test-function
public static function AngleDir(fwd: Vector3, sidePt: Vector3, up: Vector3) : int {
    var perp: Vector3 = Vector3.Cross(fwd, sidePt);
    var dir: float = Vector3.Dot(perp, up);

    if (dir > 0.0) {
        return 1;
    } else if (dir < 0.0) {
        return -1;
    } else {
        return 0;
    }
}