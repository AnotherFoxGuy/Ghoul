#pragma strict

private var p : GameObject ;
private var T = false;

function Start () {
	p = GameObject.Find("Player");
  

}

function Update() {
	if(T){
		this.transform.position.x = p.transform.position.x;
	  this.transform.eulerAngles.y = -p.transform.position.x * 10;
	}
}

function OnTriggerEnter () {
	T = true;
  p.GetComponent(Player).CanJump = false;
}

function OnTriggerExit () {
	T = false;
  this.transform.eulerAngles.y = 0;
  p.GetComponent(Player).CanJump = true;
}