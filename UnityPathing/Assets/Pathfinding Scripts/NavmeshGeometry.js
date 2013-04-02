#pragma strict

var verts : Vector3[];

function OnDrawGizmos() {
	Gizmos.color = Color.blue;
	var networkTransform : Transform = transform.parent;
	
	for (var i = 0; i < verts.length; i++) {
		var offset = networkTransform.position;
        Gizmos.DrawLine (offset+networkTransform.TransformDirection(verts[i]), 
        	             offset+networkTransform.TransformDirection(verts[(i+1)%verts.length]));
	}
}