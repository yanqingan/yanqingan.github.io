function init() {
	
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
	//camera.position.z = radius;
	alpha = alpha_begin;
	beta = beta_begin;
	radius = radius_begin;

	camera.position.x = radius * Math.sin( alpha ) * Math.cos( beta );
	camera.position.z = radius * Math.cos( alpha ) * Math.cos( beta );
	camera.position.y = radius * Math.sin( beta );

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );
	controls.addEventListener( 'start', function () {
		control_started = true;
		document.getElementById("info").style.display = "none";
	} );
	controls.maxDistance = radius_max;
	controls.minDistance = radius_min;
	controls.maxPolarAngle = Math.PI/2;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );

	//var directionalLight = new THREE.DirectionalLight( 0xffffff );
	//directionalLight.position.set( 0, 0, 1 );
	//scene.add( directionalLight );

	// texture

	/*
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );
		content_loaded++;

	};
	*/

	var texture = new THREE.Texture();

	var loader = new THREE.ImageLoader();
	loader.load( file_texture, function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = 16;
		
		content_loaded++;
		//console.log( content_loaded );
		render();

	} );

	// model

	var loader = new THREE.BinaryLoader();
	loader.load( file_js_model, function ( geometry ) {
		var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial() );
		mesh.material.map = texture;
		mesh.material.side = THREE.DoubleSide;
		scene.add( mesh );
		
		content_loaded++;
		//console.log( content_loaded );
		render();
	} );

	//

	renderer = new THREE.WebGLRenderer({antialias:true});
	//renderer = new THREE.SoftwareRenderer({antialias:true});
	//renderer = new THREE.CanvasRenderer({antialias:true});

	renderer.setClearColor( bg_color );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false; // To allow render overlay on top of sprited sphere

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );


	cameraOrtho = new THREE.OrthographicCamera( - windowHalfX, windowHalfX, windowHalfY, - windowHalfY, 1, 10 );
	cameraOrtho.position.z = 10;
	sceneOrtho = new THREE.Scene();

	controls.update();
	render();
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	cameraOrtho.left = -windowHalfX;
	cameraOrtho.right = windowHalfX;
	cameraOrtho.top = windowHalfY;
	cameraOrtho.bottom = -windowHalfY;
	cameraOrtho.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	render();

}

function animate() {
	
	if ( !control_started && intnow < interval ) {

		requestAnimationFrame( animate );
		
		if ( content_loaded == content_total ) {
			intnow++;
			
			alpha = alpha_begin + ( alpha_end - alpha_begin ) * intnow / interval;
			beta = beta_begin + ( beta_end - beta_begin ) * intnow / interval;
			radius = radius_begin + ( radius_end - radius_begin ) * intnow / interval;
			
			camera.position.x = radius * Math.sin( alpha ) * Math.cos( beta );
			camera.position.z = radius * Math.cos( alpha ) * Math.cos( beta );
			camera.position.y = radius * Math.sin( beta );
			
			controls.update();

			render();
		}
		
	} else if ( !control_started ) {
		document.getElementById("info").style.display = "block";
	}

}

function render() {
	renderer.clear();
	renderer.render( scene, camera );
	//console.log( camera.position );
}
