/*
 * Constants
 */
const MAX_LIGHTS = 8;

/*
 * Variable Declaration and Definitions
 */
var timeSinceStart = 0.0;           // The time since the simulations tarted
var lastTime = 0;                   // The previous frame's time
var gl;                             // A global variable for the WebGL context
var drawList = [];                  // Stores the list of objects we are drawing
var lightList = [];                 // Stores the list of lights in the scene
var cameraPos = vec3.create();      // Stores the position of the camera
var cameraView = vec3.create();     // Stores the direction the camera is looking at
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
    Animate();
    Draw();
}

function Animate()
{
    // Get current time
    var timeNow = new Date().getTime();
    var elapsed = timeNow - lastTime;       // DeltaTime
    // Set the current time to lastTime for the next frame
    lastTime = timeNow;
    // Update the time since start
    timeSinceStart += elapsed;
    // Rotate the cube
    mat4.identity(drawList[0].transform);
    mat4.rotate(drawList[0].transform, timeSinceStart * 0.001, [-1.0, 1.0, -1.0]);
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
    // -- Color
    // shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    // gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
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
    for (var i = 0; i < MAX_LIGHTS && i < lightList.length; ++i)
    {
        // -- Get Uniforms
		shaderProgram.lightEnabled = gl.getUniformLocation(shaderProgram, "light[" + i + "].enabled");
        shaderProgram.lightType = gl.getUniformLocation(shaderProgram, "light[" + i + "].type");
        shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "light[" + i + "].position");
        shaderProgram.lightDir = gl.getUniformLocation(shaderProgram, "light[" + i + "].direction");
        shaderProgram.kAmbient = gl.getUniformLocation(shaderProgram, "light[" + i + "].kAmbient");
        shaderProgram.kDiffuse = gl.getUniformLocation(shaderProgram, "light[" + i + "].kDiffuse");
        shaderProgram.kSpecular = gl.getUniformLocation(shaderProgram, "light[" + i + "].kSpecular");
        shaderProgram.kConstant = gl.getUniformLocation(shaderProgram, "light[" + i + "].kConstant");
        shaderProgram.kLinear = gl.getUniformLocation(shaderProgram, "light[" + i + "].kLinear");
        shaderProgram.kQuadratic = gl.getUniformLocation(shaderProgram, "light[" + i + "].kQuadratic");
        shaderProgram.spotInnerAngle = gl.getUniformLocation(shaderProgram, "light[" + i + "].spotInnerAngle");
        shaderProgram.spotOuterAngle = gl.getUniformLocation(shaderProgram, "light[" + i + "].spotOuterAngle");
        // -- Define the values
		gl.uniform1i(shaderProgram.enabled, lightList[i].enabled);
        gl.uniform1i(shaderProgram.lightType, lightList[i].type);
        gl.uniform3f(shaderProgram.lightPos, lightList[i].position[0], lightList[i].position[1], lightList[i].position[2]);
        gl.uniform3f(shaderProgram.lightDir, lightList[i].direction[0], lightList[i].direction[1], lightList[i].direction[2]);
        gl.uniform1f(shaderProgram.kAmbient, lightList[i].kAmbient);
        gl.uniform1f(shaderProgram.kDiffuse, lightList[i].kDiffuse);
        gl.uniform1f(shaderProgram.kSpecular, lightList[i].kSpecular);
        gl.uniform1f(shaderProgram.kConstant, lightList[i].kConstant);
        gl.uniform1f(shaderProgram.kLinear, lightList[i].kLinear);
        gl.uniform1f(shaderProgram.kQuadratic, lightList[i].kQuadratic);
        gl.uniform1f(shaderProgram.spotInnerAngle, lightList[i].spotInnerAngle);
        gl.uniform1f(shaderProgram.spotOuterAngle, lightList[i].spotOuterAngle);
    }

    // Defining Projection Matrix
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);

    // Defining the View Matrix
    mat4.identity(vMatrix);
    mat4.translate(vMatrix, cameraPos);      // Camera Position

    // Define the Camera View
    gl.uniform3f(shaderProgram.cameraView, cameraView[0], cameraView[1], cameraView[2]);

    // Drawing Objects
    for (var i = 0; i < drawList.length; ++i)
    {
        var mesh = drawList[i];

        // Set the model transform matrix to be this object's transform
        mMatrix = mesh.transform

        // Send vertex data into shader
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // Send color data into shader
        // gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
        // gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

        // Send texCoord data into shader
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 2, gl.FLOAT, false, 0, 0);

        // Bind the texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mesh.tex);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        // Bind the normals
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

        // Send index data into shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

        // Set the matrix uniforms for MVP
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);

        // Set the lighting Material uniforms
        gl.uniform3f(shaderProgram.diffuseColor, mesh.material.diffuse[0], mesh.material.diffuse[1], mesh.material.diffuse[2]);
        gl.uniform3f(shaderProgram.ambientColor, mesh.material.ambient[0], mesh.material.ambient[1], mesh.material.ambient[2]);
        gl.uniform3f(shaderProgram.specularColor, mesh.material.specular[0], mesh.material.specular[1], mesh.material.specular[2]);
        gl.uniform1f(shaderProgram.shininess, mesh.material.shininess);

        // Draw the objects
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
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
    shaderProgram = GetShaderProgram("VertexShader", "FragmentShader");

    // Initialize Lights
    SetupLights();

    // Load VBO, IBO, Color Buffers
    SetupBuffers();

    // Set the Camera Position
    cameraPos = [0.0, 0.0, -5.0];
    cameraView = [0.0, 0.0, 1.0];

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
    lightList[0].position = [0, 10, -5];
	lightList[1].position = [0, 10, 5];
    lightList[2].position = [-5, 10, 0];
	lightList[3].position = [5, 10, 0];
    lightList[4].position = [0, -10, -5];
	lightList[5].position = [0, -10, 15];
    lightList[6].position = [0, -10, 0];
	lightList[7].position = [5, -10, 0];
}

function SetupBuffers()
{
    var mesh = new Mesh();
    mesh.CreateCube();

    // Create the Vertex Buffer and fill it up
    mesh.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

    // Create the Color Buffer and fill it up
    mesh.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);

    // Create the Index Buffer and fill it up
    mesh.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    // Create the Normal Buffer and fill it up
    mesh.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);

    // Add a texture to it
    SetupTexture("images/cubeTex.png", mesh);

    // Set the material
    mesh.material.diffuse = [1.0, 1.0, 1.0];

    // Add this mesh to the list of objects to draw
    drawList.push(mesh);
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
