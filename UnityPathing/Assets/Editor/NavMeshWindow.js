#pragma strict

//
class NavMeshWindow extends EditorWindow {
	class Triangle {
		var verts : Vector3[];
		var centerPoint : Vector3;
		var linkedTo : List.<Triangle>;
		
		function Triangle() {
			linkedTo = new List.<Triangle>();
			verts = new Vector3[3];
		}

		function sharesEdgeWith(other:Triangle) : boolean {
			var sharedPoints : int = 0;
			var closeness : float = 0.0000000001;
			var i : int;
			var j : int;
			for (i = 0; i < 3; i++) {
				for (j = 0; j < 3; j++) {
					if ((this.verts[i] - other.verts[j]).magnitude <= closeness) {
						sharedPoints++;
						break;
					}
				}
				if (sharedPoints > 1) {
					return true;
				}
			}
			return false;
		}

		function mutualLinkTo (other:Triangle) {
			other.linkedTo.Add(this);
			this.linkedTo.Add(other);
		}

		function updateCenterPoint () {
			this.centerPoint = (this.verts[0] + this.verts[1] + this.verts[2])/3;
		}
	}

	function MakeWaypointNetworkFromNavmesh(navmesh : GameObject) {
		var aiNavmesh : GameObject = new GameObject("AI Navmesh");
		aiNavmesh.AddComponent("Pathfinder");
		aiNavmesh.transform.position = navmesh.transform.position;	
		aiNavmesh.transform.rotation = navmesh.transform.rotation;
		var tempTriangles : List.<Triangle> = new List.<Triangle>();
		var mesh : Mesh = navmesh.GetComponent(MeshFilter).sharedMesh;
		var vs : Vector3[] = mesh.vertices;
		var tris : System.Int32[] = mesh.triangles;
		var i : int;
		var j : int;
		var k : int;
		for (i = 0; i<tris.length; i+=3) {
			
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (1/3)",
                    "Processing triangle "+i+" of "+tris.length+".",
                    (i+0.0)/(tris.length*3));

			var tempTri = new Triangle();
			for (j = 0; j<3; j++) {
				tempTri.verts[j] = vs[tris[i+j]];
			}
			tempTri.updateCenterPoint();
			
			for (k = 0; k < tempTriangles.Count; k++) {
				if (tempTriangles[k].sharesEdgeWith(tempTri)) {
					tempTriangles[k].mutualLinkTo(tempTri);
				}
			}

			tempTriangles.Add(tempTri);
		}

		var waypointNode : GameObject;
		var triangleToWaypoint = new Dictionary.<Triangle,Waypoint>();

		for (i = 0; i < tempTriangles.Count; i++) {
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (2/3)",
                    "Generating Waypoint "+i+" of "+tempTriangles.Count+".",
                    (i+0.0+tempTriangles.Count)/(tempTriangles.Count * 3));

			waypointNode = Instantiate(Resources.Load("NavmeshNode")) as GameObject;
			waypointNode.transform.parent = aiNavmesh.transform;
			waypointNode.transform.position = navmesh.transform.position + navmesh.transform.TransformDirection(tempTriangles[i].centerPoint);
			waypointNode.name = "WaypointNode_"+i;
			var navmeshGeo : NavmeshGeometry = waypointNode.GetComponent(NavmeshGeometry) as NavmeshGeometry;
			navmeshGeo.verts = tempTriangles[i].verts;
			triangleToWaypoint[tempTriangles[i]] = waypointNode.GetComponent(Waypoint) as Waypoint;
		}

		for (i = 0; i < tempTriangles.Count; i++) {
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (3/3)",
                    "Linking Waypoint "+i+" of "+tempTriangles.Count+".",
                    (i+0.0+tempTriangles.Count*2)/(tempTriangles.Count * 3));

			triangleToWaypoint[tempTriangles[i]].linkedTo = new Waypoint[tempTriangles[i].linkedTo.Count];
			for (j = 0; j < tempTriangles[i].linkedTo.Count; j++) {
				triangleToWaypoint[tempTriangles[i]].linkedTo[j] = triangleToWaypoint[tempTriangles[i].linkedTo[j]];
			}
		}

		EditorUtility.ClearProgressBar();
	}
    
    @MenuItem ("Tools/NavMesher")
    static function Init () {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<NavMeshWindow>();
        window.title = "NavMesher";
        window.Show();
    }
    
    //Updates interface
    function OnGUI () {
    	if (Selection.activeGameObject != null && Selection.activeGameObject.GetComponent(MeshFilter) != null) {
			GUI.enabled = true;
			Repaint();
    	} else {
    		GUI.enabled = false;
    		Repaint();
    	}
    	
    	if (GUILayout.Button("Process NavMesh")) {
			Undo.RegisterSceneUndo("Process NavMesh");
			MakeWaypointNetworkFromNavmesh(Selection.activeGameObject);
    	}
    }
}