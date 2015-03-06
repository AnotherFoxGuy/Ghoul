#pragma strict

@script RequireComponent(MeshRenderer)
@script RequireComponent(MeshFilter)
@script RequireComponent(Rigidbody)
@script RequireComponent(CapsuleCollider)
@script AddComponentMenu ("NPC/InmateBrute")

private var MovementSpeed = 1;
private var MoveTo = 1;
private var One = 1;
private var HitPoint: RaycastHit;
private var Enemy : GameObject;
private var can_kill = 0;
private var layerMask = ~ ((1 << 8) | (1 << 9) | (1 << 10));


function Start() {
	MoveTo = MovementSpeed;
	can_kill = Random.Range(2, 5);
}

function Update() {
	Enemy = GetClosestObject("Enemy");
	var translation = Time.deltaTime * MoveTo;
	transform.Translate(translation, 0, 0);
	if (Enemy != null) isInChase();
	else isNotInChase();
}

function GetClosestObject(tag: String): GameObject {
	var objectsWithTag = GameObject.FindGameObjectsWithTag(tag);
	var closestObject: GameObject;
	for (var obj: GameObject in objectsWithTag) {
		if (this.transform.position.z < obj.transform.position.z + 0.2 && this.transform.position.z > obj.transform.position.z - 0.2) {
			if (!closestObject)
				closestObject = obj;
			if (Vector3.Distance(transform.position, obj.transform.position) <= Vector3.Distance(transform.position, closestObject.transform.position))
				closestObject = obj;
		}
	}
	return closestObject;
}

function isNotInChase() {
	MoveTo = MovementSpeed;
	var PosTMP = Vector3(this.transform.position.x + One, this.transform.position.y, this.transform.position.z);
	if (Physics.Raycast(this.transform.position, Vector3.down, 1)) {
		if (!Physics.Raycast(PosTMP, Vector3.down, HitPoint, 1, layerMask) || Physics.Raycast(this.transform.position, Vector3(One, 0, 0), HitPoint, 1, layerMask)) {
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
	var dist = Vector3.Distance(this.transform.position, Enemy.transform.position);
	MoveTo = MovementSpeed * 3;
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