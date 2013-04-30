#pragma strict

var hp : int;

function Start () {

hp = 10;

}


function OnGUI()
{
	GUI.color = Color.red;
    GUI.HorizontalScrollbar(Rect (0,0,200,20), 0, hp, 0, 100);
}