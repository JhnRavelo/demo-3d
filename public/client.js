import * as THREE from 'three';

import { MTLLoader } from './jsm/loaders/MTLLoader.js';
import { OBJLoader } from './jsm/loaders/OBJLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
// import { RGBLoader } from './jsm/loaders/RGBLoader.js'

let camera, controls, scene, renderer,loader,model,hemiLight,spotLight,pointLight;

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
// loader = new OBJLoader()
// loader.load('bat/ProjectName.obj',(object)=>{
//     object.position.set(0,0,0)
//     object.scale.set(0.00013,0.00013,0.00013)
//     scene.add(object)
// })
new MTLLoader()
	.setPath( 'FICHIER OBJ/' )
	.load( 'BATIS.mtl', function ( materials ) {

		materials.preload();

		new OBJLoader()
			.setMaterials( materials )
			.setPath( 'FICHIER OBJ/' )
			.load( 'BATIS.obj', function ( object ) {
				model = object
				// model.traverse(child=>{
				// 	if(child.isMesh){
				// 		child.castShadow = true
				// 		child.receiveShadow = true
						
				// 	}
				// 	var material = child.material
				// 	// console.log(child.material);
				// 	if(material && material.map){
				// 		// console.log(child.material.color);
				// 		// console.log(child.material.map);
				// 		// console.log(child.material)
				// 		material.map.anisotropy = 16
				// 	}
				// })	
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
renderer.setClearColor(0xE86222)
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3.5
// renderer.shadowMap.enabled = true
//

controls = new  OrbitControls( camera, renderer.domElement );
controls.update()
scene.add(controls)

// -------control of the light---------

hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 6)
hemiLight.castShadow = true
scene.add(hemiLight)
spotLight = new THREE.SpotLight(0xffa95c,4)
spotLight.castShadow = true
// spotLight.shadow.bias = -20
// spotLight.shadow.mapSize.width = 1024*4
// spotLight.shadow.mapSize.height = 1024*4
scene.add(new THREE.SpotLightHelper(spotLight))
camera.add( spotLight.target );
spotLight.target.position.set( 0, 0, -2 )
pointLight = new THREE.PointLight(0xffa95c,4,30)
pointLight.position.set(0,0,0)
// pointLight.castShadow = true
// pointLight.shadow.bias = -0.001
// pointLight.shadow.mapSize.width = 1024*4
// pointLight.shadow.mapSize.height = 1024*4
scene.add(pointLight)
// scene.add(new THREE.PointLightHelper(pointLight))
// -------control of the light---------
//
scene.add(new THREE.AxesHelper(20))
window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {
spotLight.position.copy( camera.position )
// spotLight.position.set(
// 	camera.position.x + 10,
// 	camera.position.y + 10,
// 	camera.position.z + 10,
// )
requestAnimationFrame( animate );
renderer.render( scene, camera );

}