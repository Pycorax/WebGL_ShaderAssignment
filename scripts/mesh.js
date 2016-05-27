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
    
    // Normals
    this.normals = [];
    
    // Buffer IDs
    this.vertexBuffer = 0;
    this.indexBuffer = 0;
    this.colorBuffer = 0;
    this.normalBuffer = 0;
    
    // Transforms
    this.transform = mat4.create();
    
    // Function Definitions
    this.CreateCube = CreateCubeFunction();
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