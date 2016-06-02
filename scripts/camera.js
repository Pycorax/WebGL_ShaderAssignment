function Camera()
{
	this.moveSpeed = 0.01;
	this.position = vec3.create();
	this.target = vec3.create();

	// Function Definitions
	this.MoveForward = MoveForward;
	this.MoveBackward = MoveBackward;
	this.MoveLeft = MoveLeft;
	this.MoveRight = MoveRight;
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
