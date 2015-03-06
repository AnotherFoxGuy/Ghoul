#pragma strict

var moveto: GameObject;


function OnTriggerStay(otherObj: Collider) {
	if (otherObj.tag == "Player" && Input.GetButtonDown("MoveZOder")) {
		otherObj.transform.position = moveto.transform.position;
	}
}