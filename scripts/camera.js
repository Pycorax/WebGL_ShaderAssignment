function Camera()
{
	this.moveSpeed = 0.01;
	this.lookSpeed = 0.1;
	this.position = vec3.create();
	this.target = vec3.create();
	this.up = vec3.create();

	// Function Definitions
	// -- Movement
	this.MoveForward = MoveForward;
	this.MoveBackward = MoveBackward;
	this.MoveLeft = MoveLeft;
	this.MoveRight = MoveRight;
	// -- Look
	this.LookUp = LookUp;
	this.LookDown = LookDown;
	this.LookLeft = LookLeft;
	this.LookRight = LookRight;
}

function MoveForward(deltaTime)
{
	MoveForwardBackward(this, deltaTime);
}

function MoveBackward(deltaTime)
{
	MoveForwardBackward(this, -deltaTime);
}

function MoveForwardBackward(camera, deltaTime)
{
	// Calculate the distance we will move
	var moveDist = camera.moveSpeed * deltaTime;
	// Calculate the view direction
	var view = vec3.create();
	vec3.subtract(camera.target, camera.position, view);
	vec3.normalize(view);
	// Calculate the vector in which we will move
	vec3.scale(view, moveDist);
	// Add this vector to the position
	vec3.add(camera.position, view);
	// Add this vector to the target
	vec3.add(camera.target, view);
}

function MoveLeft(deltaTime)
{
	MoveLeftRight(this, deltaTime);
}

function MoveRight(deltaTime)
{
	MoveLeftRight(this, -deltaTime);
}

function MoveLeftRight(camera, deltaTime)
{
	// Calculate the distance we will move
	var moveDist = -camera.moveSpeed * deltaTime;
	// Calculate the view direction
	var view = vec3.create();
	vec3.subtract(camera.target, camera.position, view);
	vec3.normalize(view);
	// Calculate the right direction
	var right = vec3.create();
	vec3.cross(view, camera.up, right);
	// Calculate the vector in which we will move
	vec3.scale(right, moveDist);
	// Add this vector to the position
	vec3.add(camera.position, right);
	// Add this vector to the target
	vec3.add(camera.target, right);
}

function LookUp(deltaTime)
{
	LookUpDown(this, deltaTime)
}

function LookDown(deltaTime)
{
	LookUpDown(this, -deltaTime)
}

function LookUpDown(camera, deltaTime)
{
	var pitch = camera.lookSpeed * deltaTime;
	var view, right, rotationMtx;
	view = vec3.create();
	right = vec3.create();
	rotationMtx = mat4.create();
	vec3.subtract(camera.target, camera.position, view);
	vec3.normalize(view);
	vec3.cross(view, camera.up, right);
	right[1] = 0;
	vec3.normalize(right);
	vec3.cross(right, view, camera.up);
	vec3.normalize(camera.up);
	mat4.identity(rotationMtx);
	Mtx44SetToRotation(rotationMtx, pitch, right[0], right[1], right[2]);
	mat4.multiplyVec3(rotationMtx, view);
	vec3.add(camera.position, view, camera.target);
}

function LookLeft(deltaTime)
{
	LookLeftRight(this, deltaTime);
}

function LookRight(deltaTime)
{
	LookLeftRight(this, -deltaTime);
}

function LookLeftRight(camera, deltaTime)
{
	// Create the temp vars we will be using
	var yaw, view, right, mtxRot;
	view = vec3.create();
	right = vec3.create();
	mtxRot = mat4.create();
	// Calculate the distance to rotate
	yaw = camera.lookSpeed * deltaTime;
	// Calculate the view direction
	vec3.subtract(camera.target, camera.position, view);
	vec3.normalize(view);
	// Calculate the right direction
	vec3.cross(view, camera.up, right);
	// Discard the vertical axis
	right[1] = 0.0;
	vec3.normalize(right);
	// Get the up vector
	vec3.cross(right, view, camera.up);
	vec3.normalize(camera.up);
	// Create the rotation matrix
	mat4.identity(mtxRot);
	Mtx44SetToRotation(mtxRot, yaw, 0.0, 1.0, 0.0);
	// Calculate the view
	mat4.multiplyVec3(mtxRot, view);
	// Calculate the new target
	vec3.add(camera.position, view, camera.target);
}

// Helper Function
function Mtx44SetToRotation(mat, degrees, axisX, axisY, axisZ)
{
	var mag = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
	var x = axisX / mag;
	var y = axisY / mag;
	var z = axisZ / mag;
	var c = Math.cos(degrees * 3.14 / 180.0);
	var s = Math.sin(degrees * 3.14 / 180.0);

	mat[0] = (x * x * (1.0 - c) + c);
	mat[1] = (y * x * (1.0 - c) + z * s);
	mat[2] = (x * z * (1.0 - c) - y * s);
	mat[3] = 0;
	mat[4] = (x * y * (1.0 - c) - z * s);
	mat[5] = (y * y * (1.0 - c) + c);
	mat[6] = (y * z * (1.0 - c) + x * s);
	mat[7] = 0;
	mat[8] = (x * z * (1.0 - c) + y * s);
	mat[9] = (y * z * (1.0 - c) - x * s);
	mat[10] = (z * z * (1.0 - c) + c);
	mat[11] = 0;
	mat[12] = 0;
	mat[13] = 0;
	mat[14] = 0;
	mat[15] = 1;

	return mat;
}
