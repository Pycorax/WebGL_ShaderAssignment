/****************************************/
/* Mesh Class                           */
/****************************************/
function Mesh()
{
    // VBO & IBO
    this.vertices = [];
    this.indices = [];

    // Color
    this.texCoords = [];

    // Normals
    this.normals = [];

    // Buffer IDs
    this.vertexBuffer = 0;
    this.indexBuffer = 0;
    this.normalBuffer = 0;

    // Transforms
    this.transform = mat4.create();
	this.positionShift = vec3.create();			// Modify this for translation. We are doing this because MMatrix seems to be broken. Hacky solution but it works.

    // Material
    this.material = new Material();

	// Colour Swap
	this.colourSwapEnabled = false;
	this.colourSwapFrom = vec3.create();
	this.colourSwapTo = vec3.create();

    // Function Definitions
	// -- Setup
	this.SetupBuffers = SetupBuffersFunction;
	// -- Mesh Builders
	this.CreateQuad = CreateQuadFunction;
    this.CreateCube = CreateCubeFunction;
	this.CreateSphere = CreateSphereFunction;
	// -- Colour Swap
	this.SetColourSwap = SetColourSwapFunction;
}

function SetupBuffersFunction(gl)
{
	// Create the Vertex Buffer and fill it up
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	// Create the Color Buffer and fill it up
	this.texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

	// Create the Index Buffer and fill it up
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	// Create the Normal Buffer and fill it up
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
}

function CreateQuadFunction()
{
	// vertices
	this.vertices =
	[
		// Front and only Face
		-1.0, -1.0, 0.0,
		1.0, -1.0, 0.0,
		1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0
	];

	// colors
	this.colors =
	[
		[1.0, 1.0, 1.0, 1.0],
		[1.0, 1.0, 1.0, 1.0],
		[1.0, 1.0, 1.0, 1.0],
		[1.0, 1.0, 1.0, 1.0]
	];

	// TexCoords
	this.texCoords =
	[
		// Front
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];

	// Define the indices
	this.indices =
	[
		0, 1, 2,        0, 2, 3        // Front
	];

	// Define the Normals
	this.normals =
	[
		// Front
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];
}

function CreateCubeFunction(length)
{
        // Vertices
        this.vertices =
        [
            // Front Face
            -length, -length, length,
            length, -length, length,
            length, length, length,
            -length, length, length,

            // Back Face
            -length, -length, -length,
            -length, length, -length,
            length, length, -length,
            length, -length, -length,

            // Top Face
            -length, length, -length,
            -length, length, length,
            length, length, length,
            length, length, -length,

            // Bottom Face
            -length, -length, -length,
            length, -length, -length,
            length, -length, length,
            -length, -length, length,

            // Right Face
            length, -length, -length,
            length, length, -length,
            length, length, length,
            length, -length, length,

            // Left Face
            -length, -length, -length,
            -length, -length, length,
            -length, length, length,
            -length, length, -length,
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

        // TexCoords
        this.texCoords =
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

        // Define the Normals
        this.normals =
        [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];
    }

function CreateSphereFunction(radiusLength, radiusWidth, radiusHeight, numSlice)
{
	// Wrap around in the vertical
	for (var height = 0; height <= numSlice; height++)
	{
		// Angle and Trigo values we willl need to calculate position
		var theta = height * Math.PI / numSlice;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		// Wrap around in the horizontal
		for (var width = 0; width <= numSlice; width++)
		{
			// Angle and Trigo values we willl need to calculate position
			var phi = width * 2 * Math.PI / numSlice;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			// Calculate the normals and store it coz we will need it to calculate vertex position
			var xNormal = cosPhi * sinTheta;
			var yNormal = cosTheta;
			var zNormal = sinPhi * sinTheta;

			// Vertices
			this.vertices.push(radiusLength * xNormal);
			this.vertices.push(radiusWidth * yNormal);
			this.vertices.push(radiusHeight * zNormal);

			// Normals
			this.normals.push(xNormal);
			this.normals.push(yNormal);
			this.normals.push(zNormal);

			// Tex Coords
			this.texCoords.push(1 - (width / numSlice));
			this.texCoords.push(1 - (height / numSlice));
		}
	}

	// Wrap around in the vertical
	for (var height = 0; height < numSlice; height++)
	{
		// Wrap around in the horizontal
		for (var width = 0; width < numSlice; width++)
		{
			// Calculate the index at which is the first index (top left)
			var first = (height * (numSlice + 1)) + width;
			// Calculate the index at which is the second index (bottom left)
			var second = first + numSlice + 1;

			// Mark the first triangle
			this.indices.push(first);				// top left
			this.indices.push(second);				// bottom left
			this.indices.push(first + 1);			// top right

			// Mark the second triangle
			this.indices.push(second);				// bottom left
			this.indices.push(second + 1);			// bottom right
			this.indices.push(first + 1);			// top right
		}
	}
}

function SetColourSwapFunction(enabled, fromCol, toCol)
{
	if (enabled)
	{
		this.colourSwapFrom = fromCol;
		this.colourSwapTo = toCol;
	}

	this.colourSwapEnabled = enabled;
}
