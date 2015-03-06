#pragma strict
var reset = 1;

private var hide = false;

function Update() {
	if (Input.GetButtonDown("MoveZOder")) {
		hide = !hide;
	}
}


function OnTriggerStay(otherObj: Collider) {
	if (otherObj.tag == "Player") {
		if (hide) {
			otherObj.transform.position = Vector3(this.transform.position.x, this.transform.position.y + 0.55, this.transform.position.z);
			otherObj.GetComponent(Rigidbody).isKinematic = true;
		} else {
			otherObj.transform.position.z = this.transform.position.z - reset;
			otherObj.GetComponent(Rigidbody).isKinematic = false;

		}
	}
}
