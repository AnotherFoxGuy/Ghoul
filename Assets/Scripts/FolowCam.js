#pragma strict

private var Player : GameObject ;
//public var MoveTo : Transform;
private var p : Vector3;

function Start () {
        Player = GameObject.Find("Player");
	this.transform.position = Vector3(Player.transform.position.x, Player.transform.position.y + 4, Player.transform.position.z - 10);
        p = this.transform.position;
}

function Update () {
        var PosTMP = Vector3(0, Player.transform.position.y + 4, Player.transform.position.z - 10);
        var dif = p - PosTMP;
        dif/=4;
        this.transform.position -= dif;
        this.transform.position.x = Player.transform.position.x;
        p = this.transform.position;
}
