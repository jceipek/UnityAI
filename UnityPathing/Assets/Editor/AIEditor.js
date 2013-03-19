#pragma strict

class AIEditor extends EditorWindow {
    var myString = "Hello World";
    var groupEnabled = false;
    var myBool = true;
    var myFloat = 1.23;
    var editingWaypoints : boolean = false;
	var guiSkin : GUISkin;
    
    // Add menu named "AI Editor" to the Window menu
    @MenuItem ("Window/AI Editor")
    static function Init () {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<AIEditor>();
        window.title = "AI Editor";
        window.Show();
    }
    
    function OnGUI () {
        GUILayout.Label ("Base Settings", EditorStyles.boldLabel);
            myString = EditorGUILayout.TextField ("Text Field", myString);
        
        groupEnabled = EditorGUILayout.BeginToggleGroup ("Optional Settings", groupEnabled);
            myBool = EditorGUILayout.Toggle ("Toggle", myBool);
            myFloat = EditorGUILayout.Slider ("Slider", myFloat, -3, 3);
        EditorGUILayout.EndToggleGroup ();


        //Debug.Log(guiSkin.button);
		editingWaypoints = GUILayout.Toggle (editingWaypoints, "Edit Waypoints", GUI.skin.button);
    }
}

/*
import UnityEditor
import UnityEngine
 
[CustomEditor(Tilemap)]
class TilemapEditor (Editor):
    def OnSceneGUI():
        controlID as int = GUIUtility.GetControlID(FocusType.Passive)
        if Event.current.type == EventType.mouseDown:
            hit as RaycastHit
            if Physics.Raycast(Event.current.mouseRay, \
               hit, Mathf.Infinity, 1 << (target as Tilemap).terrainLayer):
                Debug.Log("Hit a part of the terrain")
                hit.transform.position.y += 5
        if Event.current.type == EventType.layout:
            HandleUtility.AddDefaultControl(controlID)
*/