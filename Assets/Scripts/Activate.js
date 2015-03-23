#pragma strict


function Activate() {
	print("Activate");
	this.transform.eulerAngles.y += 30;
}