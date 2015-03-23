#pragma strict

@script RequireComponent(Rigidbody)
@script RequireComponent(CapsuleCollider)
@script RequireComponent(Animation)
@script AddComponentMenu ("NPC/InmateBrute")

var is_free = false;
var idle_ani: AnimationClip;
var kill_ani: AnimationClip;
var run_ani: AnimationClip;
var jump_ani: AnimationClip;
var IBClimbwall_ani: AnimationClip;
var pullup_ani: AnimationClip;
var descent_ani: AnimationClip;

private var this_rigidbody: Rigidbody;
private var HitPoint_down: RaycastHit;
private var HitPoint_forward: RaycastHit;
private enum IBClimb {up_start, up_mid, up_end, down_start, down_mid, down_end}
private var MovementSpeed = 1;
private var move_to = 1;
private var One = 1;
private var hit_point: RaycastHit;
//private var Enemy : GameObject;
private var can_kill = 0;
private var layer_mask = ~ ((1 << 8) | (1 << 9) | (1 << 10));
private var jump_down = true;
private var is_working = false;
private var timer: float;

function Start() {
	move_to = MovementSpeed;
	can_kill = Random.Range(2, 5);
	this_rigidbody = this.GetComponent(Rigidbody);
}

function Update() {
	if (!this_rigidbody.isKinematic) {
		var translation = Time.deltaTime * move_to;
		transform.Translate(translation, 0, 0);
	}
	var hitR: RaycastHit;
	var hitL: RaycastHit;
	var Enemy: GameObject;
	var pos_ray = Vector3(this.transform.position.x, this.transform.position.y - 0.2, this.transform.position.z);
	Physics.Raycast(pos_ray, Vector3.right, hitR, 500);
	Physics.Raycast(pos_ray, Vector3.left, hitL, 500);
	if (hitR.collider != null) {
		if (hitR.collider.tag == "Guard")
			Enemy = hitR.collider.gameObject;
		else if (hitR.collider.tag == "Player")
			Enemy = hitR.collider.gameObject;
	}
	if (hitL.collider != null) {
		if (hitL.collider.tag == "Guard")
			Enemy = hitL.collider.gameObject;
		else if (hitL.collider.tag == "Player")
			Enemy = hitL.collider.gameObject;
	}
	if (Enemy != null) {
		isInChase(Enemy);
		//print("isInChase");
	} else if (jump_down && Time.time > timer) {
		Cilmb(IBClimb.down_start);
	} else {
		isNotInChase();
		//print("isNotInChase");
	}
}

function Cilmb(IBClimbtype: IBClimb) {
	if (IBClimbtype == IBClimb.down_start) {
		var pos_ray3 = Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z - 1);
		if (Physics.Raycast(pos_ray3, Vector3.down, HitPoint_down, 300, layer_mask)) {
			var pos_ray4 = Vector3(HitPoint_down.point.x, HitPoint_down.point.y - 0.5, HitPoint_down.point.z - 100);
			if (Physics.Raycast(pos_ray4, Vector3.forward, HitPoint_forward, 300, layer_mask)) {
				this.transform.position.z = HitPoint_forward.point.z + 0.5;
				this.transform.position.y -= 1.5;
				this_rigidbody.isKinematic = true;
				//this.transform.eulerAngles.y = 90;
				CilmbAni();
			}
		}
	} else if (IBClimbtype == IBClimb.down_end) {
		this_rigidbody.isKinematic = false;
		//this_rigidbody.AddForce(transform.TransformDirection(Vector3.up * 20));
		jump_down = false;
		SetTimer();
	}
}

function isNotInChase() {
	move_to = MovementSpeed;
	var PosTMP = Vector3(this.transform.position.x + One, this.transform.position.y - 0.25, this.transform.position.z);
	if (Physics.Raycast(this.transform.position, Vector3.down, 1)) {
		if (!Physics.Raycast(PosTMP, Vector3.down, hit_point, 1, layer_mask) || Physics.Raycast(this.transform.position, Vector3(One, 0, 0), hit_point, 1, layer_mask)) {
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

function isInChase(Enemy: GameObject) {
	SetTimer();
	var pos_ray = Vector3(this.transform.position.x, this.transform.position.y - 0.25, this.transform.position.z);
	var dist = Vector3.Distance(this.transform.position, Enemy.transform.position);
	move_to = MovementSpeed * 3;
	if (this.transform.position.x > Enemy.transform.position.x) {
		One = -1;
		this.transform.eulerAngles.y = 180;
	} else {
		One = 1;
		this.transform.eulerAngles.y = 0;
	}
	if (dist < 2) {
		Enemy.SendMessage("BruteKillThis", 0);
	}
}


function CilmbAni() {
	this.GetComponent. < Animation > ().Play(descent_ani.name);
	yield WaitForSeconds(GetComponent. < Animation > ()[descent_ani.name].clip.length);
	this.GetComponent. < Animation > ().Play(idle_ani.name);
	Cilmb(IBClimb.down_end);
}

function KillThis(kill_time: float) {

}

function SetTimer() {
	timer = Time.time + Random.Range(3.0, 5.0);
}
