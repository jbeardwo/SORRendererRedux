// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

var drawMode = false;

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Disable the right click context menu
    canvas.addEventListener('contextmenu', function(e) {
        if (e.button == 2) {
            e.preventDefault();
            return false;
        }
    }, false)

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position);
    };

    // Register function to be called on mouse movement
    canvas.onmousemove = function(ev) {
        move(ev, gl, canvas, a_Position);
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_points = []; // The array for the position of a mouse press
var penDown = 1; // Keeps track of when lines should be drawn

function drawNewSOR(){
    drawMode = true;
    var new_points = [];
    penDown = 1;
}

function click(ev, gl, canvas, a_Position) {
    if(drawMode){
        var x = ev.clientX; // x coordinate of a mouse pointer at time of click
        var y = ev.clientY; // y coordinate of a mouse pointer at time of click
        var button = ev.button; // 0 if left click, 2 if right click
        var rect = ev.target.getBoundingClientRect();
        
        // Print the numerical representation of what button was pressed
        console.log(button);
        
        
        //This math converts the x,y positions s.t. -1<=#<=1
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        
        // Store the coordinates to g_points array
        g_points.push(x);
        g_points.push(y);
        
        // If right click
        if (button == 2) {
            console.log(g_points);
            penDown = 0;
            drawMode = false;
        }
    }

}

function move(ev, gl, canvas, a_Position) {
    if (drawMode && penDown) {
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect();
        //make an array with 2 more elements than g_points (explanation below)
        var vertices = new Float32Array(g_points.length + 2);
        for (var i = 0; i < g_points.length; i++) {
            vertices[i] = g_points[i];
        }

        //This math converts the x,y positions s.t. -1<=#<=1
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

        /*
        The elements up to g_points.length are the coordinates of points which have
        already been selected by clicking, in order to have the line rubberband to the
        current mouse position, we must use 2 more elements to hold the current mouse 
        position's coordinates
        */
        vertices[g_points.length] = x;
        vertices[g_points.length + 1] = y;

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write data into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the line
        gl.drawArrays(gl.LINE_STRIP, 0, (g_points.length + 2) / 2);
    }
}