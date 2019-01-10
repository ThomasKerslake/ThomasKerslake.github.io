var medQual;

class Visualization{
    constructor(options){
        //Changeable options
        this.particles = options.particles;
        this.ease = options.ease;
        //Particle storage
        this.particlesStored = [];
        this.particlesStored2 = [];
        this.particlesStored3 = [];
        //Stores new objs
        this.myObj = [];
        //The starting value of scences that need to be subtracted from length of scene.children.length
        //It is used to stop the value of the for loop in the render from overflowing
        //For every new addition to my scene the value increments by (1) --> this.segregation++
        this.segregation = 1;
    }

//Start of the Init
    init(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 5000 );
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setClearColor(0x000000, 0.0);
        this.camera.position.set(0, -95, 50);
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.autoClear = false;
        this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.index = 0;
        this.shape = ['ring', 'ring2', 'ring3'];
        this.octahedron = ['oct1','octc'];

        //Setting up the Orbit Controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

        // Render this to the body
        document.body.appendChild(this.renderer.domElement);

        this.render();
        this.addParticles();
        this.addParticles2();
        this.addParticles3();
        this.addAmbientLight();
        this.addPlane();
        this.addSpotLight();
        this.addCenterChildren();
        this.initAudio();

        //Add listeners
        window.addEventListener( 'resize', this.resize.bind(this));
        document.getElementById("file").addEventListener('change', this.onFileSelect.bind(this));

			//End of INIT -----------------------------------------------------------
    }

    initAudio(){
        //Init Audio
        this.audioObj = new Audio();
        this.audioObj.controls = true;
        document.body.appendChild(this.audioObj);

        //Init context/analyser
        this.audioContext = new AudioContext();
        this.source = this.audioContext.createMediaElementSource(this.audioObj);
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.bufferLength = this.analyser.frequencyBinCount;
        this.frequencyData = new Uint8Array(this.bufferLength);
    }

    analyseAudio(){
        requestAnimationFrame(this.analyseAudio.bind(this));
        this.analyser.getByteFrequencyData(this.frequencyData);
    }

    onFileSelect(z){
        //Links the selected audio (taget file -> posistion [0])
        this.audioObj.src = URL.createObjectURL(z.target.files[0]);
        this.audioObj.play();
        this.analyseAudio();
        //Removes 'text' on change
        document.getElementById("myLabel").outerHTML = "";
        document.getElementById("file").outerHTML = "";
    }

    render(){
        requestAnimationFrame(this.render.bind(this));
        for (let i=0; i<(this.scene.children.length)-this.segregation; i++) {
            //Choose Shape to render
            this[this.shape[0]](this.particlesStored[i],i, this.frequencyData[i]);
            this[this.shape[1]](this.particlesStored2[i],i, this.frequencyData[i]);
            this[this.shape[2]](this.particlesStored3[i],i, this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[0],this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[1],this.frequencyData[i]);//this.frequencyData[i]
            this[this.octahedron[1]](this.myObj[2],this.frequencyData[i]);
            this[this.octahedron[1]](this.myObj[3],this.frequencyData[i]);

        }
        this.renderer.render( this.scene, this.camera );
    }

    resize(){
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.camera.aspect = this.windowWidth / this.windowHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.windowWidth, this.windowHeight);
    }

    addAmbientLight(){
      let ambLight
      ambLight = new THREE.AmbientLight( 0xc4c4c4 );
      this.scene.add(ambLight);
    }

    addSpotLight(){
      var spotLight = new THREE.SpotLight( 0xc4c4c4 );
      spotLight.position.set( 0, 0, 150 );
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      spotLight.shadow.camera.near = 10;
      spotLight.shadow.camera.far = 1000;
      spotLight.shadow.camera.fov = 90;

      this.scene.add( spotLight );
      this.segregation++
     }


    addCenterChildren(){
      let myChildObj1, myChildObj2, myChildObj3, myChildObj4, myChildObj5;
      this.childObj = new THREE.OctahedronGeometry(7,0);
      this.childObjMat = new THREE.MeshLambertMaterial({
       color:0x4286f4,
      });
     myChildObj1 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj1.position.z = 20;
     myChildObj1.position.y = 30 + 30;
     myChildObj1.castShadow = true;
     this.scene.add(myChildObj1);
     this.myObj.push(myChildObj1);
     this.segregation++

     myChildObj2 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj2.position.z = 20;
     myChildObj2.position.x = -30 + - 30;
     myChildObj2.castShadow = true;
     this.scene.add(myChildObj2);
     this.myObj.push(myChildObj2);
     this.segregation++

     myChildObj3 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj3.position.z = 20;
     myChildObj3.position.x = 30 + 30;
     myChildObj3.castShadow = true;
     this.scene.add(myChildObj3);
     this.myObj.push(myChildObj3);
     this.segregation++

     myChildObj4 = new THREE.Mesh(this.childObj, this.childObjMat);
     myChildObj4.position.z = 20;
     myChildObj4.position.y = -30 - 30;
     myChildObj4.castShadow = true;
     this.scene.add(myChildObj4);
     this.myObj.push(myChildObj4);
     this.segregation++
    }

    addPlane(){
      let myPlane;
      this.planeGeo = new THREE.PlaneGeometry(300, 300, 32);
      this.planeMat = new THREE.MeshLambertMaterial( {color: 0xf4ae00 , side: THREE.FrontSide} );
      myPlane = new THREE.Mesh( this.planeGeo, this.planeMat );
      myPlane.receiveShadow = true;
      myPlane.position.z = -10;
      this.scene.add(myPlane);
      this.segregation++
    }

    addParticles(){
        let particle,i;
        for (i = 0; i < this.particles; i++) {
						this.box = new THREE.CylinderGeometry( 2, 2, 100, 32 );
						this.boxMat = new THREE.MeshLambertMaterial({
             color:0x4286f4
            });
           particle  = new THREE.Mesh(this.box, this.boxMat);
           particle.rotation.x = 1.6;
           particle.castShadow = true;
            this.scene.add(particle);
            this.particlesStored.push(particle);
        }
    }

    addParticles2(){
        let particle2,i;
        for (i = 0; i < this.particles; i++) {
						this.box2 = new THREE.CylinderGeometry( 2, 2, 100, 32 );
						this.boxMat2 = new THREE.MeshLambertMaterial({
             color:0x4286f4
            });
           particle2  = new THREE.Mesh(this.box2, this.boxMat2);
           particle2.rotation.x = 1.6;
           particle2.castShadow = true;
            this.scene.add(particle2);
            this.particlesStored2.push(particle2);
            this.segregation++;
        }
    }

    addParticles3(){
        let particle3,i;
        for (i = 0; i < this.particles; i++) {
						this.box3 = new THREE.CylinderGeometry( 2, 2, 100, 32 );
						this.boxMat3 = new THREE.MeshLambertMaterial({
             color:0x4286f4
            });
           particle3  = new THREE.Mesh(this.box3, this.boxMat3);
           particle3.rotation.x = 1.6;
           particle3.castShadow = true;
            this.scene.add(particle3);
            this.particlesStored3.push(particle3);
            this.segregation++;
        }
    }




    oct1(part){
      //part.scale.y = (Math.min(0.5));
      //part.scale.x = (Math.min(0.5));
      //part.scale.y += ((frequency * this.ease * 0.2) - part.scale.y) * this.ease;
      //part.scale.x += ((frequency * this.ease * 0.2) - part.scale.x) * this.ease;
      part.rotation.z += 0.00002;
    }

    octc(part, frequency){
      part.position.z += ((frequency * this.ease * 1) - part.position.z) * this.ease;
      part.rotation.z += ((frequency * this.ease * 0.3) - part.rotation.z)* this.ease;
      part.scale.z = 1;
      part.scale.x = 0.7;
      part.scale.y = 0.7;
      part.position.z = 5;
      //part.material.rotation -= 0.01;
    }

    // These are different shapes that can be used when creating the layout of the particals
    //Change value of this.shape

	ring(part, index, frequency){
    var q = (index + 400 + frequency * 0.5) * 0.05;
   part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
   part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
   part.position.z += (- 50 + (frequency * this.ease * 2) - part.position.z) * this.ease;
   //part.rotation.z -= 0.02;
    }

    ring2(part, index, frequency){
      var q = (index + 600 + frequency * 0.5) * 0.05;
     part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
     part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
     part.position.z += (- 50 + (frequency * this.ease * 1) - part.position.z) * this.ease;
     //part.rotation.z -= 0.02;
      }

      ring3(part, index, frequency){
        var q = (index + 800 + frequency * 0.5) * 0.05;
       part.position.x += ((Math.sin(index * 100) * q) - part.position.x) * this.ease;
       part.position.y += ((Math.cos(index * 100) * q) - part.position.y) * this.ease;
       part.position.z += (- 50 + (frequency * this.ease * 0.5) - part.position.z) * this.ease;
       //part.rotation.z -= 0.02;
        }
}

//On load run class

medQual = document.getElementById("Med");

medQual.addEventListener('click', function(){
  document.getElementById("overlay").style.display = "none";
  var animate = new Visualization({particles: 12, ease: 0.15});
  animate.init();
});
