import {gl, canvas} from "./canvas.js";
import * as msh from "./mesh.js";

export var sphMesh = msh.Icosahedron();
var mesh0 = new msh.Mesh();
msh.subDivideMesh(sphMesh,mesh0);
msh.subDivideMesh(mesh0,sphMesh);
msh.subDivideMesh(sphMesh,mesh0);
msh.subDivideMesh(mesh0,sphMesh);
/**/

export var sphVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphMesh.vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

export var sphIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphMesh.indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Vertex shader source code
export var sphVertCode = `
precision mediump float;

attribute vec3 coord;

uniform mat4 u_RMat;
uniform mat4 u_PMat;

varying vec3 v_normal;
varying vec3 v_color;
varying vec3 v_position;

void main() {
    v_normal = (u_RMat * vec4(coord, 0.0)).xyz;
    v_color = 0.5*coord +vec3(0.5);
    v_position = (u_RMat * vec4(coord, 1.0)).xyz;
    gl_Position = u_PMat * u_RMat * vec4(coord, 1.0);
}`
;

//Fragment shader source code
export var sphFragCode = `
precision mediump float;

varying vec3 v_normal;
varying vec3 v_color;
varying vec3 v_position;

void main() {
    vec3 light = normalize(vec3(1.0,-1.0,-1.0));

    float diffuse = clamp(dot(v_normal,-light),0.0,1.0);

    vec3 halfway = normalize(v_position+light);
    float specular = clamp(dot(-halfway,v_normal),0.0,1.0);

    gl_FragColor = vec4((0.3 + 0.5*diffuse + 0.2*pow(specular,5.0))*(1.0*v_color + 0.0*vec3(1.0,0.9,0.2)), 1.0);
}`
;

var ptVertices = [
    1,-0.02,-0.02,
    1,-0.02, 0.02,
    1, 0.02,-0.02,
    1, 0.02, 0.02,
];
export var ptIndices = [0,1,2,1,2,3];

export var ptVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, ptVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ptVertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

export var ptIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ptIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ptIndices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

/* Step3: Create and compile Shader programs */
export var ptVertCode = `
precision mediump float;

attribute vec3 coord;

uniform mat4 u_RMat;
uniform mat4 u_PMat;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
    v_normal = (u_RMat * vec4(coord, 0.0)).xyz;
    v_position = (u_RMat * vec4(coord, 1.0)).xyz;
    gl_Position = u_PMat * u_RMat * vec4(coord, 1.0);
}`
;

//Fragment shader source code
export var ptFragCode = `
precision mediump float;

varying vec3 v_normal;
varying vec3 v_position;

void main() {
    vec3 light = normalize(vec3(1.0,-1.0,-1.0));

    float diffuse = clamp(dot(v_normal,-light),0.0,1.0);

    vec3 halfway = normalize(v_position+light);
    float specular = clamp(dot(-halfway,v_normal),0.0,1.0);
    float Z = (v_position.z+1.0)/2.0;

    gl_FragColor = vec4((0.3 + 0.5*diffuse + 0.2*pow(specular,5.0))*vec3(0.02,0.04,0.1), 1.0);
}`
;