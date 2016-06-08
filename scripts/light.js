/****************************************/
/* Light Class                           */
/****************************************/
const LIGHT_TYPE_POINT = 0;
const LIGHT_TYPE_DIRECTIONAL = 1;
const LIGHT_TYPE_SPOT = 2;

function Light()
{
    // Basics
	this.enabled = true;
	this.power = 0.0;
    this.type = LIGHT_TYPE_POINT;
    this.position = vec3.create();
    this.direction = vec3.create();
	this.color = vec3.create();
	this.color = [1.0, 1.0, 1.0];

    // Lighting Coefficients
    this.kAmbient = 1.0;
    this.kDiffuse = 1.0;
    this.kSpecular = 1.0;

    // Attenuation
    this.kConstant = 1.0;
    this.kLinear = 0.01;
    this.kQuadratic = 0.001;

    // Spot Light Angles
    this.spotInnerAngle = 30.0;
    this.spotOuterAngle = 120.0;

	// Function Definitions
	this.Init = Initialize;
	this.InitPoint = InitializePoint;
	this.InitDirectional = InitializeDirectional;
	this.InitSpot = InitializeSpot;
	this.SetLightProperties = SetLightProperties;
	this.SetAttenuation = SetAttenuation;
}

// Function to initialize the light basics
// -- type : int (0 - 2) (Light.TYPE_POINT, Light.TYPE_DIRECTIONAL, Light.TYPE_SPOT)
// -- position: vec3
function Initialize(lightType, position)
{
	this.type = lightType;
	vec3.set(this.position, position);// = vec3.copy(position);
	this.enabled = true;
}

// Function to initialize the light as Point
// -- position: vec3
function InitializePoint(position)
{
	Initialize(LIGHT_TYPE_POINT, position);
}

// Function to initialize the light as Directional
// -- position: vec3
// -- direction : vec3
function InitializeDirectional(position, direction)
{
	Initialize(LIGHT_TYPE_DIRECTIONAL, position);
	this.direction = direction;
}

// Function to initialize the light as
// -- position: vec3
// -- direction : vec3
// -- innerAngle: float
// -- outerAngle: float
function InitializeSpot(position, direction, innerAngle, outerAngle)
{
	Initialize(LIGHT_TYPE_SPOT, position);
	this.direction = direction;
	this.innerAngle = innerAngle;
	this.outerAngle = outerAngle;
}

// Function to set the light properties
// -- ambient: float
// -- diffuse: float
// -- specular: float
function SetLightProperties(ambient, diffuse, specular)
{
	this.kAmbient = ambient;
	this.kDiffuse = diffuse;
	this.kSpecular = specular;
}

// Function to set the degree of attenuation
// -- constant: float
// -- linear: float
// -- quadratic: float
function SetAttenuation(constant, linear, quadratic)
{
	this.kConstant = constant;
	this.kLinear = linear;
	this.kQuadratic = quadratic;
}
