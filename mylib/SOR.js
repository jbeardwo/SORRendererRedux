function coord(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function mySORClass(name, baseLine, color) {
    this.name = name;
    this.baseLine = baseLine;
    this.shape = this.generateSOR();
    this.color = color;

    this.vertices = this.calcVertices();
    this.indices = this.calcIndices();

    this.faceNormals = this.calcFaceNormals();
    this.smoothNormals = this.calcSmoothNormals();
    this.showNormals = false;
}

mySORClass.prototype.generateSOR = function() {
    var x;
    var y;
    var z;
    var radians;
    var currentLine;
    var shape = []; //a completed shape is 36 lines, each are their own array

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
    var x;
    var y;
    var z;
    var vertices = []
    for(var i = 0; i < this.shape.length; i++) {
        for(var j = 0; j < this.shape[0].length; j++){
            x = this.shape[i][j].x
            y = this.shape[i][j].y
            z = this.shape[i][j].z
            vertices.push(new coord(x, y, z));
        }
    }
    return vertices;
}

mySORClass.prototype.calcIndices = function() {
    var indices = []
    var lineSize = this.shape[0].length
    for (var i = 0; i < this.shape.length - 1; i++) {
        for (var j = 0; j < lineSize - 1 ; j++) {
            indices.push(i*lineSize+j,i*lineSize+j+1,(i+1)*lineSize+j+1);
            indices.push(i*lineSize+j,(i+1)*lineSize+j+1,(i+1)*lineSize+j);
        }
    }
    return indices;
}

mySORClass.prototype.calcFaceNormals = function() {
    var faceNormals = [];
    for (var i = 0; i < this.shape.length - 1; i++) {
        for (var j = 0; j < this.shape[0].length - 1; j++) {
            var currentLine = this.shape[i]
            var nextLine = this.shape[i + 1]
            faceNormals.push(normalize(calculateNormal(currentLine[j], nextLine[j], currentLine[j + 1])))
        }
    }
    return faceNormals
}


mySORClass.prototype.calcSmoothNormals = function() {
    var smoothNormals = [];
    var currentNormal = [];
    var addedNormal = [];
    var baseSize = this.baseLine.length/3;
    //Vertex normal for smooth shading is calculating by adding Normals of all adjascent faces


    //This handles wraparound for the first set of vertices
    //This is the first vertex
    //bottom Right
    currentNormal = this.faceNormals[0];
    //bottom Left (wraparound)
    addedNormal = this.faceNormals[this.faceNormals.length-(baseSize-1)]
    currentNormal = normalize(addVectors(currentNormal,addedNormal));
    smoothNormals.push(currentNormal)
    //This is 2nd through 2nd to last vertex in the first set of vertices
    for(var i = 1;i<baseSize-1;i++){
        //top right
        currentNormal = this.faceNormals[i-1];
        //bottom right
        addedNormal = this.faceNormals[i];
        currentNormal = normalize(addVectors(currentNormal, addedNormal));
        //top left (wraparound)
        addedNormal = this.faceNormals[this.faceNormals.length-(baseSize-i)];
        currentNormal = normalize(addVectors(currentNormal, addedNormal));
        //bottom left (wraparound)
        addedNormal = this.faceNormals[this.faceNormals.length-(baseSize-i-1)];
        currentNormal = normalize(addVectors(currentNormal, addedNormal));
        smoothNormals.push(currentNormal);
    }
    //This is the last vertex from the first set
    //top Right
    currentNormal = this.faceNormals[baseSize-1];
    //top Left (wraparound)
    addedNormal = this.faceNormals[this.faceNormals.length-1];
    currentNormal = normalize(addVectors(currentNormal, addedNormal));
    smoothNormals.push(currentNormal);


    //The middle of the set:
    //top of each group
    for(var i = 1;i < this.shape.length - 1; i++){
        //bottom right
        currentNormal = this.faceNormals[baseSize*i-i];
        //bottom left
        addedNormal = this.faceNormals[baseSize*i-(baseSize+(i-1))];
        currentNormal = normalize(addVectors(currentNormal,addedNormal));
        smoothNormals.push(currentNormal);
        //middle of each group
        for(var j = 1; j < baseSize-1; j++){
            //top right
            currentNormal = this.faceNormals[baseSize*i-i + (j-1)];
            //bottom right
            addedNormal = this.faceNormals[baseSize*i-i+j];
            currentNormal = normalize(addVectors(currentNormal,addedNormal));
            //top left
            addedNormal = this.faceNormals[baseSize*i-(baseSize+(i-1)) + (j-1)];
            currentNormal = normalize(addVectors(currentNormal,addedNormal));
            //bottom left
            addedNormal = this.faceNormals[baseSize*i-(baseSize+(i-1)) + j];
            currentNormal = normalize(addVectors(currentNormal,addedNormal));
            smoothNormals.push(currentNormal);
        }
        //bottom of each group
        //top right
        currentNormal = this.faceNormals[baseSize*i-i + (baseSize-2)];
        //top left
        addedNormal = this.faceNormals[baseSize*i-(baseSize+(i-1)) + (baseSize-2)];
        currentNormal = normalize(addVectors(currentNormal,addedNormal));
        smoothNormals.push(currentNormal);
    }

    //Final vertices are duplicates of first ones, so wrapping around from the other side:
    //top of final group:
    //bottom right
    currentNormal = this.faceNormals[0];
    //bottom left
    addedNormal = this.faceNormals[this.faceNormals.length - 1 - (baseSize-2)];
    currentNormal = normalize(addVectors(currentNormal,addedNormal));
    smoothNormals.push(currentNormal);
    //middle of final group
    for(var i = 1; i < baseSize-1; i++){
        //top right
        currentNormal = this.faceNormals[i-1];
        //bottom right
        addedNormal = this.faceNormals[i];
        currentNormal = normalize(addVectors(currentNormal,addedNormal));
        //top left
        addedNormal = this.faceNormals[this.faceNormals.length - 1 - (baseSize-2) + (i-1)];
        currentNormal = normalize(addVectors(currentNormal,addedNormal));
        //bottom left
        addedNormal = this.faceNormals[this.faceNormals.length - 1 - (baseSize-2) + i];
        currentNormal = normalize(addVectors(currentNormal,addedNormal));
        smoothNormals.push(currentNormal);
    }
    //final vertex of final group
    //top right
    currentNormal = this.faceNormals[baseSize-2];
    //top left
    addedNormal = this.faceNormals[this.faceNormals.length-1];
    currentNormal = normalize(addVectors(currentNormal,addedNormal));
    smoothNormals.push(currentNormal);

    return smoothNormals;
}

mySORClass.prototype.drawNormals = function() {
    var normalLines = [];
    var x;
    var y;
    var z;

    for(var i = 0;i<this.smoothNormals.length;i++){
        normalLines.push(this.vertices[i].x);
        normalLines.push(this.vertices[i].y);
        normalLines.push(this.vertices[i].z);

        normalLines.push(this.vertices[i].x + 100 * this.smoothNormals[i][0]);
        normalLines.push(this.vertices[i].y + 100 * this.smoothNormals[i][1]);
        normalLines.push(this.vertices[i].z + 100 * this.smoothNormals[i][2]);
    }

    var normalCluster = new lineCluster(normalLines,[1.0,0.0,0.0,1.0]);
    normalCluster.draw();
}

mySORClass.prototype.draw = function() {
    var drawVerts = [];
    var tempVerts = [];
    var drawIndices = [];
    var drawNormals = [];
//convert vertices from coords into a normal array
    for(var i = 0;i<this.vertices.length;i++){
        tempVerts.push(this.vertices[i].x);
        tempVerts.push(this.vertices[i].y);
        tempVerts.push(this.vertices[i].z);
    }

    drawVerts = Float32Array.from(tempVerts);
    drawIndices = Uint16Array.from(this.indices);
    drawNormals = vector3ToFloat32(this.smoothNormals);

    //Initialize shaders
    program = createProgramFromScripts(gl, "objectShader-vs", "objectShader-fs")
    gl.useProgram(program);


    initArrayBuffer(gl, drawVerts, 3, gl.FLOAT, 'a_Position', program);
    initArrayBuffer(gl, drawNormals, 3, gl.FLOAT, 'a_Normal', program);

    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawIndices, gl.STATIC_DRAW)

    var u_Color = gl.getUniformLocation(program, 'u_Color')
    var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')

    gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.color[3])    

    gl.enable(gl.DEPTH_TEST)
    var mvpMatrix = new Matrix4()
    // mvpMatrix.setOrtho(-500, 500, -500, 500, -5000, 5000)
    mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10000);
    mvpMatrix.lookAt(0, 0, 3000, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    gl.drawElements(gl.TRIANGLES, drawIndices.length, gl.UNSIGNED_SHORT, 0)

    if(this.showNormals){this.drawNormals()}

}