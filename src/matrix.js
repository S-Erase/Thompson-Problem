export function identity(){
    return [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];
}

export function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan(angle*.5);//angle*.5
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
    ];
}

export function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9], mv13 = m[13]; 

    m[1] = c*m[1]-s*m[2];
    m[5] = c*m[5]-s*m[6];
    m[9] = c*m[9]-s*m[10];
    m[13] = c*m[13]-s*m[14];
    m[2] = c*m[2]+s*mv1;
    m[6] = c*m[6]+s*mv5;
    m[10] = c*m[10]+s*mv9;
    m[14] = c*m[14]+s*mv13;
 }
 export function rotateY(m, angle) {
     var c = Math.cos(angle);
     var s = Math.sin(angle);
     var mv0 = m[0], mv4 = m[4], mv8 = m[8], mv12 = m[12]; 
 
     m[0] = c*m[0]-s*m[2];
     m[4] = c*m[4]-s*m[6];
     m[8] = c*m[8]-s*m[10];
     m[12] = c*m[12]-s*m[14];
     m[2] = c*m[2]+s*mv0;
     m[6] = c*m[6]+s*mv4;
     m[10] = c*m[10]+s*mv8;
     m[14] = c*m[14]+s*mv12;
  }
  export function rotateZ(m, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv0 = m[0], mv4 = m[4], mv8 = m[8], mv12 = m[12]; 
  
      m[0] = c*m[0]-s*m[1];
      m[4] = c*m[4]-s*m[5];
      m[8] = c*m[8]-s*m[9];
      m[12] = c*m[12]-s*m[13];
      m[1] = c*m[1]+s*mv0;
      m[5] = c*m[5]+s*mv4;
      m[9] = c*m[9]+s*mv8;
      m[13] = c*m[13]+s*mv12;
   }

