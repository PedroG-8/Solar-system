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

	this.rotYYOn = false;

	this.rotZZOn = true;

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

	this.isOn = 1;

	this.position = [ -0.0, 0.0, 0.1, 0.0 ];

	this.intensity = [ 1.0, 0.4, 0.05 ];

	this.ambIntensity = [ 1.0, 0.4, 0.05 ];

	this.lightZZOn = false;

	this.l_rotationSpeed = 0.2;

	this.rotAngleZZ = 0.0;

	this.getRotAngleZZ = function() {

		return this.rotAngleZZ;
	}

	this.setRotAngleZZ = function( angle ) {

		this.rotAngleZZ = angle;
	}

}

	function simpleCubeModel( ) {

	var cube = new emptyModelFeatures();

	cube.vertices = [

		// FRONT FACE

		-0.25, -0.25,  0.25,

		 0.25, -0.25,  0.25,

		 0.25,  0.25,  0.25,


		 0.25,  0.25,  0.25,

		-0.25,  0.25,  0.25,

		-0.25, -0.25,  0.25,

		// TOP FACE

		-0.25,  0.25,  0.25,

		 0.25,  0.25,  0.25,

		 0.25,  0.25, -0.25,


		 0.25,  0.25, -0.25,

		-0.25,  0.25, -0.25,

		-0.25,  0.25,  0.25,

		// BOTTOM FACE

		-0.25, -0.25, -0.25,

		 0.25, -0.25, -0.25,

		 0.25, -0.25,  0.25,


		 0.25, -0.25,  0.25,

		-0.25, -0.25,  0.25,

		-0.25, -0.25, -0.25,

		// LEFT FACE

		-0.25,  0.25,  0.25,

		-0.25, -0.25, -0.25,

		-0.25, -0.25,  0.25,


		-0.25,  0.25,  0.25,

		-0.25,  0.25, -0.25,

		-0.25, -0.25, -0.25,

		// RIGHT FACE

		 0.25,  0.25, -0.25,

		 0.25, -0.25,  0.25,

		 0.25, -0.25, -0.25,


		 0.25,  0.25, -0.25,

		 0.25,  0.25,  0.25,

		 0.25, -0.25,  0.25,

		// BACK FACE

		-0.25,  0.25, -0.25,

		 0.25, -0.25, -0.25,

		-0.25, -0.25, -0.25,


		-0.25,  0.25, -0.25,

		 0.25,  0.25, -0.25,

		 0.25, -0.25, -0.25,
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

// Meter 4 para ficarem redondos
var recursion_depth = 2;

// Sistema solar
// Sol
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[0].sx = 0.12;
sceneModels[0].sy = 0.12;
sceneModels[0].sz = 0.12;
sceneModels[0].rotZZOn = -1;
sceneModels[0].kAmbi = [ 0.9, 0.4, 0.0 ];
sceneModels[0].kDiff = [ 0.9, 0.4, 0.0 ];
sceneModels[0].nPhong = 3;

// Mercúrio
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[1].tx = 0.17;
sceneModels[1].ty = 0;
sceneModels[1].tz = 0;
sceneModels[1].sx = 0.027;
sceneModels[1].sy = 0.027;
sceneModels[1].sz = 0.027;
sceneModels[1].rotZZSpeed = 2;
sceneModels[1].kAmbi = [ 0.5, 0.4, 0.0 ];
sceneModels[1].kDiff = [ 0.5, 0.4, 0.0 ];

// Vénus
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[2].tx = 0.25;
sceneModels[2].ty = 0;
sceneModels[2].tz = 0;
sceneModels[2].sx = 0.04;
sceneModels[2].sy = 0.04;
sceneModels[2].sz = 0.04;
sceneModels[2].rotZZDir = -1;
sceneModels[2].rotZZSpeed = 1.5;
sceneModels[2].kAmbi = [ 1, 0.3, 0.1 ];
sceneModels[2].kDiff = [ 1, 0.3, 0.1 ];
sceneModels[2].nPhong = 10;

// Terra
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[3].tx = 0.35;
sceneModels[3].ty = 0;
sceneModels[3].tz = 0;
sceneModels[3].sx = 0.045;
sceneModels[3].sy = 0.045;
sceneModels[3].sz = 0.045;
sceneModels[3].rotZZSpeed = 1.5*242;
sceneModels[3].kAmbi = [ 0.0, 0, 20 ];
sceneModels[3].kDiff = [ 0.0, 0, 20 ];
sceneModels[3].nPhong = 100;

// Marte
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[4].tx = 0.44;
sceneModels[4].ty = 0;
sceneModels[4].tz = 0;
sceneModels[4].sx = 0.031;
sceneModels[4].sy = 0.031;
sceneModels[4].sz = 0.031;
sceneModels[4].rotZZSpeed = 1.5*242;
sceneModels[4].kAmbi = [ 1, 0.3, 0.1 ];
sceneModels[4].kDiff = [ 1, 0.3, 0.1 ];
sceneModels[4].nPhong = 30;

// Júpiter
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[5].tx = 0.57;
sceneModels[5].ty = 0;
sceneModels[5].tz = 0;
sceneModels[5].sx = 0.07;
sceneModels[5].sy = 0.07;
sceneModels[5].sz = 0.07;
sceneModels[5].rotZZSpeed = 1.5*242*2.4;
sceneModels[5].kAmbi = [ 0.65, 0.74, 0.25 ];
sceneModels[5].kDiff = [ 0.65, 0.74, 0.25 ];
sceneModels[5].nPhong = 50;
sceneModels[5].lightZZOn = true;
sceneModels[5].position = [ -1.0, 0.0, 1.0, 0.0 ];
sceneModels[5].intensity = [ 1.0, 0.4, 0.05 ];
sceneModels[5].ambIntensity = [ 1.0, 0.4, 0.05 ];
sceneModels[5].l_rotationSpeed = 2.8;



// Saturno
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[6].tx = 0.74;
sceneModels[6].ty = 0;
sceneModels[6].tz = 0;
sceneModels[6].sx = 0.067;
sceneModels[6].sy = 0.067;
sceneModels[6].sz = 0.067;
sceneModels[6].rotZZSpeed = 1.5*242*2.4;
sceneModels[6].kAmbi = [ 5, 3, 15 ];
sceneModels[6].kDiff = [ 5, 3, 15 ];
sceneModels[6].nPhong = 50;

// Urano
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[7].tx = 0.87;
sceneModels[7].ty = 0;
sceneModels[7].tz = 0;
sceneModels[7].sx = 0.04;
sceneModels[7].sy = 0.04;
sceneModels[7].sz = 0.04;
sceneModels[7].rotZZSpeed = 1.5*242*1.4;
sceneModels[7].kAmbi = [ 0.0, 3, 15 ];
sceneModels[7].kDiff = [ 0.0, 3, 15 ];
sceneModels[7].nPhong = 50;

// Neptuno
sceneModels.push(new sphereModel(recursion_depth));
sceneModels[8].tx = 0.96;
sceneModels[8].ty = 0;
sceneModels[8].tz = 0;
sceneModels[8].sx = 0.03;
sceneModels[8].sy = 0.03;
sceneModels[8].sz = 0.03;
sceneModels[8].rotZZSpeed = 1.5*242*1.5;
sceneModels[8].kAmbi = [ 0.0, 0, 45 ];
sceneModels[8].kDiff = [ 0.0, 0, 45 ];
sceneModels[8].nPhong = 50;
