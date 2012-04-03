var MOA2012ANIMATION = function(divId, _w, _h){

var container;
var camera, scene, renderer, group, particle;
var mouseX = 0, mouseY = 0;

var WIDTH = _w;
var HEIGHT = _h;

var windowHalfX = WIDTH / 2;
var windowHalfY = HEIGHT / 2;

var DEGREE = Math.PI/180;
var RIGHTANGLE = Math.PI/2;
var THIRDWINDOW = Math.floor();

// set up the grid
var size = WIDTH*1.2;
var halfsize = size/2;
var count = 30;
var spacing = Math.floor(size/count);


this.init = function() {

  // container = document.createElement( 'div' );
  // document.body.appendChild( container );
  container = document.getElementById(divId);

  // camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 1, 3000 );
  // camera.position.z = 1000;
  camera = new THREE.OrthographicCamera(-WIDTH/2, WIDTH/2, HEIGHT/2, -HEIGHT/2, -3000, 3000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  scene.add( camera );

  var PI2 = Math.PI * 2;

  group = new THREE.Object3D();
  MOA2012ANIMATION.group = group;
  groupX = new THREE.Object3D();
  group.add( groupX );
  groupY = new THREE.Object3D();
  group.add( groupY );
  groupZ = new THREE.Object3D();
  group.add( groupZ );

  scene.add( group );

  var lettermaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 1, linewidth: 3, linecap: "butt" } );
  var gridmaterial = new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth: .5, linecap: "square" } );

  for (var x=0; x<count; x++) {
    for (var y=0; y<count; y++) {
      for (var z=0; z<count; z++) {
        if (Math.random()>.97) {

          var geometry = new THREE.Geometry();
          
          var rand = Math.random();
          if (rand<.333) {
            // X
            var vector = new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize );
            geometry.vertices.push( new THREE.Vertex( vector ) );
            var vector2 = new THREE.Vector3( x*spacing - halfsize + spacing, y*spacing - halfsize, z*spacing - halfsize );
            geometry.vertices.push( new THREE.Vertex( vector2 ) );
            var line = new THREE.Line( geometry, gridmaterial );
            groupX.add( line );
          } else if (rand>.667) {
            // Y
            var vector = new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize );
            geometry.vertices.push( new THREE.Vertex( vector ) );
            var vector2 = new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize + spacing, z*spacing - halfsize );
            geometry.vertices.push( new THREE.Vertex( vector2 ) );
            var line = new THREE.Line( geometry, gridmaterial );
            groupY.add( line );
          } else {
            // Z
            var vector = new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize );
            geometry.vertices.push( new THREE.Vertex( vector ) );
            var vector2 = new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize + spacing );
            geometry.vertices.push( new THREE.Vertex( vector2 ) );
            var line = new THREE.Line( geometry, gridmaterial );
            groupZ.add( line );
          }

        }
      }
    }
  }

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( WIDTH, HEIGHT );
  container.appendChild( renderer.domElement );

  container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  container.addEventListener( 'click', onDocumentMouseClick, false );
  container.addEventListener( 'touchstart', onDocumentTouchStart, false );
  container.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentMouseClick( event ) {
  gotoAngle = !gotoAngle;
}

function onDocumentTouchStart( event ) {

  if ( event.touches.length == 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function onDocumentTouchMove( event ) {

  if ( event.touches.length == 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

//

this.animate = function() {

  requestAnimationFrame( animate );
  render();

}


var gotoAngle = false;
var tween;
var tweenRotation;
var gotoAngleX, gotoAngleY, gotoAngleZ;

function render() {

  // Rotate group
  if (tweenRotation && gotoAngle) {
    TWEEN.update();
    group.rotation.x = tweenRotation.x;
    group.rotation.y = tweenRotation.y;
    group.rotation.z = tweenRotation.z;
  } else {
    group.rotation.x = mouseY/windowHalfY * RIGHTANGLE;
    group.rotation.y = mouseX/windowHalfX * RIGHTANGLE;
  }

  // Move photons
  groupX.children[Math.floor(Math.random()*groupX.children.length)].position.x -= spacing;
  groupX.children[Math.floor(Math.random()*groupX.children.length)].position.x += spacing;
  groupY.children[Math.floor(Math.random()*groupY.children.length)].position.y -= spacing;
  groupY.children[Math.floor(Math.random()*groupY.children.length)].position.y += spacing;
  groupZ.children[Math.floor(Math.random()*groupZ.children.length)].position.z -= spacing;
  groupZ.children[Math.floor(Math.random()*groupZ.children.length)].position.z += spacing;

  renderer.render( scene, camera );
}


MOA2012ANIMATION.gotoAngle = function(x, y, z) {
  gotoAngle = true;

  tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z };
  var target = { x: x, y: y, z: z };
  tween = new TWEEN.Tween(tweenRotation).to(target, 2000)
    .easing(TWEEN.Easing.Quadratic.EaseInOut)
    .start();
}

MOA2012ANIMATION.cameraLoop = function() {
  gotoAngle = true;

  tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z };

  var top = { x: 1.5708, y: 0, z: 0 }
  var right = { x: 0, y: -1.5708, z: 0 };

  tweenTop = new TWEEN.Tween(tweenRotation)
    .to(top, 2000)
    .delay(2000)
    .easing(TWEEN.Easing.Quadratic.EaseInOut)
    .start();

  var tweenRight = new TWEEN.Tween(tweenRotation)
    .to(right, 2000)
    .delay(2000)
    .easing(TWEEN.Easing.Quadratic.EaseInOut);

  // loop
  tweenTop.chain(tweenRight);
  tweenRight.chain(tweenTop); 
}

// Start
init();
animate();

};
