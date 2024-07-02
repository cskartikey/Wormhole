import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import track from './track';

let scene, camera, renderer;
const w = window.innerWidth;
const h = window.innerHeight;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.3;

const points = track.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({color: 0x00ff00});
const line = new THREE.Line(geometry, material);  
scene.add(line)
camera.position.set( 0, 20, 100 );
controls.update();

function animate() {

	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );

}
animate()