/*
* Constants
*/
const MAX_LIGHTS = 8;

/*
* Variable Declaration and Definitions
*/
var timeSinceStart = 0.0;           // The time since the simulations tarted
var lastTime = 0;                   // The previous frame's time
var deltaTime = 0.0;				// The time between the previous frame and current frame
var gl;                             // A global variable for the WebGL context
var drawList = [];                  // Stores the list of objects we are drawing
var lightList = [];                 // Stores the list of lights in the scene
var camera = new Camera();      	// Stores the camera details
var keysPressed = [];				// Stores a list of keys pressed
// MVP
var vMatrix = mat4.create();        // View Matrix
var pMatrix = mat4.create();        // Projection Matrix
var mMatrix = mat4.create();        // Model Matrix

/*
* Callback Code
*/
window.requestAnimFrame =
(
	function()
	{
		return window.requestAnimationFrame
		||
		window.webkitRequestAnimationFrame
		||
		window.mozRequestAnimationFrame
		||
		window.oRequestAnimationFrame
		||
		window.msRequestAnimationFrame
		||
		function(callback, element)
		{
			window.setTimeout(callback, 1000/60)
		};
	}
)();

/*
* Realtime Loop Code
*/
function Tick()
{
	requestAnimFrame(Tick);
	TimeUpdate();
	Animate();
	InputUpdate();
	Draw();
}

function TimeUpdate()
{
	// Get current time
	var timeNow = new Date().getTime();
	deltaTime = timeNow - lastTime;       // DeltaTime
	// Set the current time to lastTime for the next frame
	lastTime = timeNow;
	// Update the time since start
	timeSinceStart += deltaTime;
}

function Animate()
{
	mat4.identity(drawList[0].transform);
	mat4.rotateY(drawList[0].transform, timeSinceStart * 0.001);
}

function InputUpdate()
{
	// Process all the keys
	for (key in keysPressed)
	{
		if (keysPressed[key])
		{
			switch(key)
			{
				case 'w':
					camera.MoveForward(deltaTime);
					break;
				case 'a':
					camera.MoveLeft(deltaTime);
					break;
				case 's':
					camera.MoveBackward(deltaTime);
					break;
				case 'd':
					camera.MoveRight(deltaTime);
					break;
				case 'i':
					camera.LookUp(deltaTime);
					break;
				case 'j':
					camera.LookLeft(deltaTime);
					break;
				case 'k':
					camera.LookDown(deltaTime);
					break;
				case 'l':
					camera.LookRight(deltaTime);
					break;
			}
		}
	}
}

function Draw()
{
	// Set the background color
	gl.clearColor(0.13, 0.16, 0.20, 1.0);
	// Enable depth testing
	gl.enable(gl.DEPTH_TEST);
	// Set the size and position of the rendering context
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	// Clear the color as well as the depth buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Specify which shader to use
	gl.useProgram(shaderProgram);

	// Get the attributes references from shader
	// -- Position
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPos");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	// -- Texture
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vTex");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	// -- Normal
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vNorm");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	// Get the uniforms from the shader
	// -- MVP
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
	shaderProgram.mvInverseTransposeMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVInverseTransposeMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	// -- Camera
	shaderProgram.cameraView = gl.getUniformLocation(shaderProgram, "viewDirection");
	// -- Material
	shaderProgram.diffuseColor = gl.getUniformLocation(shaderProgram, "diffuseColor");
	shaderProgram.ambientColor = gl.getUniformLocation(shaderProgram, "ambientColor");
	shaderProgram.specularColor = gl.getUniformLocation(shaderProgram, "specularColor");
	shaderProgram.shininess = gl.getUniformLocation(shaderProgram, "shininess");


	// Lights
	// -- Loop through all the lights
	for (var currLight = 0; currLight < MAX_LIGHTS && currLight < lightList.length; ++currLight)
	{
		// -- Get Uniforms
		shaderProgram.lightPower = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].power");
		shaderProgram.lightType = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].type");
		shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].position");
		shaderProgram.lightDir = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].direction");
		shaderProgram.lightColor = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].color");
		shaderProgram.kAmbient = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kAmbient");
		shaderProgram.kDiffuse = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kDiffuse");
		shaderProgram.kSpecular = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kSpecular");
		shaderProgram.kConstant = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kConstant");
		shaderProgram.kLinear = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kLinear");
		shaderProgram.kQuadratic = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].kQuadratic");
		shaderProgram.spotInnerAngle = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].spotInnerAngle");
		shaderProgram.spotOuterAngle = gl.getUniformLocation(shaderProgram, "light[" + currLight + "].spotOuterAngle");
		// -- Define the values
		gl.uniform1f(shaderProgram.lightPower, lightList[currLight].power);
		gl.uniform1i(shaderProgram.lightType, lightList[currLight].type);
		gl.uniform3f(shaderProgram.lightPos, lightList[currLight].position[0], lightList[currLight].position[1], lightList[currLight].position[2]);
		gl.uniform3f(shaderProgram.lightDir, lightList[currLight].direction[0], lightList[currLight].direction[1], lightList[currLight].direction[2]);
		gl.uniform3f(shaderProgram.lightColor, lightList[currLight].color[0], lightList[currLight].color[1], lightList[currLight].color[2]);
		gl.uniform1f(shaderProgram.kAmbient, lightList[currLight].kAmbient);
		gl.uniform1f(shaderProgram.kDiffuse, lightList[currLight].kDiffuse);
		gl.uniform1f(shaderProgram.kSpecular, lightList[currLight].kSpecular);
		gl.uniform1f(shaderProgram.kConstant, lightList[currLight].kConstant);
		gl.uniform1f(shaderProgram.kLinear, lightList[currLight].kLinear);
		gl.uniform1f(shaderProgram.kQuadratic, lightList[currLight].kQuadratic);
		gl.uniform1f(shaderProgram.spotInnerAngle, lightList[currLight].spotInnerAngle);
		gl.uniform1f(shaderProgram.spotOuterAngle, lightList[currLight].spotOuterAngle);
	}

	// Defining Projection Matrix
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);

	// Defining the View Matrix
	mat4.identity(vMatrix);
	//mat4.translate(vMatrix, camera.position);      // Camera Position
	mat4.lookAt(camera.position, camera.target, camera.up, vMatrix);

	// Define the Camera View
	var cameraView = vec3.create();
	vec3.subtract(camera.position, camera.target, cameraView);
	vec3.normalize(cameraView);
	gl.uniform3f(shaderProgram.cameraView, cameraView[0], cameraView[1], cameraView[2]);

	// Drawing Objects
	for (var i = 0; i < drawList.length; ++i)
	{
		var mesh = drawList[i];

		// Bind and enable the vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		// Bind and enable the texCoords
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

		// Bind and enable the normals
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

		// Send index data into shader
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

		// Bind and enable the texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, mesh.tex);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		// Set the matrix uniforms for MVP
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
		gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mesh.transform);

		// Send the Inverse Transposed Model Matrix to calculate the correct Normals for Lights that don't follow the Model
		var mvInverseTransposeMtx = mat4.create();
		mvInverseTransposeMtx = mesh.transform;
		mat4.inverse(mvInverseTransposeMtx);
		mat4.transpose(mvInverseTransposeMtx);
		gl.uniformMatrix4fv(shaderProgram.mvInverseTransposeMatrixUniform, false, mvInverseTransposeMtx);

		// Set the lighting Material uniforms
		gl.uniform3f(shaderProgram.diffuseColor, mesh.material.diffuse[0], mesh.material.diffuse[1], mesh.material.diffuse[2]);
		gl.uniform3f(shaderProgram.ambientColor, mesh.material.ambient[0], mesh.material.ambient[1], mesh.material.ambient[2]);
		gl.uniform3f(shaderProgram.specularColor, mesh.material.specular[0], mesh.material.specular[1], mesh.material.specular[2]);
		gl.uniform1f(shaderProgram.shininess, mesh.material.shininess);

		// Draw the objects
		gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

		// Clean up
		gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
		gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	}
}

/*
 * GL Code
 */
function Setup()
{
	// Get a handle to the canvas element
	var canvas = document.getElementById("glCanvas");

	// Initialize the GL context
	if (!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl"))
	{
		return;
	}

	// Only continue if WebGL is available and working
	gl = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	// Load Shaders
	//shaderProgram = GetShaderProgram("BasicVertexShader", "BasicFragmentShader");
	shaderProgram = GetShaderProgram("VertexShader", "FragmentShader");

	// Initialize Lights
	SetupLights();

	// Load VBO, IBO, Color Buffers
	SetupBuffers();

	// Set the Camera Position
	camera.position = [0.0, 0.0, -5.0];
	camera.target = [0.0, 0.0, 1.0];
	camera.up = [0.0, 1.0, 0.0];

	// Render
	Tick();
}

function GetShader(shaderID)
{
	// Obtain the script element
	var script = document.getElementById(shaderID);

	// Check if this script element exists
	if (!script)
	{
		alert("Unable to find the " + shaderID + " script element.");

		return null;
	}

	// Extract shader code from HTML
	var code = "";
	var currChild = script.firstChild;
	while (currChild)
	{
		if (currChild.nodeType == currChild.TEXT_NODE)
		{
			code += currChild.textContent;
		}

		currChild = currChild.nextSibling;
	}

	// Variable to hold the shader
	var shader;

	// Check the type of shader and generate the shader
	if (script.type == "x-shader/x-fragment")
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if (script.type == "x-shader/x-vertex")
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else
	{
		alert("Unable to load a script of type " + script.type + ".");

		return null;
	}

	// Set the source for compiling the shader
	gl.shaderSource(shader, code);
	// Compile the shader
	gl.compileShader(shader);

	// Check to see if compilation was ok
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));

		return null;
	}

	return shader;
}

function GetShaderProgram(vert, frag)
{
	// Get the Shaders
	var vertexShader = GetShader(vert);
	var fragShader = GetShader(frag);

	// Create a GL program
	var program = gl.createProgram();

	// Attach the shaders to the GL program
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragShader);

	// Link the program
	gl.linkProgram(program);

	// Error Checking
	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		alert("Could not initialize shaders");
	}

	return program;
}

function SetupLights()
{
	// Populate the list with all the lights
	while (lightList.length < MAX_LIGHTS)
	{
		lightList.push(new Light());
	}

	// Set it's params
	lightList[0].power = 1.0;
	lightList[0].position = [-5, 0.5, -5];
	lightList[0].type = LIGHT_TYPE_POINT;
	lightList[0].direction = [0, 0, 1];
	// lightList[1].power = 1.0;
	// lightList[1].position = [5, 0.5, -1];
	// lightList[1].type = LIGHT_TYPE_POINT;
	// lightList[1].direction = [0, 0, 1];
	// lightList[1].power = 1.0;
	// lightList[1].position = [0, 10, 5];
	// lightList[1].direction = [0, 0, 1];
	// lightList[1].type = LIGHT_TYPE_DIRECTIONAL;
	// lightList[2].power = 1.0;
	// lightList[2].position = [0, 0, 0];
	// lightList[2].direction = [0, 0, -1];
	// lightList[2].type = LIGHT_TYPE_DIRECTIONAL;
	// lightList[3].power = 2.0;
	// lightList[3].position = [0, 0, 0];
	// lightList[3].direction = [0, 1, 1];
	// lightList[3].type = LIGHT_TYPE_DIRECTIONAL;
}

function SetupBuffers()
{
	// Floor
	var mesh = new Mesh();
	// -- Type
	mesh.CreateSphere(0.5, 0.5, 0.5, 120);
	// -- Init
	mesh.SetupBuffers(gl);
	mat4.identity(mesh.transform);
	//mat4.translate(mesh.transform, [0.0, -1.0, 0.0]);
	//mat4.scale(mesh.transform, [100.0, 0.01, 100.0]);
	//mat4.rotateX(mesh.transform, 90);
	// -- Texture & Materials
	SetupTexture("images/cubeTex.png", mesh); // mesh.material.diffuse = [1.0, 1.0, 1.0];
	// -- Add to the list
	drawList.push(mesh);

	// Objects
	for (var i = 0; i < 1; ++i)
	{
		var mesh2 = new Mesh();
		// -- Type
		mesh2.CreateCube();
		// -- Init
		mesh2.SetupBuffers(gl);
		mat4.identity(mesh2.transform);
		mat4.translate(mesh2.transform, [5.0, 0.0, 0.0]);
		// -- Texture & Materials
		SetupTexture("images/cubeTex.png", mesh2);
		// -- Add to the list
		drawList.push(mesh2);
	}
}

function SetupTexture(file, mesh)
{
	mesh.tex = gl.createTexture();
	mesh.tex.image = new Image();
	mesh.tex.crossOrigin = '';
	mesh.tex.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, mesh.tex);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mesh.tex.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	mesh.tex.image.src = file;
}

function InputKeyDown(event)
{
	keysPressed[event.key] = true;
}

function InputKeyUp(event)
{
	keysPressed[event.key] = false;
}
