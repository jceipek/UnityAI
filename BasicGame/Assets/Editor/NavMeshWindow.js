#pragma strict

// Copyright (C) 2013 Julian Ceipek and Alex Adkins
//
// A brute-force navmesh generator found under Tools/NavMesher
// It adds an "AI Navmesh" object containing a network of NavmeshNodes
// to a standard triangle mesh.
//
// Usage:
//  Must be located in the Assets/Editor folder with the name "PathfindingEditor.js"
//  Depends on a "NavmeshNode" Prefab in the Assets/Resources with "Waypoint" and "Navmesh Geometry" components applied
//  Use it by creating a standard triangle mesh to use as a navmesh.
//    Selecting that object will then enable the "Process NavMesh" button.
// 

class NavMeshWindow extends EditorWindow {

	// A class used to temporarily store and manipulate triangle properties
	class Triangle {
		var verts : Vector3[]; // The vertices of the triangle. There will be exactly 3.
		var centerPoint : Vector3; // The center of the triangle. Computed via this.updateCenterPoint()
		var linkedTo : List.<Triangle>; // To which other triangles is this triangle connected via its edges?
		
		// Constructor. Allocates new arrays.
		function Triangle() {
			linkedTo = new List.<Triangle>(); // Variable size
			verts = new Vector3[3]; // Fixed size
		}

		// Determines if the passed in triangle shares an edge with this triangle
		function sharesEdgeWith(other:Triangle) : boolean {
			var sharedVerts : int = 0; // Counter for verts shared between the triangles.
			var CLOSENESS : float = 0.0000000001; // If two verts are separated by this distance or less, 
			                                             // we treat them as the same point
			var thisVtIdx : int; var otherVtIdx : int;
			for (thisVtIdx = 0; thisVtIdx < 3; thisVtIdx++) { // For each vertex in this triangle
				for (otherVtIdx = 0; otherVtIdx < 3; otherVtIdx++) { // For each vertex in the other triangle
					if ((this.verts[thisVtIdx] - other.verts[otherVtIdx]).magnitude <= CLOSENESS) { // If the verts are the same i.e. on top of one another
						sharedVerts++;
						break; // Since a vertex is shared at most once
					}
				}
				if (sharedVerts > 1) { // If triangles share two points, they must share an edge
					return true;
				}
			}
			return false;
		}

		// Create a bi-directional link between this and other
		function mutualLinkTo(other:Triangle) {
			other.linkedTo.Add(this);
			this.linkedTo.Add(other);
		}

		// Set the center of the triangle by averaging its vertex locations
		function updateCenterPoint() {
			this.centerPoint = (this.verts[0] + this.verts[1] + this.verts[2])/3;
		}
	}

	// The core of the navmesh generation. 
	function MakeWaypointNetworkFromNavmesh(navmesh : GameObject) {
		var aiNavmesh : GameObject = new GameObject("AI Navmesh"); // The parent empty for the network.
		aiNavmesh.AddComponent("Pathfinder"); // This component will allow agents to use the network for navigation
		// Place the empty at the mesh origin.
		aiNavmesh.transform.position = navmesh.transform.position;
		aiNavmesh.transform.rotation = navmesh.transform.rotation;

		var tempTriangles : List.<Triangle> = new List.<Triangle>(); // A variable-length list to help build a triangle graph
		                                                             // where triangles are bi-directionally linked when they share edges.
		                                                             // This list will be discarded at the end.
		var mesh : Mesh = navmesh.GetComponent(MeshFilter).sharedMesh; // Get a reference to the triangle mesh of the selected object
		var meshVerts : Vector3[] = mesh.vertices; // Each vertex is simply a Vector3
		var meshTris : System.Int32[] = mesh.triangles; // Triangles are represented via a list of integer indices into the meshVerts list.
		
		var i : int; var j : int; var k : int; // Counters


		// STAGE 1: Create a Triangle instance for each triangle in the mesh.
		// Store it in tempTriangles. Create links between all the Triangles based on shared edges.
		var tempTri : Triangle; // Temporary container for the current triangle.
		
		for (i = 0; i < meshTris.length; i+=3) { // For each real triangle in the mesh, where i is the index of the index of the first vertex
												 //  Yes, that is confusing. The current triangle in meshTris is formed from vertices i,i+1,and i+2
												 //  meshVerts[meshTris[i]] is the Vector3 of the first vertex in the triangle
			
			// Show how far we've gotten with a blocking progress bar (yes; threading all this would be really nice)
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (1/3)",
                    "Processing triangle "+i+" of "+meshTris.length+".",
                    (i+0.0)/(meshTris.length*3));


			tempTri = new Triangle(); // A new triangle instance to be added to tempTriangles
			// Copy over the vertex locations from the mesh to the tempTri
			for (j = 0; j<3; j++) {
				tempTri.verts[j] = meshVerts[meshTris[i+j]];
			}
			tempTri.updateCenterPoint(); // Set the center of the triangle to be the average of its points
			
			// Brute force check to see if the tempTri should be linked to any other triangle.
			for (k = 0; k < tempTriangles.Count; k++) { // For every triangle that we have stored so far...
				if (tempTriangles[k].sharesEdgeWith(tempTri)) { // Check to see if it shares an edge with this tempTri
					tempTriangles[k].mutualLinkTo(tempTri); // If so, link them bidirectionally
				}
			}

			tempTriangles.Add(tempTri); // Store the new tempTri in the tempTriangles list
		}
		// END STAGE 1
		

		// Mapping that will help us copy the tempTriangles list into the NavmeshNode network 
		var triangleToWaypoint = new Dictionary.<Triangle,Waypoint>();

		// STAGE 2: Create a NavmeshNode instance for each triangle in the mesh.
		// Give it a reference to an array of Vector3s representing vertices in local space.
		var navmeshNode : GameObject; // Temporary container for the current NavmeshNode
		var navmeshGeo : NavmeshGeometry; // Temporary container for the NavmeshGeometry component (which stores vertices)
		
		for (i = 0; i < tempTriangles.Count; i++) { // For every triangle we stored

			// Again, show how far we've gotten with a blocking progress bar
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (2/3)",
                    "Generating Waypoint "+i+" of "+tempTriangles.Count+".",
                    (i+0.0+tempTriangles.Count)/(tempTriangles.Count * 3));

			navmeshNode = Instantiate(Resources.Load("NavmeshNode")) as GameObject; // Create a new NavmeshNode
			navmeshNode.name = "WaypointNode_"+i; // Give it a unique name in the network to simplify debugging
			navmeshNode.transform.parent = aiNavmesh.transform; // Make it a child of the AI Navmesh empty
			// Put it in the middle of the triangle, but in global space (so it lines up with where the navmesh object is)
			navmeshNode.transform.position = navmesh.transform.position + navmesh.transform.TransformDirection(tempTriangles[i].centerPoint);
			navmeshGeo = navmeshNode.GetComponent(NavmeshGeometry) as NavmeshGeometry; // Get the node's NavmeshGeometry component
			navmeshGeo.verts = tempTriangles[i].verts; // Give it a reference to the vertices in the current triangle
			triangleToWaypoint[tempTriangles[i]] = navmeshNode.GetComponent(Waypoint) as Waypoint; // Store it in the dictionary. 
																								   // This will help with Stage 3
		}
		// END STAGE 2


		// STAGE 3: Link the waypoints together the same way the Triangles are
		for (i = 0; i < tempTriangles.Count; i++) { // For every triangle we stored

			// Finally!
			EditorUtility.DisplayProgressBar(
                    "Processing NavMesh (3/3)",
                    "Linking Waypoint "+i+" of "+tempTriangles.Count+".",
                    (i+0.0+tempTriangles.Count*2)/(tempTriangles.Count * 3));

			// A list of the same length as the current triangle is linked to
			triangleToWaypoint[tempTriangles[i]].linkedTo = new Waypoint[tempTriangles[i].linkedTo.Count];
			for (j = 0; j < tempTriangles[i].linkedTo.Count; j++) { // For each triangle to which the active triangle is linked
				// Link the waypoints the same way, using the triangleToWaypoint dictionary we populated in Stage 2
				triangleToWaypoint[tempTriangles[i]].linkedTo[j] = triangleToWaypoint[tempTriangles[i].linkedTo[j]];
			}
		}
		// END STAGE 3

		// We can finally stop blocking
		EditorUtility.ClearProgressBar();
	}
    
    @MenuItem ("Tools/NavMesher")
    static function Init () {
        // Get existing open window or if none, make a new one:     
        var window = ScriptableObject.CreateInstance.<NavMeshWindow>();
        window.title = "NavMesher";
        window.Show();
    }
    
    // Draws the window contents
    function OnGUI () {
    	// Gui.enabled applies to all things that come after it
    	// In this case, we have a single button that can only be pressed if the selected object is a mesh
    	if (Selection.activeGameObject != null && Selection.activeGameObject.GetComponent(MeshFilter) != null) {
			GUI.enabled = true;
			Repaint();
    	} else {
    		GUI.enabled = false;
    		Repaint();
    	}
    	
    	// Invoke the main function, MakeWaypointNetworkFromNavmesh, when we click the "Process NavMesh" button
    	if (GUILayout.Button("Process NavMesh")) {
			Undo.RegisterSceneUndo("Process NavMesh"); // Make sure we can undo all of the things the following function will do
			MakeWaypointNetworkFromNavmesh(Selection.activeGameObject);
    	}
    }
}