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
    this.vertexBuffer = -1;
    this.indexBuffer = -1;
    this.colorBuffer = -1;
}

Mesh.prototype.CreateCube = function()
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
    
    var tempColors = 
    [
        [1.0, 0.68, 1.0, 1.0],       // Front Face: Orange
        [1.0, 0.0, 0.0, 1.0],       // Back Face: Red
        [0.0, 1.0, 0.0, 1.0],       // Top Face: Green
        [0.0, 0.0, 1.0, 1.0],       // Bottom Face: Blue
        [1.0, 1.0, 0.0, 1.0],       // Right Face: Yellow
        [1.0, 0.0, 1.0, 1.0],       // Left Face: Purple  
    ];
    
    for (var side = 0; side < 6; ++side)
    {
        var c = tempColors[side];
        
        // Repeat each color 4 times for the 4 vertices of each face
        for (var face = 0; face < 4; ++face)
        {
            this.colors = this.colors.concat(c);
        }
    }
    
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
var lastTime = 0;       // The previous frame's time
var gl;                 // A global variable for the WebGL context
var drawList = [];      // Store the list of objects we are drawing
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
}

function Draw()
{
    // Set the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Set the size and position of the rendering context
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Specify which shader to use
    gl.useProgram(shaderProgram);
    
    // Get the attributes for position and color from shader
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPos");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    
    // Get the uniforms from the shader
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");

    // Defining Projection Matrix
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);

    // Defining the View Matrix
    mat4.identity(vMatrix);
    mat4.translate(vMatrix, [0.0, 0.0, -5.0]);      // Camera Position
    
    // Define the Model matrix
    mat4.identity(mMatrix);
    
    // Drawing Objects
    for (var i = 0; i < drawList.length; ++i)
    {
        var mesh = drawList[i];
        
        // Send vertex data into shader
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        // Send color data into shader
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    
        // Send index data into shader
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        
        // Set the matrix uniforms for MVP
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.MMatrixUniform, false, mMatrix);
        
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
    //gl = getWebGLContext(canvas);
    
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
    
    mesh.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    
    mesh.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW); 
    
    mesh.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
    
    drawList.push(mesh);
}