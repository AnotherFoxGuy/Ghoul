#pragma strict

@script RequireComponent(MeshRenderer)
@script RequireComponent(MeshFilter)
@script RequireComponent(Rigidbody)
@script RequireComponent(CapsuleCollider)
@script AddComponentMenu ("NPC/Guard")

enum enemy_types {
	Guard, GuardCaptain, GuardDog
}
var EnemyType :enemy_types;
var NoteIcon: Material;

private var MovementSpeed = 2;
private var HitPoint: RaycastHit;
private var Flashlight: Transform;
private var Timer = 0;
private var ft = 0;
private var seen = 1;
private var seenc = 1;
private var MoveTo = 1;
private var One = 1;
private var chase = false;
private var collision = false;
private var forget_timer : float;
private var forget_time = 20;
private var seen_obj: GameObject;
private var layerMask = ~ ((1 << 8) | (1 << 9) | (1 << 10));
private var note_icon: Material;
private var thisPos : Vector3;

function Start() {
	seen_obj = GameObject.Find("Player");
	if (EnemyType == enemy_types.GuardDog) MovementSpeed *= 2;
	MoveTo = MovementSpeed;
	if (!NoteIcon) print("NoteIcon is empty!");
	else {
		var mats: Material[] = GetComponent.<Renderer>().materials;
		for (var i: int = 0; i < mats.length; i++) {
			if (mats[i].name == NoteIcon.name + " (Instance)") {;
				note_icon = new Material(NoteIcon);
				mats[i] = note_icon;
			}
		}
		GetComponent.<Renderer>().materials = mats;
	}
}

function Update() {
	thisPos = Vector3(this.transform.position.x, this.transform.position.y - 0.4, this.transform.position.z);
	if (seen_obj == null) seen_obj = GameObject.Find("Player");
	if (EnemyType == enemy_types.GuardDog) UpdateD();
	else UpdateG();
}

function UpdateG() {
	if (NoteIcon) {
		note_icon.color.a = seenc / 100f;
	}
	var translation = Time.deltaTime * MoveTo;
	transform.Translate(translation, 0, 0);
	if (chase) isInChase();
	else isNotInChase();
	if (ft != 0) seenc = seen * 100 / ft;
	if (ft > 100) {
		ft /= 2;
		seen /= 2;
		if (seen < 0) seen = 0;
	}
	if (seenc > 25) chase = true;
	if (seenc == 0 && forget_timer == 0) SetTimer();
	if (Time.time > forget_timer) {
		chase = false;
		forget_timer = 0;
	}
}

function UpdateD() {
	var translation = Time.deltaTime * MoveTo;
	transform.Translate(translation, 0, 0);
	if (chase) isInChase();
	else isNotInChase();
	var PosTMP = Vector3(thisPos.x + One, thisPos.y, thisPos.z);
	if (!Physics.Raycast(PosTMP, Vector3.down, HitPoint, 1, layerMask) || Physics.Raycast(thisPos, Vector3(One, 0, 0), HitPoint, 1, layerMask)) {
		print("hit");
		if (One > 0) {
			One = -1;
			this.transform.eulerAngles.y = 180;
		} else {
			One = 1;
			this.transform.eulerAngles.y = 0;
		}
	}
	if (thisPos.z > seen_obj.transform.position.z - 1 && thisPos.z < seen_obj.transform.position.z + 1) {
		if (thisPos.y > seen_obj.transform.position.y - 1 && thisPos.y < seen_obj.transform.position.y + 1) {
			var dist = Vector3.Distance(seen_obj.transform.position, thisPos);
			if (dist < 10 && !Physics.Raycast(thisPos, Vector3(One, 0, 0), dist - 1, layerMask)) {
				if (thisPos.x < seen_obj.transform.position.x && One == 1) chase = true;
				else if (thisPos.x > seen_obj.transform.position.x && One == -1) chase = true;
				else if (dist < 5) chase = true;
			} else if (forget_timer == 0) SetTimer();
		} else if (forget_timer == 0) SetTimer();
	} else if (forget_timer == 0) SetTimer();
	if (Time.time > forget_timer) {
		chase = false;
		forget_timer = 0;
	}
}

function SetTimer() {
	forget_timer = Time.time + Random.Range(forget_time - 1, forget_time + 1);
}

function OnTriggerEnter(otherObj: Collider) {
	if (otherObj.tag == "Player" || otherObj.tag == "Inmate") {
		chase = true;
		seen = 100;
	}
}

function isNotInChase() {
	MoveTo = MovementSpeed;
	var PosTMP = Vector3(thisPos.x + One, thisPos.y, thisPos.z);
	if (Physics.Raycast(thisPos, Vector3.down, 1, layerMask)) {
		if (!Physics.Raycast(PosTMP, Vector3.down, 1, layerMask) || Physics.Raycast(thisPos, Vector3(One, 0, 0), 1, layerMask)) {
			if (One > 0) {
				One = -1;
				this.transform.eulerAngles.y = 180;
			} else {
				One = 1;
				this.transform.eulerAngles.y = 0;
			}
		}
	}
}

function isInChase() {
	var dist = Vector3.Distance(thisPos, seen_obj.transform.position);
	if (Physics.Raycast(thisPos, Vector3(One, 0, 0), 2, layerMask)) MoveTo = 0;
	else {
		if (EnemyType != enemy_types.GuardDog) MoveTo = MovementSpeed * 2;
		if (Physics.Raycast(thisPos, Vector3.down, 1, layerMask)) {
			if (thisPos.x > seen_obj.transform.position.x + 0.2) {
				One = -1;
				this.transform.eulerAngles.y = 180;
			} else if (thisPos.x < seen_obj.transform.position.x - 0.2) {
				One = 1;
				this.transform.eulerAngles.y = 0;
			} else {
				MoveTo = 0;
			}
		}
	}
	if (dist > 10) chase = false;
	if (dist < 1.5) {
		seen_obj.SendMessage("KillThis", 0);
		chase = false;
		forget_timer = 0;
	}
}

function caVis(dir: int) { //calculate visibility
	ft++;
	var raniun: Vector2 = Random.insideUnitCircle / 8;
	var lookAt = Vector3(dir, raniun.x, raniun.y);
	if (Physics.Raycast(thisPos, lookAt, HitPoint, 20)) {
		if (HitPoint.transform.tag == "Player" || HitPoint.transform.tag == "Inmate") {
			seen++;
			seen_obj = HitPoint.transform.gameObject;
		}
	}
}

function OnGUI() {
	caVis(One);
}

function KillThis(kill_time: float) {
	//@TODO Add animation stuff
	if (EnemyType != enemy_types.GuardCaptain) {
		Destroy(this.gameObject, kill_time);
		MoveTo = 0;
	} else {
		seen_obj.SendMessage("KillThis", 0);
	}
}

function BruteKillThis(kill_time: float) {
	//@TODO Add animation stuff
	Destroy(this.gameObject, kill_time);
	MoveTo = 0;

}

function insEnemy() {
	var HitPoint: RaycastHit;
	var HitPoint_down: RaycastHit;
	var HitPoint_forward: RaycastHit;
	var pos_ray0 = Vector3(thisPos.x, thisPos.y + 100, thisPos.z - 1);
	if (Physics.Raycast(pos_ray0, Vector3.down, HitPoint_down, 300, layerMask)) {
		var pos_ray1 = Vector3(HitPoint_down.point.x, HitPoint_down.point.y - 0.5, HitPoint_down.point.z - 100);
		if (Physics.Raycast(pos_ray1, Vector3.forward, HitPoint_forward, 300, layerMask)) {
			thisPos.z = HitPoint_forward.point.z + 0.5;
			thisPos.y = HitPoint_down.point.y + 1;
		}
	}
}