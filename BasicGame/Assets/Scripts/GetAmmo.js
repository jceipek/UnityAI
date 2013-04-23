#pragma strict
var other : GameObject;
var utilityKey : UtilityKey;
var gun : GameObject;
 
function OnTriggerEnter(other : Collider) {
                Debug.Log("entered1");
                var utilityKey: UtilityKey = gun.gameObject.GetComponent(UtilityKey);
                Destroy(other.gameObject);
                utilityKey.ammoCount += 10;
}
