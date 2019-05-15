function myCamera(position, lookAt, worldUp){
	this.position = position.toVector3();
	this.lookAt = lookAt.toVector3();
	this.worldUp = normalize(worldUp.toVector3());
	this.cameraDirection = getDirection(position, lookAt);
	this.cameraRight = calculateNormal(vector3ToCoord(worldUp),vector3ToCoord(cameraDirection));
	this.cameraUp = calculateNormal(vector3ToCoord(cameraDirection),vector3ToCoord(cameraRight));
}

myCamera.prototype.getDirection = function(position, lookAt) {
	var direction = [];
	direction.push(position.x-lookAt.x,position.y-lookAt.y,position.z-lookAt.z)
	return normalize(direction);
}