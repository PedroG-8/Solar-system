//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24_GPU_per_vertex.js
//
//  Phong Illumination Model on the GPU - Per vertex shading - Several light sources
//
//  Reference: E. Angel examples
//
//  J. Madeira - November 2017 + November 2018
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;

var triangleVertexNormalBuffer = null;

var initSizes = [0.12, 0.027, 0.04, 0.045, 0.031, 0.07, 0.067, 0.04, 0.03];

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;
var globalAngleXX = 0.0;
var globalAngleZZ1 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];

var globalTz = 0.0;

var initVertices = [sceneModels[0].vertices.slice(), sceneModels[1].vertices.slice(), sceneModels[2].vertices.slice(),
sceneModels[3].vertices.slice(), sceneModels[4].vertices.slice(), sceneModels[5].vertices.slice(),
sceneModels[6].vertices.slice(), sceneModels[7].vertices.slice(), sceneModels[8].vertices.slice()];
var initNormals = [sceneModels[0].normals.slice(), sceneModels[1].normals.slice(), sceneModels[2].normals.slice(),
sceneModels[3].normals.slice(), sceneModels[4].normals.slice(), sceneModels[5].normals.slice(),
sceneModels[6].normals.slice(), sceneModels[7].normals.slice(), sceneModels[8].normals.slice()];


// for (var i = 0; i < sceneModels.length; i++) {
//   initVertices.push(sceneModels[i].vertices.slice());
//   initNormals.push(sceneModels[i].normals.slice());
// }

// GLOBAL Animation controls

var globalRotationYY_ON = 0;
var globalRotationYY_DIR = 1;
var globalRotationYY_SPEED = 1;

var globalRotationXX_ON = 0;
var globalRotationXX_DIR = 1;
var globalRotationXX_SPEED = 1;

var globalRotationZZ_ON = 1;
var globalRotationZZ_DIR = 1;
var globalRotationZZ_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;

// To allow choosing the projection type

var projectionType = 1;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;


function countFrames() {

   var now = new Date().getTime();

   frameCount++;

   elapsedTime += (now - lastfpsTime);

   lastfpsTime = now;

   if(elapsedTime >= 1000) {

       fps = frameCount;

       frameCount = 0;

       elapsedTime -= 1000;

	   document.getElementById('fps').innerHTML = 'fps:' + fps;
   }
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {

	// Vertex Coordinates

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
			triangleVertexPositionBuffer.itemSize,
			gl.FLOAT, false, 0, 0);

	// Vertex Normal Vectors

	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
			triangleVertexNormalBuffer.itemSize,
			gl.FLOAT, false, 0, 0);

  // Vertex Color Vectors

  // triangleVertexColorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.colors), gl.STATIC_DRAW);
  // triangleVertexColorBuffer.itemSize = 3;
	// triangleVertexColorBuffer.numItems = model.colors.length / 3;
  //
  // // Associating to the vertex shader
  //
  // gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
  //   	triangleVertexNormalBuffer.itemSize,
  //   	gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input

	// Concatenate with the particular model transformations

    // Pay attention to transformation order !!

	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );

	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );

	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );

	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );

	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Associating the data to the vertex shader

	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors

	initBuffers(model);

	// Material properties

	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"),
		flatten(model.kAmbi) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"),
		model.nPhong );

    // Light Sources

	var numLights = lightSources.length;
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"),
		numLights );

	//Light Sources

	// for(var i = 0; i < lightSources.length; i++ )
	// {
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].isOn"),
			model.isOn );

		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].position"),
			flatten(model.position) );

		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].intensities"),
			flatten(model.intensity) );
    // }

	// Drawing

	// primitiveType allows drawing as filled triangles / wireframe / vertices

	if( primitiveType == gl.LINE_LOOP ) {

		// To simulate wireframe drawing!

		// No faces are defined! There are no hidden lines!

		// Taking the vertices 3 by 3 and drawing a LINE_LOOP

		var i;

		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {

			gl.drawArrays( primitiveType, 3 * i, 3 );
		}
	}
	else {

		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);

	}
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

	var pMatrix;

	var mvMatrix = mat4();

	// Clearing the frame-buffer and the depth-buffer

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Computing the Projection Matrix

	if( projectionType == 0 ) {

		// For now, the default orthogonal view volume

		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );

		// Global transformation !!

		globalTz = 0.0;

		// NEW --- The viewer is on the ZZ axis at an indefinite distance

		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;

		pos_Viewer[2] = 1.0;

		// TO BE DONE !

		// Allow the user to control the size of the view volume
	}
	else {

		// A standard view volume.

		// Viewer is at (0,0,0)

		// Ensure that the model is "inside" the view volume

		pMatrix = perspective( 45, 1, 0.05, 15 );

		// Global transformation !!

		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)

		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;

		pos_Viewer[3] = 1.0;

		// TO BE DONE !

		// Allow the user to control the size of the view volume
	}

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Passing the viewer position to the vertex shader

	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE

	mvMatrix = translationMatrix( 0, 0, globalTz );

	// NEW - Updating the position of the light sources, if required

	// FOR EACH LIGHT SOURCE

	// for(var i = 0; i < lightSources.length; i++ )
	// {
	// 	// Animating the light source, if defined
  //
	// 	var lightSourceMatrix = mat4();
  //
	// 	if( !lightSources[i].isOff() ) {
  //     if( lightSources[i].isRotZZOn() )
	// 		{
	// 			lightSourceMatrix = mult(
	// 					lightSourceMatrix,
	// 					rotationZZMatrix( lightSources[i].getRotAngleZZ() ) );
	// 		}
	// 	}

		// NEW Passing the Light Source Matrix to apply

	// 	var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
  //
	// 	gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	// }

	// Instantianting all scene models

	for(var i = sceneModels.length-1; i >= 0; i-- )
	{
    var lightSourceMatrix = mat4();
    //if( sceneModels[i].lightZZOn )
    // {
       lightSourceMatrix = mult(
           lightSourceMatrix,
           rotationZZMatrix( sceneModels[i].getRotAngleZZ() ) );
    // }



    mvMatrix = mult( mvMatrix,
                   rotationZZMatrix( globalAngleZZ1[i] ) );

     var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(0) + "].lightSourceMatrix");
     gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));

		drawModel( sceneModels[i],
			   mvMatrix,
	           primitiveType );


  }



	// NEW - Counting the frames

	countFrames();
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;
var numb=[1,0,0,0,0,0,0,0,0]

function animate() {

	var timeNow = new Date().getTime();

	if( lastTime != 0 ) {

		var elapsed = timeNow - lastTime;

		// Global rotation

		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }
    if( globalRotationXX_ON ) {

			globalAngleXX += globalRotationXX_DIR * globalRotationXX_SPEED * (90 * elapsed) / 1000.0;
	    }
    if( globalRotationZZ_ON ) {
      original = globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 2000.0;
			globalAngleZZ1[0] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 100.0;
      globalAngleZZ1[1] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 1000.0;
      globalAngleZZ1[2] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 2545.0;
      globalAngleZZ1[3] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 4147.0;
      globalAngleZZ1[4] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 7806.0;
      globalAngleZZ1[5] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 49192.0;
      globalAngleZZ1[6] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 122192.0;
      globalAngleZZ1[7] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 155542.0;
      globalAngleZZ1[8] += globalRotationZZ_DIR * globalRotationZZ_SPEED * (90 * elapsed) / 83120.0;
	    }

		// For every model --- Local rotations

		for(var i = 0; i < sceneModels.length; i++ )
    {
			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}

      if( sceneModels[i].lightZZOn ) {

      	var angle = sceneModels[i].getRotAngleZZ() + sceneModels[i].l_rotationSpeed * (90 * elapsed * original ) / 1000.0;

        if(angle!=0){
          numb[i]=angle;
        }
      	sceneModels[i].setRotAngleZZ( angle );
      }
      else{
        sceneModels[i].setRotAngleZZ( numb[i] );

      }
		}

		// Rotating the light sources

		// for(var i = 0; i < lightSources.length; i++ )
	  //   {
    //     if( lightSources[i].isRotXXOn() ) {
    //
  	// 			var angle = lightSources[i].getRotAngleXX() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
    //
  	// 			lightSources[i].setRotAngleXX( angle );
  	// 		}
    //
  	// 		if( lightSources[i].isRotYYOn() ) {
    //
  	// 			var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
    //
  	// 			lightSources[i].setRotAngleYY( angle );
  	// 		}
		// }
}

	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {

	requestAnimFrame(tick);

  handleKeys();

	drawScene();

	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){

}

var currentlyPressedKeys = {};
function handleKeys() {

	if (currentlyPressedKeys[38]) {
		// Arrow Up

    for(var i = 0; i < sceneModels.length; i++) {
      sceneModels[i].sx *= 0.97;

      sceneModels[i].sz = sceneModels[i].sy = sceneModels[i].sx;
    }
	}
	if (currentlyPressedKeys[40]) {

		// Arrow Down

    for(var i = 0; i < sceneModels.length; i++) {
      sceneModels[i].sx *= 1.03;

      sceneModels[i].sz = sceneModels[i].sy = sceneModels[i].sx;
    }
	}
}

//----------------------------------------------------------------------------

function setEventListeners(){

    // Dropdown list

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

	document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

	var projection = document.getElementById("projection-selection");

	projection.addEventListener("click", function(){

		// Getting the selection

		var p = projection.selectedIndex;

		switch(p){

			case 0 : projectionType = 1;
				break;

			case 1 : projectionType = 0;
				break;
		}
	});

	// Dropdown list

	var list = document.getElementById("rendering-mode-selection");

	list.addEventListener("click", function(){

		// Getting the selection

		var mode = list.selectedIndex;

		switch(mode){

			case 0 : primitiveType = gl.TRIANGLES;
				break;

			case 1 : primitiveType = gl.LINE_LOOP;
				break;

			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});

	// Button events

  document.getElementById("soft").onclick = function(){
    for(var i = 0; i < sceneModels.length; i++) {
      sceneModels[i].vertices = initVertices[i].slice();
      sceneModels[i].normals = initNormals[i].slice();
      midPointRefinement(sceneModels[i].vertices, 2);
      moveToSphericalSurface(sceneModels[i].vertices);
      computeVertexNormals(sceneModels[i].vertices, sceneModels[i].normals );
    }
  };

  document.getElementById("sharp").onclick = function(){
    for(var i = 0; i < sceneModels.length; i++) {
      sceneModels[i].vertices = initVertices[i].slice();
      sceneModels[i].normals = initNormals[i].slice();
      midPointRefinement(sceneModels[i].vertices, 0);
      moveToSphericalSurface(sceneModels[i].vertices);
      computeVertexNormals(sceneModels[i].vertices, sceneModels[i].normals );
    }
  };

	document.getElementById("stop-translation").onclick = function(){

		// Stopping the translation

		// For every model
    if (globalRotationZZ_ON) {
      globalRotationZZ_ON = 0;
      for(var i = 1; i < sceneModels.length; i++ )
  	    {
  			sceneModels[i].lightZZOn = false;

  		}

    }
    else {
      globalRotationZZ_ON = 1;
      for(var i = 1; i < sceneModels.length; i++ )
  	    {
  			sceneModels[i].lightZZOn = true;

  		}
    }
    for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotZZOn = false;
			}
			else {
				sceneModels[i].rotZZOn = true;
			}
		}
	};

	document.getElementById("slower-translation").onclick = function(){

		// For every model
    globalRotationZZ_SPEED *= 0.8;
    for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 0.75;
      //sceneModels[i].l_rotationSpeed *=0.75;
		}
	};

	document.getElementById("faster-translation").onclick = function(){

		globalRotationZZ_SPEED *= 1.2;
    for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].rotZZSpeed *= 1.25;
      //sceneModels[i].l_rotationSpeed *=1.25;
		}
	};

  document.getElementById("reset").onclick = function(){

    for(var i = 0; i < sceneModels.length; i++ )
	    {
			sceneModels[i].sz = initSizes[i];
      sceneModels[i].sy = initSizes[i];
      sceneModels[i].sx = initSizes[i];
		}
	};
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {

		// Create the WebGL context

		// Some browsers still need "experimental-webgl"

		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas

		// DEFAULT: The viewport background color is WHITE

		// NEW - Drawing the triangles defining the model

		primitiveType = gl.TRIANGLES;

		// DEFAULT: Face culling is DISABLED

		// Enable FACE CULLING

		gl.enable( gl.CULL_FACE );

		// DEFAULT: The BACK FACE is culled!!

		// The next instruction is not needed...

		gl.cullFace( gl.BACK );

		// Enable DEPTH-TEST

		gl.enable( gl.DEPTH_TEST );

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}
}

//----------------------------------------------------------------------------

function runWebGL() {

	var canvas = document.getElementById("my-canvas");

	initWebGL( canvas );

	shaderProgram = initShaders( gl );

	setEventListeners();

	tick();		// A timer controls the rendering / animation

	outputInfos();
}