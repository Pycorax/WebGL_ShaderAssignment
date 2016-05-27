/****************************************/
/* Light Class                           */
/****************************************/
function Light()
{
    // Basics
    this.type = Light.TYPE_POINT;
    this.position = vec3.create();
    this.direction = vec3.create();
    
    // Lighting Coefficients
    this.kAmbient = 0.5;
    this.kDiffuse = 0.5;
    this.kSpecular = 0.5;
    
    // Attenuation
    this.kConstant = 1.0;
    this.kLinear = 0.001;
    this.kQuadratic = 0.00002;
    
    // Spot Light Angles
    this.spotInnerAngle = 30.0;
    this.spotOuterAngle = 120.0;
}

Light.TYPE_POINT = 0;
Light.TYPE_DIRECTIONAL = 1;
Light.TYPE_SPOT = 2;