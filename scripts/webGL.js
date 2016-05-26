/*
 * Class Definitions
 */
/****************************************/
/* Mesh Class                           */
/****************************************/
function Mesh()
{
    // VBO & IBO
    this.vertices = [];
    this.indices = [];
    
    // Color
    this.colors = [];
    
    // Buffer IDs
    this.vertexBuffer = 0;
    this.indexBuffer = 0;
    this.colorBuffer = 0;
    
    // Function Definitions
    this.CreateCube = MeshCreateCube;
}

//Mesh.prototype.CreateCube = function()
function MeshCreateCube()
{
    // Vertices
    this.vertices = 
    [
        // Front Face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        
        // Back Face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        
        // Top Face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        
        // Bottom Face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        
        // Right Face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        
        // Left Face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];
    
    /*
    // Define Temporary Colours
    var tempColors = 
    [
        [1.0, 0.72, 0.0, 1.0],       // Front Face: Orange
        [1.0, 0.0, 0.0, 1.0],       // Back Face: Red
        [0.0, 1.0, 0.0, 1.0],       // Top Face: Green
        [0.0, 0.0, 1.0, 1.0],       // Bottom Face: Blue
        [1.0, 1.0, 0.0, 1.0],       // Right Face: Yellow
        [1.0, 0.0, 1.0, 1.0],       // Left Face: Purple  
    ];
    
    // Set the colour for each side for each vertex
    for (var side = 0; side < 6; ++side)
    {
        var c = tempColors[side];
        
        // Repeat each color 4 times for the 4 vertices of each face
        for (var face = 0; face < 4; ++face)
        {
            this.colors = this.colors.concat(c);
        }
    }
    */
    
    
    this.colors =
    [
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        
        // Back
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        
        // Top
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        
        // Bottom
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        
        // Right
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0        
    ]

    // Define the indices
    this.indices = 
    [
        0, 1, 2,        0, 2, 3,        // Front
        4, 5, 6,        4, 6, 7,        // Back
        8, 9, 10,       8, 10, 11,      // Top
        12, 13, 14,     12, 14, 15,     // Bottom
        16, 17, 18,     16, 18, 19,     // Right
        20, 21, 22,     20, 22, 23      // Left
    ];
}

/*
 * Variable Declaration and Definitions
 */
var timeSinceStart = 0.0;           // The time since the simulations tarted
var lastTime = 0;                   // The previous frame's time
var gl;                             // A global variable for the WebGL context
var drawList = [];                  // Store the list of objects we are drawing
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
    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, timeSinceStart * 0.001, [-1.0, 1.0, -1.0]);
}

function Draw()
{
    // Set the background color
    gl.clearColor(0.137, 0.49, 0.45, 1.0);  
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
    
    // Get the uniforms from the shader
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");    
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    // Defining Projection Matrix
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);

    // Defining the View Matrix
    mat4.identity(vMatrix);
    mat4.translate(vMatrix, [0.0, 0.0, -5.0]);      // Camera Position
    
    // Define the Model matrix
    //mat4.identity(mMatrix);
    //mat4.rotate(mMatrix, 45, [0.0, 1.0, 0.0]);
    
    // Drawing Objects
    for (var i = 0; i < drawList.length; ++i)
    {
        var mesh = drawList[i];
        
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
    
        // Send index data into shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        
        // Set the matrix uniforms for MVP
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        
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
    
    // Load VBO, IBO, Color Buffers
    SetupBuffers();

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
    
    // Add a texture to it
    SetupTexture("scripts/cubeTex.png", mesh);
    
    // Add this mesh to the list of objects to draw
    drawList.push(mesh);
}

function SetupTexture(file, mesh)
{
    mesh.tex = gl.createTexture();
    mesh.tex.image = new Image();
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