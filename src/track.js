import * as THREE from 'three';

const numPoints = 50;
const radius = 20;
const yAmplitude = 3;

let x = [];
let y = [];
let z = [];

for (let i = 0; i < numPoints; i++) {
    let t = (i / (numPoints - 1)) * 2 * Math.PI;
    x.push(radius * Math.cos(t) * 1.2);
    y.push(yAmplitude * Math.sin(t * 5.2)); 
    z.push(radius * Math.sin(t) * 3);
}
// tack closes 
x[numPoints - 1] = x[0];
y[numPoints - 1] = y[0];
z[numPoints - 1] = z[0];

const points = [];
for (let i = 0; i < numPoints - 1; i++) {
    points.push(new THREE.Vector3(x[i], y[i], z[i]));
}
points.push(points[0]);
const track = new THREE.CatmullRomCurve3(points);

export default track;
