#pragma strict

// Copyright (C) 2013 Julian Ceipek
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
		
	}
}