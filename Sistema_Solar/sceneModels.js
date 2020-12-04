//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	// Transformation parameters

	// Displacement vector

	this.tx = 0.0;

	this.ty = 0.0;

	this.tz = 0.0;

	// Rotation angles

	this.rotAngleXX = 0.0;

	this.rotAngleYY = 0.0;

	this.rotAngleZZ = 0.0;

	// Scaling factors

	this.sx = 1.0;

	this.sy = 1.0;

	this.sz = 1.0;

	// Animation controls

	this.rotXXOn = false;

	this.rotYYOn = true;

	this.rotZZOn = false;

	this.rotXXSpeed = 1.0;

	this.rotYYSpeed = 1.0;

	this.rotZZSpeed = 1.0;

	this.rotXXDir = 1;

	this.rotYYDir = 1;

	this.rotZZDir = 1;

	// Material features

	this.kAmbi = [ 0.2, 0.2, 0.2 ];

	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;
}


	function simpleCubeModel( ) {

	var cube = new emptyModelFeatures();

	cube.vertices = [

		-1.000000, -1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
		-1.000000,  1.000000,  1.000000,
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
         1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000, -1.000000,
		 1.000000,  1.000000, -1.000000,
         1.000000, -1.000000,  1.000000,
         1.000000,  1.000000, -1.000000,
         1.000000,  1.000000,  1.000000,
        -1.000000, -1.000000, -1.000000,
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000,
        -1.000000, -1.000000, -1.000000,
         1.000000,  1.000000, -1.000000,
         1.000000, -1.000000, -1.000000,
        -1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000,  1.000000,  1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000,  1.000000,
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}

function sphereModel(subdivisionDepth) {

	var sphere = new simpleCubeModel();

	midPointRefinement( sphere.vertices, subdivisionDepth );

	moveToSphericalSurface( sphere.vertices )

	computeVertexNormals( sphere.vertices, sphere.normals );

	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

// Meter 5 para ficarem redondos
var recursion_depth = 1;

// Sistema solar
// Sol
sceneModels.push(new sphereModel(5));
sceneModels[0].sx = 0.12;
sceneModels[0].sy = 0.12;
sceneModels[0].sz = 0.12;
sceneModels[0].rotYYOn = false;

// Mercúrio
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[1].tx = 0.17;
sceneModels[1].ty = 0;
sceneModels[1].tz = 0;
sceneModels[1].sx = 0.027;
sceneModels[1].sy = 0.027;
sceneModels[1].sz = 0.027;
sceneModels[1].rotYYSpeed = 0.1;

// Vénus
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[2].tx = 0.25;
sceneModels[2].ty = 0;
sceneModels[2].tz = 0;
sceneModels[2].sx = 0.04;
sceneModels[2].sy = 0.04;
sceneModels[2].sz = 0.04;

// Terra
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[3].tx = 0.35;
sceneModels[3].ty = 0;
sceneModels[3].tz = 0;
sceneModels[3].sx = 0.045;
sceneModels[3].sy = 0.045;
sceneModels[3].sz = 0.045;
sceneModels[3].rotYYSpeed = 0.3;


// Marte
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[4].tx = 0.44;
sceneModels[4].ty = 0;
sceneModels[4].tz = 0;
sceneModels[4].sx = 0.031;
sceneModels[4].sy = 0.031;
sceneModels[4].sz = 0.031;

// Júpiter
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[5].tx = 0.57;
sceneModels[5].ty = 0;
sceneModels[5].tz = 0;
sceneModels[5].sx = 0.075;
sceneModels[5].sy = 0.075;
sceneModels[5].sz = 0.075;

// Saturno
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[6].tx = 0.74;
sceneModels[6].ty = 0;
sceneModels[6].tz = 0;
sceneModels[6].sx = 0.067;
sceneModels[6].sy = 0.067;
sceneModels[6].sz = 0.067;

// Urano
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[7].tx = 0.87;
sceneModels[7].ty = 0;
sceneModels[7].tz = 0;
sceneModels[7].sx = 0.04;
sceneModels[7].sy = 0.04;
sceneModels[7].sz = 0.04;

// Neptuno
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[8].tx = 0.96;
sceneModels[8].ty = 0;
sceneModels[8].tz = 0;
sceneModels[8].sx = 0.03;
sceneModels[8].sy = 0.03;
sceneModels[8].sz = 0.03;
