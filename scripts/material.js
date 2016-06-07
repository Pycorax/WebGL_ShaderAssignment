/****************************************/
/* Material Class                           */
/****************************************/
function Material()
{
    this.diffuse = vec3.create();
	this.diffuse = [1.0, 1.0, 1.0];
	this.ambient = vec3.create();
	this.ambient = [0.0, 0.0, 0.0];
    this.specular = vec3.create();
	this.specular = [0.1, 0.1, 0.1];
    this.shininess = 200;
}
