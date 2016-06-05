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
    this.colorBuffer = 0;
    this.normalBuffer = 0;

    // Transforms
    this.transform = mat4.create();

    // Material
    this.material = new Material();

    // Function Definitions
	// -- Setup
	this.SetupBuffers = SetupBuffersFunction;
	// -- Mesh Builders
    this.CreateCube = CreateCubeFunction;
	this.CreateSphere = CreateSphereFunction;
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

function CreateCubeFunction()
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
		// Calculate the difference in angle from the center between slices
		var degreePerSlice = 360.0 / numSlice;

		// Define the Vertices and their Normals
		for (var phi = -90; phi < 90; phi += degreePerSlice)
		{
			for (var theta = 0; theta <= 360; theta += degreePerSlice)
			{
				// Conver to Radians
				var phiRad = ExtraMath.DegreeToRadians(phi);
				var thetaRad = ExtraMath.DegreeToRadians(theta);
				var phiIncreRad = ExtraMath.DegreeToRadians(phi + degreePerSlice);

				// Calculate the vertex and normals for the first line of vertices
				this.vertices.push(radiusLength * (Math.cos(phiRad) * Math.cos(thetaRad)));
				this.vertices.push(radiusHeight * Math.sin(phiRad));
				this.vertices.push(radiusWidth * (Math.cos(phiRad) * Math.sin(thetaRad)));

				this.normals.push(Math.cos(phiRad) * Math.cos(thetaRad));
				this.normals.push(Math.sin(phiRad));
				this.normals.push(Math.cos(phiRad) * Math.sin(thetaRad));

				// Calculate the vertex and normals for the second line of vertices
				this.vertices.push(radiusLength * (Math.cos(phiIncreRad) * Math.cos(thetaRad)));
				this.vertices.push(radiusHeight * Math.sin(phiIncreRad));
				this.vertices.push(radiusWidth * (Math.cos(phiIncreRad) * Math.sin(thetaRad)));

				this.normals.push(Math.cos(phiIncreRad) * Math.cos(thetaRad));
				this.normals.push(Math.sin(phiIncreRad));
				this.normals.push(Math.cos(phiIncreRad) * Math.sin(thetaRad));
			}
		}

		// Add all these vertices into the indices
		for (var i = 0; i < this.vertices.length; ++i)
		{
			this.indices.push(i);
			this.texCoords.push(0.2);
		}
	}
