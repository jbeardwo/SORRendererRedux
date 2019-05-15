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

function calculateNormal(pt0, pt1, pt2) {
    var cross0 = []
    var cross1 = []
    var crossProd = []

    cross0.push(pt1.x - pt0.x, pt1.y - pt0.y, pt1.z - pt0.z)
    cross1.push(pt2.x - pt0.x, pt2.y - pt0.y, pt2.z - pt0.z)

    crossProd = [cross0[1] * cross1[2] - cross0[2] * cross1[1], cross0[2] * cross1[0] - cross0[0] * cross1[2], cross0[0] * cross1[1] - cross0[1] * cross1[0]]
    var magnitude = Math.sqrt(Math.pow(crossProd[0], 2) + Math.pow(crossProd[1], 2) + Math.pow(crossProd[2], 2))
    for (var k = 0; k < 3; k++) {
        crossProd[k] = (crossProd[k] / magnitude)
    }
    return crossProd
}

function vector3ToCoord(vector){
    var coord = new coord(vector[0],vector[1],vector[2]);
    return coord;
}