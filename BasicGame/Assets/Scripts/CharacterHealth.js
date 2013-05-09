#pragma strict

var hp : int;

function Start () { //starting health

hp = 100;

}


function OnGUI() //represent health on screen
{
	GUI.color = Color.red;
    GUI.HorizontalScrollbar(Rect (0,0,200,20), 0, hp, 0, 100);
}