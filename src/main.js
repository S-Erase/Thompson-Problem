import * as geom from "./geometry.js";
import {gl, canvas} from "./canvas.js";
import createShaderProgram from "./shader.js";
import * as mtx from "./matrix.js";
import { vec3, dot } from "./mesh.js";

const SCREEN_SIZE = 720;
const zDisplacement = 4;

/* Step2: Define the geometry and store it in buffer objects */


var sphereShaderProgram = createShaderProgram(geom.sphVertCode, geom.sphFragCode);
gl.useProgram(sphereShaderProgram);
gl.bindBuffer(gl.ARRAY_BUFFER, geom.sphVertexBuffer);
var _sphereRmatrix = gl.getUniformLocation(sphereShaderProgram, "u_RMat");
var _spherePmatrix = gl.getUniformLocation(sphereShaderProgram, "u_PMat");

var sphereCoord = gl.getAttribLocation(sphereShaderProgram, "coord");

var pointShaderProgram = createShaderProgram(geom.ptVertCode, geom.ptFragCode);
gl.useProgram(pointShaderProgram);
gl.bindBuffer(gl.ARRAY_BUFFER, geom.ptVertexBuffer);
var _pointRmatrix = gl.getUniformLocation(pointShaderProgram, "u_RMat");
var _pointPmatrix = gl.getUniformLocation(pointShaderProgram, "u_PMat");

var pointCoord = gl.getAttribLocation(pointShaderProgram, "coord");

var Rmatrix = mtx.identity();
var Pmatrix = mtx.get_projection(Math.PI/8, 1, 0.1, 10);

//Get the attribute location



var angle = {lon:0, lat:0};
var mousedown = false;
function mouseDown(event){
    mousedown = true;
}
function mouseUp(event){
    mousedown = false;
}
function mouseMove(event){
    if(mousedown){
        angle.lon -= 1/100*(event.movementX);
        angle.lat += 1/100*(event.movementY);

        angle.lat = (angle.lat > Math.PI/2) ? Math.PI/2 : (angle.lat < -Math.PI/2) ? -Math.PI/2 : angle.lat;
    }
}
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousemove', mouseMove, false);

/*---Points----------------------------------------------------------*/
class Charge{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;

        this.v = new vec3(0,0,0);
    }
    resetVel(){
        this.v = new vec3(0,0,0);
    }
    move(){
        this.x+=this.v.x/1000;
        this.y+=this.v.y/1000;
        this.z+=this.v.z/1000;
    }
    normalize(){
        const length = Math.sqrt(this.x**2+this.y**2+this.z**2);
        this.x/=length;
        this.y/=length;
        this.z/=length;
    }
}

var running = false;
var points = [];

var siz = 100;
var goldenAngle = Math.PI*(1+Math.sqrt(5));
for(let i = 0; i < siz; i++){
    let t = (i+1/2)/siz;
    points.push(new Charge( Math.cos(goldenAngle*i)*2*Math.sqrt(t*(1-t)),
                                1-2*t,
                                Math.sin(goldenAngle*i)*2*Math.sqrt(t*(1-t)) ));
}

var minDist = {pt0:0, pt1:1};

const startBtn = document.getElementById("startBtn");
function startFnc(){
    running = true;
}
startBtn.onclick = startFnc;

const pauseBtn = document.getElementById("pauseBtn");
function pauseFnc(){
    running = false;
}
pauseBtn.onclick = pauseFnc;

const resetBtn = document.getElementById("resetBtn");
const vertexNoInput = document.getElementById("vertexNo");
function resetFnc(){
    running = false;
    points = [];

    siz = vertexNoInput.value;
    siz = siz < 0 ? 0 : siz > 150 ? 150 : siz;
    for(let i = 0; i < siz; i++){
        let t = (i+1/2)/siz;
        points.push(new Charge( Math.cos(goldenAngle*i)*2*Math.sqrt(t*(1-t)),
                                    1-2*t,
                                    Math.sin(goldenAngle*i)*2*Math.sqrt(t*(1-t)) ));
    }

    minDist = {pt0:0, pt1:1};
    console.log("Reset");
}
resetBtn.onclick = resetFnc;

const toggleSideBtn = document.getElementById("toggleSideBtn");
var sideView = true;
function toggleSideFnc(){
    sideView = !sideView;
    if(sideView)
    Pmatrix = mtx.get_projection(Math.PI/8, 1, 0.1, 10);
    else
    Pmatrix = mtx.get_projection(Math.PI/8, 1, 10, 0.1);
}
toggleSideBtn.onclick = toggleSideFnc;

const problemBtn = document.getElementById("problemBtn");
const problems = {thomson:0, tammes:1};
var problem = problems.thomson;
function problemFnc(){
    problem++;
    problem%=2;
    console.log(problem);
}
problemBtn.onclick = problemFnc;

/*--------------------------------------------------------------------------------------*/

function updateCharges(){
    switch(problem){
        case problems.thomson:
            for(let pt0 of points){
                let diff;
                for(let pt1 of points){
                    diff = new vec3(pt0.x-pt1.x, pt0.y-pt1.y, pt0.z-pt1.z);
                    diff.divide(diff.length()**3);
                    pt0.v.add(diff);
                }
            }

            for(let pt0 of points){
                pt0.move();
                pt0.normalize();
                pt0.resetVel();
            }
            break;
        case problems.tammes:
            for(let i = 0; i<100; i++){
                let pt0 = points[minDist.pt0];
                let pt1 = points[minDist.pt1];
                //console.log(pt0.x + "," + pt0.y + "," + pt0.z);
                //console.log(pt1.x + "," + pt1.y + "," + pt1.z);
                let diff = new vec3(pt0.x-pt1.x, pt0.y-pt1.y, pt0.z-pt1.z);
                //console.log(diff.x + "," + diff.y + "," + diff.z);
                diff.divide(diff.length());
                points[minDist.pt0].v.add(diff);
                points[minDist.pt1].v.sub(diff);

                points[minDist.pt0].move();
                points[minDist.pt1].move();
                points[minDist.pt0].normalize();
                points[minDist.pt1].normalize();
                points[minDist.pt0].resetVel();
                points[minDist.pt1].resetVel();

                let cosine = -2;
                let testCosine;
                for(let i = 0; i < siz; i++){
                    for(let j = i+1; j < siz; j++){
                        testCosine = dot(points[i],points[j]);
                        if(testCosine > cosine){
                            cosine = testCosine;
                            minDist.pt0 = i;
                            minDist.pt1 = j;
                        }
                    }
                }
            }
            //console.log(minDist.pt0 + "," + minDist.pt1);

            break;
    }
}

function setRotationMatrix(vec){
    Rmatrix = mtx.identity();
    mtx.rotateZ(Rmatrix, Math.atan(vec.y/Math.sqrt(vec.x**2+vec.z**2) ) );
    mtx.rotateY(Rmatrix, Math.atan2(-vec.z,vec.x) );
    mtx.rotateY(Rmatrix, angle.lon);
    mtx.rotateX(Rmatrix, angle.lat);
    Rmatrix[14]-=zDisplacement;
}
/*-------------------------------------------------------------------*/


var time_old = 0;
var animate = function(time) {
    var dt = time-time_old;

    Rmatrix = mtx.identity();
    mtx.rotateY(Rmatrix, angle.lon);
    mtx.rotateX(Rmatrix, angle.lat);
    Rmatrix[14]-=zDisplacement;

    time_old = time; 

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(gl.LEQUAL);

    //gl.colorMask(false, false, false, true);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(sphereShaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, geom.sphVertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.sphIndexBuffer);
    gl.uniformMatrix4fv(_sphereRmatrix, false, Rmatrix);
    gl.uniformMatrix4fv(_spherePmatrix, false, Pmatrix);
    gl.vertexAttribPointer(sphereCoord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(sphereCoord);
    gl.drawElements(gl.TRIANGLES, geom.sphMesh.indices.length, gl.UNSIGNED_SHORT, 0);
    
    gl.useProgram(pointShaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, geom.ptVertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geom.ptIndexBuffer);
    gl.uniformMatrix4fv(_pointPmatrix, false, Pmatrix);
    gl.vertexAttribPointer(pointCoord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pointCoord);
    for(let pt of points){
        setRotationMatrix(pt);

        gl.uniformMatrix4fv(_pointRmatrix, false, Rmatrix);
        gl.drawElements(gl.TRIANGLES, geom.ptIndices.length, gl.UNSIGNED_SHORT, 0);
    }


    if(running)
    updateCharges();

    window.requestAnimationFrame(animate);
 }
 animate(0);