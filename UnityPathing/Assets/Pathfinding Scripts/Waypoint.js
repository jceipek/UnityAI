#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A component that represents a Waypoint for pathfinding.
// It contains references to other waypoints via linkedTo to form a graph.
// For use in conjunction with PathfindingEditor.js and Pathfinder.js
//
// It should be assigned to a "WaypointNode" prefab in the Assets/Resources folder.
//

public var linkedTo : Waypoint[];

@HideInInspector
var selectedInEditor : boolean = false;

function OnDrawGizmos() {
	if (selectedInEditor) {
		Gizmos.color = Color.magenta;
	} else {
		Gizmos.color = Color.cyan;	
	}
	
	Gizmos.DrawWireSphere(transform.position, 0.4f);

	Gizmos.color = Color.cyan;
	for (var i = 0; i < linkedTo.length; i++) {
        Gizmos.DrawLine (transform.position, linkedTo[i].transform.position);
	}
}