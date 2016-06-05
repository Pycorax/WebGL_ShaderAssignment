function Camera()
{
	this.moveSpeed = 0.01;
	this.lookSpeed = 0.005;
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
	vec3.add(this.position, [0, 0, this.moveSpeed * deltaTime]);
}

function MoveBackward(deltaTime)
{
	vec3.add(this.position, [0, 0, -this.moveSpeed * deltaTime]);
}

function MoveLeft(deltaTime)
{
	vec3.add(this.position, [this.moveSpeed * deltaTime, 0, 0]);
}

function MoveRight(deltaTime)
{
	vec3.add(this.position, [-this.moveSpeed * deltaTime, 0, 0]);
}

function LookUp(deltaTime)
{
	/*
	 * C++ Code
	 *
	float pitch = (float)(CAMERA_SPEED * (float)dt);
	Vector3 view = (target - position).Normalized();
	Vector3 right = view.Cross(up);
	right.y = 0;
	right.Normalize();
	up = right.Cross(view).Normalized();
	Mtx44 rotation;
	rotation.SetToRotation(pitch, right.x, right.y, right.z);
	view = rotation * view;
	target = position + view;
	*/

	/*
	 * WIP Port
	var pitch = this.lookSpeed * deltaTime;
	var view, right, rotationMtx;
	vec3.subtract(this.target, this.position, view);
	vec3.normalize(view);
	vec3.cross(view, this.up, right);
	right[1] = 0;
	vec3.normalize(right);
	vec3.cross(right, view, this.up);
	vec3.normalize(this.up);
	mat4.identity(rotationMtx);
	mat4.rotate(rotationMtx, pitch, 0,)
	*/
}

function LookDown(deltaTime)
{

}

function LookLeft(deltaTime)
{
	var yaw, view, right, mtxRot;
	view = vec3.create();
	right = vec3.create();
	mtxRot = mat4.create();
	yaw = this.lookSpeed * deltaTime;
	vec3.subtract(this.target, this.position, view);
	vec3.normalize(view);
	vec3.cross(view, this.up, right);
	right[1] = 0;
	vec3.normalize(right);
	vec3.cross(right, view, this.up);
	vec3.normalize(this.up);
	mat4.identity(mtxRot);
	mat4.rotateY(mtxRot, yaw);
	mat4.multiplyVec3(mtxRot, view);
	vec3.add(this.position, view, this.target);
}

function LookRight(deltaTime)
{

}
