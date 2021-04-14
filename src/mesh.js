export class vec3{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    length(){
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    add(vec){
        this.x+=vec.x;
        this.y+=vec.y;
        this.z+=vec.z;
    }
    divide(scal){
        if(scal == 0){
            console.log("Divide by zero!");
            return;
        }
        this.x/=scal;
        this.y/=scal;
        this.z/=scal;
    }
}

export function normalize(vec){
    const len = vec.length();
    return new vec3(vec.x / len, vec.y / len, vec.z / len);
}

function normalizedmidpoint(vec0, vec1){
    const mid = new vec3(vec0.x+vec1.x, vec0.y+vec1.y, vec0.z+vec1.z);
    return normalize(mid);
}

export class Mesh{
    constructor(){
        this.vertices = [];
        this.indices = [];
    }
    addVertexVec(vec){
        this.vertices.push(vec.x);
        this.vertices.push(vec.y);
        this.vertices.push(vec.z);
    }
    addVertex(x,y,z){
        this.vertices.push(x);
        this.vertices.push(y);
        this.vertices.push(z);
    }
    getVertex(ind){
        return new vec3(this.vertices[3*ind], this.vertices[3*ind+1], this.vertices[3*ind+2]);
    }
    vertexCount(){
        return this.vertices.length/3;
    }
    addTriangle(i0,i1,i2){
        this.indices.push(i0);
        this.indices.push(i1);
        this.indices.push(i2);
    }
    triangleCount(){
        return this.indices.length/3;
    }
    clear(){
        this.vertices = [];
        this.indices = [];
    }
}

export function Icosahedron(){
    let mesh = new Mesh();
    let t = (1+Math.sqrt(5))/2;

    mesh.addVertexVec(normalize( new vec3(-1, t, 0) ));
    mesh.addVertexVec(normalize( new vec3( 1, t, 0) ));
    mesh.addVertexVec(normalize( new vec3(-1,-t, 0) ));
    mesh.addVertexVec(normalize( new vec3( 1,-t, 0) ));
    mesh.addVertexVec(normalize( new vec3( 0,-1, t) ));
    mesh.addVertexVec(normalize( new vec3( 0, 1, t) ));
    mesh.addVertexVec(normalize( new vec3( 0,-1,-t) ));
    mesh.addVertexVec(normalize( new vec3( 0, 1,-t) ));
    mesh.addVertexVec(normalize( new vec3( t, 0,-1) ));
    mesh.addVertexVec(normalize( new vec3( t, 0, 1) ));
    mesh.addVertexVec(normalize( new vec3(-t, 0,-1) ));
    mesh.addVertexVec(normalize( new vec3(-t, 0, 1) ));

	mesh.addTriangle(0, 11, 5);
	mesh.addTriangle(0, 5, 1);
	mesh.addTriangle(0, 1, 7);
	mesh.addTriangle(0, 7, 10);
	mesh.addTriangle(0, 10, 11);
	mesh.addTriangle(1, 5, 9);
	mesh.addTriangle(5, 11, 4);
	mesh.addTriangle(11, 10, 2);
	mesh.addTriangle(10, 7, 6);
	mesh.addTriangle(7, 1, 8);
	mesh.addTriangle(3, 9, 4);
	mesh.addTriangle(3, 4, 2);
	mesh.addTriangle(3, 2, 6);
	mesh.addTriangle(3, 6, 8);
	mesh.addTriangle(3, 8, 9);
	mesh.addTriangle(4, 9, 5);
	mesh.addTriangle(2, 4, 11);
	mesh.addTriangle(6, 2, 10);
	mesh.addTriangle(8, 6, 7);
	mesh.addTriangle(9, 8, 1);
    
    return mesh;
}

class Edge{
    constructor(i0,i1){
        this.i0 = i0<i1 ? i0 : i1;
        this.i1 = i0<i1 ? i1 : i0;
    }
    isLessThan(other){
        return (this.i0 < other.i0) || (this.i0 == other.i0 && this.i1 < other.i1);
    }
    isEqualTo(other){
        return this.i0 == other.i0 && this.i1 == other.i1;
    }
}

class mapEdgeIndex{
    constructor(){
        this.edges = [];
        this.indices = [];
    }
    addElement(edge,ind){
        this.edges.push(edge);
        this.indices.push(ind);
    }
    length(){
        return this.edges.length;
    }
    findIndexofEdge(iEdge){
        for(let i = 0; i < this.edges.length; i++){
            if(iEdge.isEqualTo(this.edges[i])){
                return this.indices[i];
            }
        }
        return -1;
    }
}

function subDivideEdge(i0,i1,iMesh,oMesh,divisions){
    const edge = new Edge(i0,i1);
    const index = divisions.findIndexofEdge(edge);
    if(index != -1)
    return index;

    const midp = normalizedmidpoint(iMesh.getVertex(edge.i0),iMesh.getVertex(edge.i1));
    const f = oMesh.vertexCount();
    oMesh.addVertexVec(midp);
    divisions.addElement(edge,f);
    return f;
}

export function subDivideMesh(iMesh,oMesh){
    oMesh.vertices = iMesh.vertices;
    oMesh.indices.length = 0;
    let map = new mapEdgeIndex();

    for(let i = 0; i < iMesh.triangleCount(); i++){
        const i0 = iMesh.indices[3*i + 0];
        const i1 = iMesh.indices[3*i + 1];
        const i2 = iMesh.indices[3*i + 2];

        const i3 = subDivideEdge(i0, i1, iMesh, oMesh, map);
        const i4 = subDivideEdge(i1, i2, iMesh, oMesh, map);
        const i5 = subDivideEdge(i2, i0, iMesh, oMesh, map);

        oMesh.addTriangle(i0,i3,i5);
        oMesh.addTriangle(i1,i3,i4);
        oMesh.addTriangle(i2,i4,i5);
        oMesh.addTriangle(i3,i4,i5);
    }
}