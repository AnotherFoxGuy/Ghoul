#pragma strict

@script RequireComponent(Rigidbody)
@script RequireComponent(Animation)
@script RequireComponent(CapsuleCollider)

public var GodMode = false;
public var idle_ani : AnimationClip;
public var kill_ani : AnimationClip;
public var run_ani : AnimationClip;
public var jump_ani : AnimationClip;
public var climbwall_ani : AnimationClip;
public var pullup_ani : AnimationClip;
public var descent_ani : AnimationClip;

private var GodModeProgress = 0;
private var CheatDelay = 0f;
private var tulr = Mathf.Infinity;//TimeUntilLevelReload
private var Killed = false;
private var this_rigidbody : Rigidbody;
private var HitPoint: RaycastHit;
private var HitPoin_front: RaycastHit;
private var HitPoint_down: RaycastHit;
private var HitPoint_forward: RaycastHit;
private var last_clip: AnimationClip;
private var MaxSpeed = 5;
private var is_climbing = false;
private var thisPos : Vector3;
enum climb {up_start , up_mid , up_end , down_start , down_mid , down_end}


function Start() {
	this_rigidbody = this.GetComponent(Rigidbody);
}

function Update() {
	UpdateCheats();
	thisPos = Vector3(this.transform.position.x, this.transform.position.y + 1, this.transform.position.z);
	if (!this_rigidbody.isKinematic) {
		if (Physics.Raycast(thisPos, Vector3.down, 1.6)) {
			AnimateThis(idle_ani, false);
			if (Input.GetButton("Right")) AnimateThis(run_ani, false);
			else if (Input.GetButton("Left")) AnimateThis(run_ani, false);
		} else {
			AnimateThis(jump_ani, true);
		}
		if (Input.GetButtonDown("Jump")) {
			if (Physics.Raycast(thisPos, Vector3.down, 1.6)) {
				this_rigidbody.AddForce(transform.TransformDirection(Vector3.up * 300));
			}
		}
		if (Input.GetButton("Right")) {
			this.transform.eulerAngles.y = 90;
			if (this_rigidbody.velocity.x < MaxSpeed) {
				this_rigidbody.AddForce(transform.TransformDirection(Vector3.forward * 20));
			}
		}
		if (Input.GetButton("Left")) {
			this.transform.eulerAngles.y = 270;
			if (this_rigidbody.velocity.x > -MaxSpeed) {
				this_rigidbody.AddForce(transform.TransformDirection(Vector3.forward * 20));
			}
		}
		if (Input.GetButtonDown("Next")) {
			var test_pos0 = Vector3(thisPos.x, thisPos.y + 100, thisPos.z + 1);
			if (Physics.Raycast(test_pos0, Vector3.down, 300) && Physics.Raycast(thisPos, Vector3.forward, 50) && Physics.Raycast(thisPos, Vector3.down, 1.6)) Cilmb(climb.up_start);
		}
		if (Input.GetButtonDown("Previous")) {
			var test_pos1 = Vector3(thisPos.x, thisPos.y, thisPos.z - 1);
			if (Physics.Raycast(test_pos1, Vector3.down, 300) && Physics.Raycast(thisPos, Vector3.down, 1.6)) Cilmb(climb.down_start);
		}
		if (Input.GetButtonDown("Attach")) {
			var one;
			if (this.transform.eulerAngles.y > 180) one = -1;
			else one = 1;
			var pos_test1 = Vector3(this.transform.position.x, this.transform.position.y + 0.5, this.transform.position.z);
			if (Physics.Raycast(pos_test1, Vector3(one, 0, 0), HitPoint, 2)) {
				if (HitPoint.collider.tag == "Enemy") {
					this.GetComponent.<Animation>().Play(kill_ani.name);
					HitPoint.collider.SendMessage("KillThis", GetComponent.<Animation>()[descent_ani.name].clip.length);
				}
			}
		}
	}
	if (is_climbing) {
		var pos_test = Vector3(this.transform.position.x, this.transform.position.y + 1.5, this.transform.position.z);
		if (!Physics.Raycast(pos_test, Vector3.forward, 1)) {
			this.GetComponent.<Animation>().Play(idle_ani.name);
			is_climbing = false;
			CilmbAni(climb.up_mid);
		} else {
			var translation = Time.deltaTime * 2;
			transform.Translate(0, translation, 0);
		}
	}
	if (Time.realtimeSinceStartup > tulr) {
		Time.timeScale = 1;
		Application.LoadLevel(Application.loadedLevel);
	}

}

function OnGUI() {
	if (Killed) {
		GUI.Box(Rect(Screen.width / 2 - 100, Screen.height / 2 - 15, 200, 30), "dead! Not big surprise ");
	}
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

function Cilmb(climbtype: climb) {
	if (climbtype == climb.up_start) {
		this_rigidbody.isKinematic = true;
		if (Physics.Raycast(thisPos, Vector3.forward, HitPoint_forward, 50)) {
			this.transform.position.z = HitPoint_forward.point.z - 0.5;
			this.transform.position.y += 0.1;
			this.transform.eulerAngles.y = 0;
			CilmbAni(climb.up_start);
		}
	} else if (climbtype == climb.up_end) {
		var pos_ray0 = Vector3(thisPos.x, thisPos.y + 100, thisPos.z + 1);
		if (Physics.Raycast(pos_ray0, Vector3.down, HitPoint_down, 300)) {
			this.transform.position.y = HitPoint_down.point.y;
			this.transform.position.z = HitPoint_down.point.z;
			this.transform.eulerAngles.y = 90;
			this_rigidbody.isKinematic = false;
		}
	} else if (climbtype == climb.down_start) {
		var pos_ray2 = Vector3(thisPos.x, thisPos.y, thisPos.z - 1);
		if (Physics.Raycast(pos_ray2, Vector3.down, HitPoint_down, 300)) {
			Debug.DrawLine(thisPos, HitPoint_down.point);
			var pos_ray1 = Vector3(HitPoint_down.point.x, HitPoint_down.point.y - 0.5, HitPoint_down.point.z - 100);
			if (Physics.Raycast(pos_ray1, Vector3.forward, HitPoint_forward, 300)) {
				this.transform.position.z = HitPoint_forward.point.z + 0.5;
				this.transform.position.y -= 1.5;
				this_rigidbody.isKinematic = true;
				this.transform.eulerAngles.y = 0;
				CilmbAni(climb.down_start);

			}
		}
	} else if (climbtype == climb.down_end) {
		this_rigidbody.isKinematic = false;
		this_rigidbody.AddForce(transform.TransformDirection(Vector3.up * 20));
	}
}

function CilmbAni(climbtype: climb) {
	if (climbtype == climb.up_start) {
		this.GetComponent.<Animation>().Play(climbwall_ani.name);
		is_climbing = true;
	} else if (climbtype == climb.up_mid) {
		this.GetComponent.<Animation>().Play(pullup_ani.name);
		yield WaitForSeconds(GetComponent.<Animation>()[pullup_ani.name].clip.length);
		this.GetComponent.<Animation>().Play(idle_ani.name);
		Cilmb(climb.up_end);
	} else if (climbtype == climb.down_start) {
		this.GetComponent.<Animation>().Play(descent_ani.name);
		yield WaitForSeconds(GetComponent.<Animation>()[descent_ani.name].clip.length);
		this.GetComponent.<Animation>().Play(idle_ani.name);
		Cilmb(climb.down_end);
	}
}

function UpdateCheats() {
	if (CheatDelay > 0.0) {
		CheatDelay -= Time.deltaTime;
		if (CheatDelay <= 0.0) {
			CheatDelay = 0.0;
			GodModeProgress = 0;
		}
	}
	if (GodModeProgress == 0 && Input.GetKeyDown('e')) {
		++GodModeProgress;
		CheatDelay = 1.0;
	} else if (GodModeProgress == 1 && Input.GetKeyDown('d')) {
		++GodModeProgress;
		CheatDelay = 1.0;
	} else if (GodModeProgress == 2 && Input.GetKeyDown('g')) {
		++GodModeProgress;
		CheatDelay = 1.0;
	} else if (GodModeProgress == 3 && Input.GetKeyDown('a')) {
		++GodModeProgress;
		CheatDelay = 1.0;
	} else if (GodModeProgress == 4 && Input.GetKeyDown('r')) {
		GodModeProgress = 0;
		GodMode = !GodMode;
		print("GodMode On!");
	}
}

function KillThis(kill_time: float) {
	//@TODO Add animation stuff
	if (!GodMode && !Killed) {
		tulr = Time.realtimeSinceStartup + 2;
		Killed = true;
		Time.timeScale = 0;
	}
}