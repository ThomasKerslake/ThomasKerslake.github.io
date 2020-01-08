var renderer, scene, camera, particle, cubes;

var emotionColourMAT = 0x1d1d1d;
var emotionColourCMAT = 0x1d1d1d;

var happyColourCMAT = 0xffffff;
var happyColourMAT = 0xfff600;

var angryColourCMAT = 0x000000;
var angryColourMAT = 0x440d0d;

var sadColourCMAT = 0x000000;
var sadColourMAT = 0x0d2333;

var supColourCMAT = 0x0083ff;
var supColourMAT = 0xff9700;

var fearColourCMAT = 0xffffff;
var fearColourMAT = 0xffffff;

var disColourCMAT = 0x000000;
var disColourMAT = 0x242605;

window.onload = function() {
	init();
	animate();
};

function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.setClearColor(0x000000, 0.0);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', () => {
		width = window.innerWidth;
		height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 330;
	scene.add(camera);

	particle = new THREE.Object3D();
	cubes = new THREE.Object3D();

	scene.add(particle);
	scene.add(cubes);

	var geometry = new THREE.TetrahedronGeometry(2, 4);
	var cubeGeometry = new THREE.BoxGeometry(200, 200, 200);

	var material = new THREE.MeshLambertMaterial({
		color: emotionColourMAT
	});

	var cubeMaterial = new THREE.MeshLambertMaterial({
		color: emotionColourCMAT,
		wireframe: true
	});

	abc = 40;
	for (var i = 0; i < 1000; i++) {
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
		mesh.position.multiplyScalar(120 + Math.random() * 0);
		mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		particle.add(mesh);
	}

	for (var i = 0; i < 10; i++) {
		var meshCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		meshCube.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
		meshCube.position.multiplyScalar(0.2 + Math.random() * 40);
		meshCube.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

		cubes.add(meshCube);
	}

	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	var lights = [];
	lights[0] = new THREE.DirectionalLight(0xffffff, 1);
	lights[0].position.set(1, 0, 0);
	lights[1] = new THREE.DirectionalLight(0xfefefe, 1);
	lights[1].position.set(0.75, 1, 0.5);
	lights[2] = new THREE.DirectionalLight(0xffffff, 1);
	lights[2].position.set(-0.75, -1, 0.5);
	scene.add(lights[0], lights[1], lights[2]);

	document.onkeydown = checkKey;

	function checkKey(e) {
		e = e || window.event;
		if (e.keyCode == '87') {
			mesh.material.color = new THREE.Color(happyColourMAT);
			meshCube.material.color = new THREE.Color(happyColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #AAFFF0 0%, #97FFEC 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		} else if (e.keyCode == '83') {
			mesh.material.color = new THREE.Color(angryColourMAT);
			meshCube.material.color = new THREE.Color(angryColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #F15252 0%, #F13D3D 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		} else if (e.keyCode == '65') {
			mesh.material.color = new THREE.Color(sadColourMAT);
			meshCube.material.color = new THREE.Color(sadColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #026CB6 0%, #0165AB 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		} else if (e.keyCode == '68') {
			mesh.material.color = new THREE.Color(supColourMAT);
			meshCube.material.color = new THREE.Color(supColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #FFCF5B 0%, #FFCD53 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		} else if (e.keyCode == '81') {
			mesh.material.color = new THREE.Color(fearColourMAT);
			meshCube.material.color = new THREE.Color(fearColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #000000 0%, #000000 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		} else if (e.keyCode == '69') {
			mesh.material.color = new THREE.Color(disColourMAT);
			meshCube.material.color = new THREE.Color(disColourCMAT);
			document.body.style.backgroundImage = 'linear-gradient(to right, #52542C 0%, #515427 100%)';
			mesh.material.needsUpdate = true;
			meshCube.material.needsUpdate = true;
		}
	}

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);

	particle.rotation.x += 0.0;
	particle.rotation.y -= 0.002;
	cubes.rotation.x += 0.0;
	cubes.rotation.y -= 0.002;

	renderer.render(scene, camera);
}
