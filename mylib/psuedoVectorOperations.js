function vector3ToFloat32(vectArray) {
    output = []
    for (var i = 0; i < vectArray.length; i++) {
        for (var k = 0; k < 3; k++) {
            output.push(vectArray[i][k])
        }
    }
    output = Float32Array.from(output)
    return output
}

function addVectors(vec0, vec1) {
    var output = []
    for (var i = 0; i < 3; i++) {
        output.push(vec0[i] + vec1[i])
    }
    return output
}

function normalize(vector) {
    output = []
    var magnitude = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2))
    for (var k = 0; k < 3; k++) {
        output.push(vector[k] / magnitude)
    }
    return output
}