import * as THREE from 'three';

import { MTLLoader } from './jsm/loaders/MTLLoader.js';
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
// import { RGBLoader } from './jsm/loaders/RGBLoader.js'

let camera, controls, scene, renderer,loader,model,hemiLight,spotLight,pointLight,dirLight;

init();
animate();


function init() {

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
camera.position.z = 2.5;

// scene

scene = new THREE.Scene();

// const topLight = new THREE.DirectionalLight(0xffffff, 5); 
// topLight.position.set(500, 500, 500) 
// topLight.castShadow = true;
// scene.add(topLight);
// const ambientLight = new THREE.AmbientLight(0x333333, 2);
// scene.add(ambientLight);
scene.add( camera );

// model

// const onProgress = function ( xhr ) {

// if ( xhr.lengthComputable ) {

//     const percentComplete = xhr.loaded / xhr.total * 100;
//     console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

// }

// };
new MTLLoader()
	.setPath( 'FICHIER OBJ/' )
	.load( 'BATIS.mtl', function ( materials ) {

		materials.preload();

		new OBJLoader()
			.setMaterials( materials )
			.setPath( 'FICHIER OBJ/' )
			.load( 'BATIS.obj', function ( object ) {
				model = object
				model.traverse(child=>{
					if(child.isMesh){
						child.castShadow = true
						child.receiveShadow = true	
					}
					var material = child.material
					// console.log(child.material);
					if(material && material.map){
						material.map.anisotropy = 16
					}
				})	
				model.position.set(1.8,-0.2,0)
				model.scale.set(0.00005,0.00005,0.00005);
				scene.add( model );

			});

	} );

//

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.setClearColor(0xfffff5)
renderer.setClearColor(0xE86222)
renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 1.1
renderer.shadowMap.enabled = true
//

controls = new OrbitControls( camera, renderer.domElement );
controls.update()
scene.add(controls)

// -------control of the light---------

hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 3.5)
hemiLight.color.setHSL(0.6,1,0.6)
hemiLight.groundColor.setHSL(0.095,1,0.75)
hemiLight.position.set(0,20,0)

// hemiLight.castShadow = true
scene.add(hemiLight)
scene.add(new THREE.HemisphereLightHelper(hemiLight))

dirLight = new THREE.DirectionalLight(0xffffff,3)
dirLight.color.setHSL(0.1,1,0.95)
dirLight.position.set(-1,1.75,1)
dirLight.position.multiplyScalar(30)
scene.add(dirLight)
scene.add(new THREE.DirectionalLightHelper(dirLight))
scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
dirLight.castShadow = true
dirLight.shadow.mapSize.width = 2048
dirLight.shadow.mapSize.height = 2048

var distance = 20

dirLight.shadow.camera.left = -distance
dirLight.shadow.camera.right = distance
dirLight.shadow.camera.top = distance
dirLight.shadow.camera.bottom = -distance
dirLight.shadow.camera.far = distance
dirLight.shadow.bias = - 0.0001
// spotLight = new THREE.SpotLight(0xffa95c,4)
// spotLight.castShadow = true
// spotLight.shadow.bias = -20
// spotLight.shadow.mapSize.width = 1024*4
// spotLight.shadow.mapSize.height = 1024*4
// scene.add(new THREE.SpotLightHelper(spotLight))
// camera.add( spotLight.target );
// spotLight.target.position.set( 0, 0, -2 )
pointLight = new THREE.PointLight(0xffa95c,4,30)
pointLight.position.set(0,0,0)
// pointLight.castShadow = true
// pointLight.shadow.bias = -0.001
// pointLight.shadow.mapSize.width = 1024*4
// pointLight.shadow.mapSize.height = 1024*4
// scene.add(pointLight)
// scene.add(new THREE.PointLightHelper(pointLight))
// -------control of the light---------
//
// scene.add(new THREE.AxesHelper(20))
window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {
// spotLight.position.copy( camera.position )
// spotLight.position.set(
// 	camera.position.x + 10,
// 	camera.position.y + 10,
// 	camera.position.z + 10,
// )
requestAnimationFrame( animate );
renderer.render( scene, camera );

}
