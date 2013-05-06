#pragma strict

var spinSpeed : float = 1.0;

function Update () {
	transform.Rotate(transform.up, spinSpeed*Time.deltaTime);
}