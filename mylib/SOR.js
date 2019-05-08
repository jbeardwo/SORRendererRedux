function coord(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function mySORClass(name, baseLine, color) {
    this.name = name
    this.baseLine = baseLine
    this.shape = this.generateSOR()
    this.color = color

    this.vertices = this.calcVertices()
    this.indices = this.calcIndices()
}

mySORClass.prototype.generateSOR = function() {
    var x
    var y
    var z
    var radians
    var currentLine
    var shape = [] //a completed shape is 36 lines, each are their own array

    for (var angle = 0; angle <= 360; angle += 10) {
        radians = ((angle * Math.PI) / 180)
        currentLine = []
        for (var i = 0; i < this.baseLine.length; i=i+3) {
            this.baseLine[i]
            x = (Math.cos(radians) * this.baseLine[i]) - (Math.sin(radians) * this.baseLine[i+2]);
            y = this.baseLine[i+1];
            z = (Math.cos(radians) * this.baseLine[i+2]) + (Math.sin(radians) * this.baseLine[i]);
            currentLine.push(new coord(x, y, z));
        }
        shape.push(currentLine)
    }
    return shape;
}

mySORClass.prototype.calcVertices = function() {
    var vertices = []
    for(i = 0; i < this.shape.length; i++) {
        for(j = 0; j < this.shape[0].length; j++){
            vertices.push(this.shape[i][j].x)
            vertices.push(this.shape[i][j].y)
            vertices.push(this.shape[i][j].z)
        }
    }
    return vertices;
}

mySORClass.prototype.calcIndices = function() {
    var indices = []
    var lineSize = this.shape[0].length
    for (var i = 0; i < this.shape.length - 1; i++) {
        for (j = 0; j < lineSize - 1 ; j++) {
            indices.push(i*lineSize+j,i*lineSize+j+1,(i+1)*lineSize+j+1);
            indices.push(i*lineSize+j,(i+1)*lineSize+j+1,(i+1)*lineSize+j);
        }
    }
    return indices;
}



mySORClass.prototype.draw = function() {
    var drawVerts = []
    var drawIndices = []

    program = createProgramFromScripts(gl, "objectShader-vs", "objectShader-fs")
    gl.useProgram(program);

    // Initialize shaders

    drawVerts = Float32Array.from(this.vertices);
    drawIndices = Uint16Array.from(this.indices);

    initArrayBuffer(gl, drawVerts, 3, gl.FLOAT, 'a_Position', program)

    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawIndices, gl.STATIC_DRAW)

    var u_Color = gl.getUniformLocation(program, 'u_Color')
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')

    gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.color[3])    

    gl.enable(gl.DEPTH_TEST)
    var mvpMatrix = new Matrix4()
    mvpMatrix.setOrtho(-500, 500, -500, 500, -500, 500)

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    gl.drawElements(gl.TRIANGLES, drawIndices.length, gl.UNSIGNED_SHORT, 0)

}