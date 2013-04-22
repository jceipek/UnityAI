#pragma strict

// Copyright (C) 2013 Julian Ceipek
//
// A quick and dirty waypoint editor.
//
// Usage:
//  Must be located in the Assets/Editor folder with the name "PathfindingEditor.js"
//  Depends on a "WaypointNode" Prefab in the Assets/Resources folder and with a "Waypoint" component applied
//  Use it by creating an empty object (AI Path in the demo) with a "Pathfinder" component.
//    Selecting that object will then reveal editor controls.
// 

import System.Collections.Generic;

@CustomEditor(Pathfinder)
//@CanEditMultipleObjects // Can't edit multiple objects because waypoints shouldn't be assigned to multiple AI Path Objects
class PathfindingEditor extends Editor {
    var testingPathfinding : boolean = false; // Tracks whether pathfinding test mode is active
    var editingWaypoints : boolean = false; // Tracks whether waypoint edit mode is active
    var waypointCount : int = 0; // The amount of waypoints
    var lastActiveWaypoint : Waypoint = null; // The last waypoint to be placed
    var lastActiveWaypoint_SR : SerializedObject; // Serialized form of that waypoint
    var lastActiveWaypointLinkCount_SR : SerializedProperty; // The amount of links that waypoint has to other waypoints
    var selectedObject : GameObject; // The AI Path object that activates the Pathfinding Editor

    var testPathfindingStage : int = 0;
    var testPathfindingStartWaypoint : Waypoint = null;
    var testPathfindingEndWaypoint : Waypoint = null;

    function OnEnable () {
        selectedObject = Selection.activeObject as GameObject; // The AI Path Object associated with the editor
        waypointCount = selectedObject.transform.childCount; // The children of the path object are all waypoint nodes
    }

    function OnInspectorGUI() {
        GUILayout.Label("Controls: \n Cmd-Click to place waypoint \n Shift-Click to place connected waypoint \n Click to select and connect waypoints");
        editingWaypoints = GUILayout.Toggle (editingWaypoints && !testingPathfinding, "Edit Waypoints", GUI.skin.button);
        GUILayout.Label("Controls: \n Click two points to specify start and end points");
        testingPathfinding = GUILayout.Toggle (testingPathfinding && !editingWaypoints, "Test Pathfinding", GUI.skin.button);
    }

    function GetWaypointArrayFor (serializedWaypoint : SerializedObject, serializedWaypointLinkCount : SerializedProperty) : Waypoint[] {
        var arrayCount : int = serializedWaypointLinkCount.intValue;
        var transformArray : Waypoint[] = new Waypoint[arrayCount];
        for (var i = 0; i < arrayCount; i++) {
            transformArray[i] = 
                serializedWaypoint.FindProperty("linkedTo.Array.data["+i+"]").objectReferenceValue as Waypoint;
        }

        return transformArray;
    }

    class ClosestWaypointInfo {
        var obj : GameObject;
        var dist : float;
    }

    function GetClosestWaypointToPoint (point : Vector3) : ClosestWaypointInfo {
        // Would be much better with full raycast
        // Otherwise, 1--7 would select object at dist 7 if click on object at dist 1 and you are at dist 8
        var minDist : float = Mathf.Infinity;
        var currDist : float = Mathf.Infinity;
        var closest : List.<GameObject> = new List.<GameObject>();

        var ret : ClosestWaypointInfo = new ClosestWaypointInfo();
        ret.obj = null;
        
        var waypoints : Component[];
        waypoints = selectedObject.GetComponentsInChildren (Waypoint);
        for (var waypoint : Component in waypoints) {
            currDist = (waypoint.gameObject.transform.position - point).magnitude;
            if (currDist <= minDist) {
                if (currDist != minDist)
                    closest.Clear();
                minDist = currDist;
                closest.Add(waypoint.gameObject);
            }
        }        

        ret.dist = minDist;

        if (closest.Count > 0) {
            ret.obj = closest[0];
        }

        return ret;
    }

    function SetWaypointLinkFor (serializedWaypoint : SerializedObject, index : int, waypoint : Waypoint) : boolean {
        var shouldAdd : boolean = true;
        for (var i = 0; i < serializedWaypoint.FindProperty("linkedTo.Array.size").intValue; i++) {
            if (serializedWaypoint.FindProperty("linkedTo.Array.data["+i+"]").objectReferenceValue != null) {
                // XXX: Unfortunately, this relies on unique waypoint names. The references are always unique for some reason.
                if (waypoint.name == serializedWaypoint.FindProperty("linkedTo.Array.data["+i+"]").objectReferenceValue.name) {
                    shouldAdd = false;
                }
            }

        }
        if (shouldAdd) {
            serializedWaypoint.FindProperty("linkedTo.Array.data["+index+"]").objectReferenceValue = waypoint;
        }
        return shouldAdd;
    }

    function GetCursorOrigin (mousePos : Vector2) {
        var cursorOrigin : Vector3;
        var hit : RaycastHit;
        var mouseRay : Ray = HandleUtility.GUIPointToWorldRay(mousePos);
        if (Physics.Raycast(mouseRay, hit, Mathf.Infinity)) {
            // Hit terrain
            cursorOrigin = hit.point;
        } else {
            
            var clickPlane : Plane = new Plane(mouseRay.direction, mouseRay.origin);
            // This is at the same height as the AIPath origin, from the viewport perspective:
            cursorOrigin = mouseRay.GetPoint(clickPlane.GetDistanceToPoint(selectedObject.transform.position));
        }
        return cursorOrigin;
    }

    function OnSceneGUI() {
        var controlID : int = GUIUtility.GetControlID(FocusType.Passive); // Used to prevent deselection during the editing process

        if (editingWaypoints) {            
            if (Event.current.type == EventType.mouseDown) {
                var cursorOrigin : Vector3 = GetCursorOrigin(Event.current.mousePosition);

                var newWaypointContainer : GameObject = null;
                var addWhileCreating : boolean = Event.current.modifiers == EventModifiers.Shift;
                var willCreateNew : boolean;
                var shouldDeselect : boolean = false;

                var closestWaypointInfo : ClosestWaypointInfo = GetClosestWaypointToPoint(cursorOrigin);
                var minDist : float = closestWaypointInfo.dist;
                
                if (Event.current.modifiers != EventModifiers.Command && Event.current.modifiers != EventModifiers.Control && Event.current.modifiers != EventModifiers.Shift) {
                    newWaypointContainer = closestWaypointInfo.obj;
                    // XXX: Unfortunately, this relies on unique waypoint names. The references are always unique for some reason.
                    if (lastActiveWaypoint != null) {
                        if (newWaypointContainer.name == lastActiveWaypoint.gameObject.name) {
                            (newWaypointContainer.GetComponent("Waypoint") as Waypoint).selectedInEditor = false;
                            lastActiveWaypoint.selectedInEditor = false;
                            EditorUtility.SetDirty(lastActiveWaypoint);
                            lastActiveWaypoint = null;
                            shouldDeselect = true;
                        } 
                    }
                    
                } else {
                    willCreateNew = true;
                    Undo.RegisterSceneUndo("Create Waypoint");
                    // Create a new waypoint
                    newWaypointContainer = Instantiate(Resources.Load("WaypointNode")) as GameObject;
                    newWaypointContainer.transform.parent = selectedObject.transform;
                    newWaypointContainer.transform.position = cursorOrigin;
                    newWaypointContainer.name = "WaypointNode_" + waypointCount;
                    waypointCount++;
                }

                if (newWaypointContainer != null && lastActiveWaypoint != null && (!willCreateNew || (willCreateNew && addWhileCreating))) {
                    // Connect the waypoint to the last waypoint that was placed (when holding down shift)
                    var newWaypoint_SR : SerializedObject;
                    var newWaypointLinkCount_SR : SerializedProperty;
                    newWaypoint_SR = new SerializedObject(newWaypointContainer.GetComponent("Waypoint") as Waypoint);
                    newWaypointLinkCount_SR = newWaypoint_SR.FindProperty("linkedTo.Array.size");
                    newWaypoint_SR.Update();
                    lastActiveWaypoint_SR.Update();
                    newWaypointLinkCount_SR.intValue++;
                    lastActiveWaypointLinkCount_SR.intValue++;

                    if (!SetWaypointLinkFor(newWaypoint_SR, newWaypointLinkCount_SR.intValue - 1, lastActiveWaypoint)) {
                        newWaypointLinkCount_SR.intValue--;
                    }
                    if (!SetWaypointLinkFor(lastActiveWaypoint_SR, 
                                           lastActiveWaypointLinkCount_SR.intValue - 1, 
                                           newWaypointContainer.GetComponent("Waypoint") as Waypoint)) {
                        lastActiveWaypointLinkCount_SR.intValue--;
                    }
                    lastActiveWaypoint_SR.ApplyModifiedProperties();
                    newWaypoint_SR.ApplyModifiedProperties();
                }

                if (lastActiveWaypoint != null) {
                    lastActiveWaypoint.selectedInEditor = false;
                }

                if (!shouldDeselect && newWaypointContainer != null) {
                    lastActiveWaypoint = newWaypointContainer.GetComponent("Waypoint") as Waypoint;
                    lastActiveWaypoint.selectedInEditor = true;
                    EditorUtility.SetDirty(lastActiveWaypoint);
                    lastActiveWaypoint_SR = new SerializedObject(lastActiveWaypoint);  
                    lastActiveWaypointLinkCount_SR = lastActiveWaypoint_SR.FindProperty("linkedTo.Array.size");    
                }
                
            }

            if (Event.current.type == EventType.layout) {
                HandleUtility.AddDefaultControl(controlID);
            }
            
        } else if (testingPathfinding) {
            if (Event.current.type == EventType.mouseDown) {
                var mousePos3 : Vector3 = GetCursorOrigin(Event.current.mousePosition);
                var pathfinder : Pathfinder = selectedObject.GetComponent(Pathfinder) as Pathfinder;
                if (testPathfindingStage == 0) {
                    testPathfindingStartWaypoint = pathfinder.GetClosestWaypointToPoint(mousePos3);
                    testPathfindingStage++;
                } else if (testPathfindingStage == 1) {
                    testPathfindingEndWaypoint = pathfinder.GetClosestWaypointToPoint(mousePos3);
                    testPathfindingStage++;
                    pathfinder.idealWaypointPath = pathfinder.FindRoute(testPathfindingStartWaypoint, testPathfindingEndWaypoint);
                    testPathfindingStage = 0;
                }

            }

            if (Event.current.type == EventType.layout) {
                HandleUtility.AddDefaultControl(controlID);
            }
        } else {
            testPathfindingStage = 0;
        }

    }

    function OnDisable () {
        if (lastActiveWaypoint != null) {
            lastActiveWaypoint.selectedInEditor = false;
            EditorUtility.SetDirty(lastActiveWaypoint);
        }
    }

}