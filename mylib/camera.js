function myCamera(position, worldUp){
	this.origin = [0,0,0]
	this.position = position.toVector3();
	this.worldUp = normalize(worldUp);
	this.cameraFront = [0,0,-1]
	this.cameraRight = calculateNormal(vector3ToCoord(this.origin),vector3ToCoord(this.cameraFront),vector3ToCoord(this.worldUp));
	this.cameraUp = calculateNormal(vector3ToCoord(this.origin),vector3ToCoord(this.cameraRight),vector3ToCoord(this.cameraFront));
	this.lookAt = addVectors(this.position,this.cameraFront);
	this.pitch = 0;
	this.yaw = 0;
	this.roll = 0;
}

myCamera.prototype.getFront = function() {
	var front = [];
	for(var i = 0;i<3;i++){
		front.push(this.lookAt[i]-this.position[i]);
	}
	return normalize(front);
}

myCamera.prototype.updatePosition = function(newPosition){
	this.position = newPosition;
	this.lookAt = addVectors(this.position,this.cameraFront)
}

myCamera.prototype.updateFront = function(){
	console.log(degreesToRadians(this.pitch))
	this.cameraFront[0] = Math.cos(degreesToRadians(this.pitch)) * Math.cos(degreesToRadians(this.yaw));
	this.cameraFront[1] = Math.sin(degreesToRadians(this.pitch));
	this.cameraFront[2] = Math.cos(degreesToRadians(this.pitch)) * Math.sin(degreesToRadians(this.yaw));
	this.cameraFront = normalize(this.cameraFront);
	console.log(this.cameraFront)
	this.lookAt = normalize(addVectors(this.position, this.cameraFront))
}