#pragma strict

private var Timer = 0;
private var CoinsFound = 0;
private var coinsInLevelTotal = 0;


function Start() {
	var coinsInLevel: GameObject[];
	coinsInLevel = GameObject.FindGameObjectsWithTag("Coin");
	coinsInLevelTotal = coinsInLevel.length;
}

function Awake() {
	Application.targetFrameRate = 100;
}

function OnTriggerEnter(otherObj: Collider) {
	if (otherObj.tag == "Player") {
		Application.LoadLevel(Application.loadedLevel);
	} else {
		Destroy(otherObj.gameObject);
	}
}

function OnGUI() {
	GUI.Box(Rect(10, 50, 150, 25), "Coins collected: " + CoinsFound);
}

function Update() {
	if (Time.time > Timer) {
		Timer = Time.time + 1;
		var coinsInLevel: GameObject[];
		coinsInLevel = GameObject.FindGameObjectsWithTag("Coin");
		CoinsFound = coinsInLevelTotal - coinsInLevel.length;
	}
}