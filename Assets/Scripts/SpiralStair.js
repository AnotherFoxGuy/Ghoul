#pragma strict

private var Player : GameObject ;
private var T = false;

function Start () {
	Player = GameObject.Find("Player");

}

function Update() {
	if(T){
		this.transform.position.x = Player.transform.position.x;
	  this.transform.eulerAngles.y = -Player.transform.position.x * 10;
	}
}

function OnTriggerEnter () {
	T = true;
}