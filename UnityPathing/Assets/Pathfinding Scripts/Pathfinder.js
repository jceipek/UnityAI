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

//returns -1 when to the left, 1 to the right, and 0 for forward/backward
//adapted from: http://forum.unity3d.com/threads/31420-Left-Right-test-function
public static function AngleDir(fwd: Vector3, targetDir: Vector3, up: Vector3) : int {
    var perp: Vector3 = Vector3.Cross(fwd, targetDir);
    var dir: float = Vector3.Dot(perp, up);

    if (dir > 0.0) {
        return 1;
    } else if (dir < 0.0) {
        return -1;
    } else {
        return 0;
    }
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

//-------------------------------------------------------------------
// A* Functions
//-------------------------------------------------------------------

function HeuristicCostEstimate(from : Waypoint, to : Waypoint) : float {
	return (from.gameObject.transform.position - to.gameObject.transform.position).magnitude;
}

function WaypointCost(from : Waypoint, to : Waypoint) : float {
	return (from.gameObject.transform.position - to.gameObject.transform.position).magnitude;
}

// Uses A* to find the optimal path between two points in a Waypoint network.
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
				gCost[connected] = gCost[leaf] + WaypointCost(leaf, connected);
				pathTo[connected] = leaf;
				frontier.Add(gCost[connected]+HeuristicCostEstimate(connected, goal), connected);
			}			
		}
	}

	return null;
}

//-------------------------------------------------------------------
// Funnel Algorithm
//-------------------------------------------------------------------

function TriArea(a : Vector3, b : Vector3, c : Vector3) : float {
 	return Vector3.Cross(b-a,c-a).magnitude/2;
}

// Returns an array of edges ordered according to a (right, left) scheme
static function GetEdgesFromWaypointList (waypointList : List.<Waypoint>, agentUp : Vector3) : Vector3[,]	{
	var edgeList : Vector3[,] = new Vector3[waypointList.Count-1,2]; // The array we are populating

	// Temporary poiners to use along the way
	var waypointRef : Waypoint;
	var prevWaypoint : Waypoint;
	var navGeo : NavmeshGeometry;
	var prevNavGeo : NavmeshGeometry;
	var forwardVector : Vector3;
	var edgeVerts : Vector3[];
	var tempVert : Vector3;
	
	for (var i : int = 1; i < waypointList.Count; i++)	{
		waypointRef = waypointList[i];
		prevWaypoint = waypointList[i-1];
		
		navGeo = waypointRef.gameObject.GetComponent(NavmeshGeometry) as NavmeshGeometry;
		prevNavGeo = prevWaypoint.gameObject.GetComponent(NavmeshGeometry) as NavmeshGeometry;
		edgeVerts = sharedEdge(navGeo, prevNavGeo);
		edgeList[i-1,0] = edgeVerts[0];
		edgeList[i-1,1] = edgeVerts[1];
		
		// The forward-pointing vector (in the direction toward the next waypoint)
		forwardVector = waypointRef.gameObject.transform.position - prevWaypoint.gameObject.transform.position;
		if (AngleDir(forwardVector, edgeList[i-1,0]-edgeList[i-1,1], agentUp) == -1) {
			tempVert = edgeList[i-1,0];
			edgeList[i-1,0] = edgeList[i-1,1];
			edgeList[i-1,1] = tempVert;
		}
	}
	return edgeList;
}

// Returns the coordinates of the edge shared between two NavmeshGeometry triangles
static function sharedEdge(waypointA : NavmeshGeometry, waypointB : NavmeshGeometry) : Vector3[] {
	var sharedVertCount : int = 0; // Counter for verts shared between the triangles.
	var sharedVerts : Vector3[] = new Vector3[2]; // Which verts will be shared
	var CLOSENESS : float = 0.0000000001; // If two verts are separated by this distance or less, 
	                                             // we treat them as the same point
	
	var aVerts : Vector3[] = waypointA.getTransformedVerts();
	var bVerts : Vector3[] = waypointB.getTransformedVerts();
	var aVtIdx : int; var bVtIdx : int;
	
	for (aVtIdx = 0; aVtIdx < 3; aVtIdx++) { // For each vertex in this triangle
		for (bVtIdx = 0; bVtIdx < 3; bVtIdx++) { // For each vertex in the other triangle
			if (EqualVertices(aVerts[aVtIdx],bVerts[bVtIdx])) { // If the verts are the same i.e. on top of one another
				sharedVerts[sharedVertCount] = aVerts[aVtIdx]; // Store the current vertex
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

static function EqualVertices(vert1 : Vector3, vert2 : Vector3) : boolean {
// If two verts are separated by this distance or less, we treat them as the same point	
	return (vert1 - vert2).magnitude <= 0.0000000001;
}
		
function FunnelAlgorithm (startPt : Vector3, goalPt : Vector3, agentUp : Vector3) : List.<Vector3> {
	var start : Waypoint = GetClosestWaypointToPoint(startPt);
	var goal : Waypoint = GetClosestWaypointToPoint(goalPt);
	var waypointList : List.<Waypoint> = FindRoute (start, goal);
	var edgeList : Vector3[,] = GetEdgesFromWaypointList(waypointList, agentUp);

	var portalApex : Vector3 = edgeList[0,0];
	var portalLeft : Vector3 = edgeList[0,0];
	var portalRight: Vector3 = edgeList[1,0];		//Check to see if correct!
	
	var edgeIdx : int;
	var vertIdx : int;
	var i : int;
	for (edgeIdx = 1; edgeIdx < edgeList.Length/2; edgeIdx++) {
		for (vertIdx = 0; vertIdx < 2; vertIdx++) {
			i = edgeIdx + vertIdx;
			//not finished	
		}
	}
	
	
	
	
	//TODO: not finished, implement actual funnel algorithm
}

//-------------------------------------------------------------------
// Debug Visualization
//-------------------------------------------------------------------

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

		// Debug for edge orientation
		var tempVal : Vector3[,] = GetEdgesFromWaypointList(idealWaypointPath, Vector3.up);
		Gizmos.color = Color.white;
		for (i = 0; i < tempVal.length/2; i++) {
			Gizmos.DrawCube(tempVal[i,0], Vector3.one*0.3);
		}
		Gizmos.color = Color.red;
		for (i = 0; i < tempVal.length/2; i++) {
			Gizmos.DrawCube(tempVal[i,1], Vector3.one*0.3);
		}
	}
}