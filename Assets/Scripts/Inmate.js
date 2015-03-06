#pragma strict

@script RequireComponent(MeshRenderer)
@script RequireComponent(MeshFilter)
@script RequireComponent(Rigidbody)
@script RequireComponent(Animation)
@script RequireComponent(CapsuleCollider)
@script AddComponentMenu ("NPC/Inmate")

enum move_directions {
	left, right
}
var MoveDirection: move_directions;
var is_free = false;
var idle_ani: AnimationClip;
var kill_ani: AnimationClip;
var run_ani: AnimationClip;
var jump_ani: AnimationClip;
var climbwall_ani: AnimationClip;
var pullup_ani: AnimationClip;
var descent_ani: AnimationClip;

private var this_rigidbody: Rigidbody;
private var HitPoint: RaycastHit;
private var HitPoint_down: RaycastHit;
private var HitPoint_forward: RaycastHit;
private var last_clip: AnimationClip;
private var is_climbing = false;
private var thisPos: Vector3;
private var One = 1;
private  enum climbI {
	up_start, up_mid, up_end, down_start, down_mid, down_end
}
private var MovementSpeed = 3;
private var MoveTo = 1;
private var can_kill = 0;
private var is_working = false;
private var timer: float;
private var layerMask = ~ ((1 << 8) | (1 << 9) | (1 << 10));


function Start() {
	if (MoveDirection == move_directions.left) {
		MovementSpeed = -MovementSpeed;
		One = -One;
	}
	MoveTo = MovementSpeed;
	this_rigidbody = this.GetComponent(Rigidbody);
	SetTimer();
}

function Update() {
	if (is_free) {
		if (!this_rigidbody.isKinematic) {
			var translation = Time.deltaTime * MoveTo;
			transform.Translate(translation, 0, 0);
		}
		var pos_ray0 = Vector3(this.transform.position.x, this.transform.position.y - 0.5, this.transform.position.z);
		var pos_ray1 = Vector3(this.transform.position.x, this.transform.position.y + 1, this.transform.position.z);
		if (Physics.Raycast(pos_ray0, Vector3(One, 0, 0), 0.9, layerMask) && !is_working && !this_rigidbody.isKinematic) {
			if (Physics.Raycast(pos_ray1, Vector3(One, 0, 0), 1, layerMask)) {
				if (Physics.Raycast(this.transform.position, Vector3.forward, 50, layerMask)) {
					Cilmb(climbI.up_start);
				} else {
					Cilmb(climbI.down_start);
				}
			} else {
				Jump();
			}
		}
		if (Time.time > timer && !this_rigidbody.isKinematic) {
			var dist = 0f;
			var closest_object = GetClosestObject("Guard");
			if (closest_object != null) {
				dist = Vector3.Distance(this.transform.position, closest_object.transform.position);
			}
			var pos_ray2 = Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z - 1);
			if (Physics.Raycast(this.transform.position, Vector3.forward, 50, layerMask) && dist > 4) {
				Cilmb(climbI.up_start);
			} else if (Physics.Raycast(pos_ray1, Vector3.down, 5, layerMask) && dist > 4) {
				Cilmb(climbI.down_start);
			} else {
				SetTimer();
			}
		}
		if (is_climbing) {
			var pos_test = Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z);
			if (!Physics.Raycast(pos_test, Vector3.forward, 1, layerMask)) {
				this.GetComponent.<Animation>().Play(idle_ani.name);
				is_climbing = false;
				CilmbAni(climbI.up_mid);
			} else {
				var translationUp = Time.deltaTime * 2;
				transform.Translate(0, translationUp, 0);
			}
		}
	}
}

function FreeInmate() {
	is_free = true;
}

function KillThis(kill_time: float) {
	//@TODO Add animation stuff
	Destroy(this.gameObject, kill_time);
	MoveTo = 0;
}

function AnimateThis(CurrentClip: AnimationClip, Forced: boolean) {
	if (last_clip != CurrentClip) {
		if (Forced)
			this.GetComponent.<Animation>().Play(CurrentClip.name);
		else
			this.GetComponent.<Animation>().CrossFade(CurrentClip.name, 0.2);
		last_clip = CurrentClip;
	}
}

function Jump() {
	this_rigidbody.AddForce(transform.TransformDirection(Vector3.up * 300));
	is_working = true;
	yield WaitForSeconds(0.5);
	is_working = false;
}

function Cilmb(climbtype: climbI) {
	if (climbtype == climbI.up_start) {
		this_rigidbody.isKinematic = true;
		if (Physics.Raycast(this.transform.position, Vector3.forward, HitPoint_forward, 50, layerMask)) {
			this.transform.position.z = HitPoint_forward.point.z - 0.5;
			this.transform.position.y += 0.1;
			//this.transform.eulerAngles.y = 90;
			CilmbAni(climbI.up_start);
		}
	} else if (climbtype == climbI.up_end) {
		var pos_ray1 = Vector3(this.transform.position.x, this.transform.position.y + 100, this.transform.position.z + 1);
		if (Physics.Raycast(pos_ray1, Vector3.down, HitPoint_down, 300, layerMask)) {
			this.transform.position.y = HitPoint_down.point.y + 1;
			this.transform.position.z = HitPoint_down.point.z;
			//this.transform.eulerAngles.y = 180;
			this_rigidbody.isKinematic = false;
			is_working = false;
			SetTimer();
		}
	} else if (climbtype == climbI.down_start) {
		var pos_ray3 = Vector3(this.transform.position.x, this.transform.position.y, this.transform.position.z - 1);
		if (Physics.Raycast(pos_ray3, Vector3.down, HitPoint_down, 300, layerMask)) {
			var pos_ray4 = Vector3(HitPoint_down.point.x, HitPoint_down.point.y - 0.5, HitPoint_down.point.z - 100);
			if (Physics.Raycast(pos_ray4, Vector3.forward, HitPoint_forward, 300, layerMask)) {
				this.transform.position.z = HitPoint_forward.point.z + 0.5;
				this.transform.position.y -= 1.5;
				this_rigidbody.isKinematic = true;
				//this.transform.eulerAngles.y = 90;
				CilmbAni(climbI.down_start);
			}
		}
	} else if (climbtype == climbI.down_end) {
		this_rigidbody.isKinematic = false;
		//this_rigidbody.AddForce(transform.TransformDirection(Vector3.up * 20));
		is_working = false;
		SetTimer();
	}
}

function SetTimer() {
	timer = Time.time + Random.Range(3.0, 5.0);
}

function CilmbAni(climbtype: climbI) {
	if (climbtype == climbI.up_start) {
		this.GetComponent.<Animation>().Play(climbwall_ani.name);
		is_climbing = true;
	} else if (climbtype == climbI.up_mid) {
		this.GetComponent.<Animation>().Play(pullup_ani.name);
		yield WaitForSeconds(GetComponent.<Animation>()[pullup_ani.name].clip.length);
		this.GetComponent.<Animation>().Play(idle_ani.name);
		Cilmb(climbI.up_end);
	} else if (climbtype == climbI.down_start) {
		this.GetComponent.<Animation>().Play(descent_ani.name);
		yield WaitForSeconds(GetComponent.<Animation>()[descent_ani.name].clip.length);
		this.GetComponent.<Animation>().Play(idle_ani.name);
		Cilmb(climbI.down_end);
	}
}

function GetClosestObject(tag: String): GameObject {
	var objectsWithTag = GameObject.FindGameObjectsWithTag(tag);
	var closestObject: GameObject;
	for (var obj: GameObject in objectsWithTag) {
		if (!closestObject)
			closestObject = obj;
		if (Vector3.Distance(transform.position, obj.transform.position) <= Vector3.Distance(transform.position, closestObject.transform.position))
			closestObject = obj;
	}
	return closestObject;
}