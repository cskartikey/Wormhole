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
controls.dampingFactor = 0.03;


let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
  }
});

const points = track.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({color: 0x00ff00});
const line = new THREE.Line(geometry, material);  


const tubeGeo = new THREE.TubeGeometry(track, 222, 0.65, 16, true);
const tube = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
//const tube = new THREE.MeshStandardMaterial({color: 0x00ff00, wireframe: true, side: THREE.DoubleSide});
const tubeMesh = new THREE.Mesh(tubeGeo, tube);
scene.add(tubeMesh);
// scene.add(line)
// camera.position.set( 0, 20, 100 );
controls.update();

const numBoxes = 25;
const size = 0.2;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for (let i = 0; i < numBoxes; i += 1) {
  const boxMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  const p = (i / numBoxes + Math.random() * 0.1) % 1;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.z += Math.random() - 0.4;
  box.position.copy(pos);
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  box.rotation.set(rote.x, rote.y, rote.z);
  const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
  const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
  const lineMat = new THREE.LineBasicMaterial({ color });
  const boxLines = new THREE.LineSegments(edges, lineMat);
  boxLines.position.copy(pos);
  boxLines.rotation.set(rote.x, rote.y, rote.z);
  scene.add(boxLines);
}

const speed = 0.02;
let playerPos = 0;

function moveCamera() {
  if (moveLeft) camera.position.x -= speed;
  if (moveRight) camera.position.x += speed;

  playerPos = (playerPos + 1) % 1;

  const pos = tubeGeo.parameters.path.getPointAt(playerPos);
  const lookAt = tubeGeo.parameters.path.getPointAt((playerPos + 0.03) % 1);
  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(lookAt);
}

function updateCamera() {
	const time = Date.now() * 0.1;
	const looptime = 10 * 1000;
	const p = (time % looptime) / looptime;
	const pos = tubeGeo.parameters.path.getPointAt(p);
	const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
	camera.position.copy(pos);
	camera.lookAt(lookAt);
  }
  
function animate() {
	requestAnimationFrame(animate);
	updateCamera();
	// moveCamera();
	renderer.render(scene, camera);
	controls.update();
}
animate()