const video = document.getElementById('video');

//Faceapi.js Global vars
var minimumPorbility = 0.1;
var canvas, label, myDisplay, myFaceDetections, fittedDetections;

//Three.js Global vars
var renderer, scene, camera, particle, cubes, mesh, meshCube, tween, tween2;
var myScales = { sx: 1, sy: 1, sz: 1 };
var myScales2 = { sx: 1, sy: 1, sz: 1 };
var emotionsBG = {
	happy: 'linear-gradient(to right, #AAFFF0 0%, #97FFEC 100%)',
	sad: 'linear-gradient(to right, #026CB6 0%, #0165AB 100%)',
	surprised: 'linear-gradient(to right, #FFCF5B 0%, #FFCD53 100%)',
	angry: 'linear-gradient(to right, #F15252 0%, #F13D3D 100%)',
	neutral: 'linear-gradient(to right, #D4D4D4 0%, #D3D3D3 100%)',
	disgusted: 'linear-gradient(to right, #52542C 0%, #515427 100%)',
	fearful: 'linear-gradient(to right, #000000 0%, #000000 100%)'
};
var partArray = [];
var cubeArray = [];

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

//Run init and my animation on window laod
window.onload = function() {
	init();
	animate();
};

//The init for the creation my Three.js camera / shapes / Objects / lighting
function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.setClearColor(0x000000, 0.0);
	document.body.appendChild(renderer.domElement);

	//Window resize event checker
	window.addEventListener('resize', () => {
		width = window.innerWidth;
		height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	//Creating my scene and camera position / adding objects
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

	//Setting my materials and colours for my Objects (cubes and particals)
	var material = new THREE.MeshLambertMaterial({
		color: emotionColourMAT
	});
	var cubeMaterial = new THREE.MeshLambertMaterial({
		color: emotionColourCMAT,
		wireframe: true
	});

	//Random positions for particals
	for (var i = 0; i < 1000; i++) {
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
		mesh.position.multiplyScalar(120 + Math.random() * 0);
		mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		particle.add(mesh);
		partArray.push(particle); //Push objects to my array
	}
	//Random positions for cube wireframes
	for (var i = 0; i < 10; i++) {
		meshCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		meshCube.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
		meshCube.position.multiplyScalar(0.2 + Math.random() * 40);
		meshCube.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		cubes.add(meshCube);
		cubeArray.push(cubes); // Push to array
	}

	//Adding my lighting
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

	//Controls for moving three.js render with mouse left and right click
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
}
//Creating a function to 'tween' my particals to scale smoothly between sizes
function partTween(a, b, c) {
	tween = new TWEEN.Tween(myScales)
		.to({ sx: a, sy: b, sz: c }, 500)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(function() {
			//Apply tween'ed scale for each object (partical) in my array
			partArray.forEach((c) => {
				c.scale.set(myScales.sx, myScales.sy, myScales.sy);
			});
		})
		.start();
}

//Creating a function to 'tween' my cubes
function cubeTween(e, f, g) {
	tween2 = new TWEEN.Tween(myScales2)
		.to({ sx: e, sy: f, sz: g }, 500)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(function() {
			//Apply tween'ed scale for each object (cube) in my array
			cubeArray.forEach((e) => {
				e.scale.set(myScales2.sx, myScales2.sy, myScales2.sy);
			});
		})
		.start();
}

//Function to better organise the edits made to the scene from the detected face expressions
function organiseEmotion(partColour, cubeColour, bgEmotion, emoText, emoColour) {
	mesh.material.color = new THREE.Color(partColour);
	meshCube.material.color = new THREE.Color(cubeColour);
	document.body.style.backgroundImage = bgEmotion;
	document.getElementById('currentEmotion').textContent = emoText;
	document.getElementById('emotionText').style.color = emoColour;
	mesh.material.needsUpdate = true;
	meshCube.material.needsUpdate = true;
}

//Animate my Three.js webGL emotion capture animation
function animate() {
	requestAnimationFrame(animate);

	particle.rotation.x += 0.0;
	particle.rotation.y -= 0.002;
	cubes.rotation.x += 0.0;
	cubes.rotation.y -= 0.002;
	TWEEN.update(); // Animate / update every tween'ed change
	renderer.render(scene, camera);
}

//Collecting all the data models I need for my facial recognition section
Promise.all([
	faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
	faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

//Getting video stream
function startVideo() {
	navigator.getUserMedia({ video: {} }, (stream) => (video.srcObject = stream), (err) => console.error(err));
}

//Rendering and using video stream to reference and overlay the facial recognition landmarks and labels
video.addEventListener('play', () => {
	canvas = faceapi.createCanvasFromMedia(video);
	document.getElementById('canv').append(canvas);
	myDisplay = { width: video.width, height: video.height };
	faceapi.matchDimensions(canvas, myDisplay);
	//Run every 100m detection from video strem using faceapi.js / models
	setInterval(async () => {
		// myFaceDetections holds the json data produced that query to find the most prominent emotion
		myFaceDetections = await faceapi
			.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceExpressions();
		//Use this data in drawing and displaying the face marks / emotion labels
		fittedDetections = faceapi.resizeResults(myFaceDetections, myDisplay);
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		faceapi.draw.drawFaceLandmarks(canvas, fittedDetections);
		faceapi.draw.drawFaceExpressions(canvas, fittedDetections, minimumPorbility);

		//Checking for detections
		if (myFaceDetections) {
			if (myFaceDetections.length > 0) {
				//If detections found --> check for each emotion value
				//The total value of the emotions will always = 1;
				//If the value of an emotion is >= 0.7, its the most prominent emotion being detected
				if (myFaceDetections[0].expressions.happy >= 0.7) {
					organiseEmotion(happyColourMAT, happyColourCMAT, emotionsBG.happy, 'HAPPY', 'black');
					partTween(1.2, 1.2, 1.2);
					cubeTween(1.1, 1.1, 1.1);
				} else if (myFaceDetections[0].expressions.sad >= 0.7) {
					organiseEmotion(sadColourMAT, sadColourCMAT, emotionsBG.sad, 'SAD', 'black');
					partTween(0.3, 0.3, 0.3);
					cubeTween(0.8, 0.8, 0.8);
				} else if (myFaceDetections[0].expressions.surprised >= 0.7) {
					organiseEmotion(supColourMAT, supColourCMAT, emotionsBG.surprised, 'SURPRISED', 'black');
					partTween(2, 2, 2);
					cubeTween(0.9, 0.9, 0.9);
				} else if (myFaceDetections[0].expressions.angry >= 0.7) {
					organiseEmotion(angryColourMAT, angryColourCMAT, emotionsBG.angry, 'ANGRY', 'black');
					partTween(0.7, 0.7, 0.7);
					cubeTween(1.5, 1.5, 1.5);
				} else if (myFaceDetections[0].expressions.neutral >= 0.7) {
					organiseEmotion(emotionColourMAT, emotionColourCMAT, emotionsBG.neutral, 'NEUTRAL', 'black');
					partTween(1, 1, 1);
					cubeTween(1, 1, 1);
				} else if (myFaceDetections[0].expressions.disgusted >= 0.7) {
					organiseEmotion(disColourMAT, disColourCMAT, emotionsBG.disgusted, 'DISGUSTED', 'black');
					partTween(0.8, 0.8, 0.8);
					cubeTween(0.3, 0.3, 0.3);
				} else if (myFaceDetections[0].expressions.fearful >= 0.6) {
					organiseEmotion(fearColourMAT, fearColourCMAT, emotionsBG.fearful, 'FEARFUL', 'white');
					partTween(0.2, 0.2, 0.2);
					cubeTween(1.1, 1.1, 1.1);
				}
			}
		}
	}, 100); // 100m intervals
});

function hideVideo() {
	var sidemenu = document.getElementById('menu');
	sidemenu.style.visibility = 'hidden';
}

function showVideo() {
	var sidemenu = document.getElementById('menu');
	sidemenu.style.visibility = 'visible';
}
