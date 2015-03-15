#pragma strict

private var inTrigger = false;
var ActivateObject : GameObject;

function Start() {

}

function Update() {
	if (inTrigger && Input.GetButtonDown("Attach"))
		ActivateObject.SendMessage("Activate");

}

function OnTriggerEnter(other: Collider) {
	if (other.gameObject.tag == "Player")
		inTrigger = true;
}

function OnTriggerExit(other: Collider) {
	if (other.gameObject.tag == "Player")
		inTrigger = false;
}

function OnGUI() {
	if (inTrigger)
		GUI.Box(Rect(10, 100, 150, 50), "inTrigger");
}