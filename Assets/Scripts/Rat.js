#pragma strict

@script RequireComponent(MeshRenderer)
@script RequireComponent(MeshFilter)
@script RequireComponent(Rigidbody)
@script RequireComponent(BoxCollider)
@script AddComponentMenu ("NPC/Rat")


private var MoveTo = 1;
private var One = 1;
private var HitPoint: RaycastHit;


function Update() {
	var translation = Time.deltaTime * MoveTo;
	transform.Translate(translation, 0, 0);
	var PosTMP = Vector3(this.transform.position.x + One, this.transform.position.y, this.transform.position.z);
	if (Physics.Raycast(this.transform.position, Vector3.down, 1)) {
		if (!Physics.Raycast(PosTMP, Vector3.down, HitPoint, 1) || Physics.Raycast(this.transform.position, Vector3(One, 0, 0), HitPoint, 1)) {
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