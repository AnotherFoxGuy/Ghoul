#pragma strict


function OnTriggerEnter (otherObj : Collider) {
        if (otherObj.tag == "Player") Destroy(this.gameObject);
}
