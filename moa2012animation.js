var MOA2012ANIMATION = MOA2012ANIMATION || function(divId, _w, _h, _count){

"use strict";

if (!divId) { return false; }
if (!_w) { _w=720; }
if (!_h) { _h=220; }
if (!_count) { _count=40; }

var container;
var camera, scene, renderer, group, groupGrid, particle;
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
var count = _count;
var spacing = Math.floor(size/count);

var lettermaterial1 = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0, linewidth: 3, linecap: "butt" } );
var lettermaterial2 = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0, linewidth: 3, linecap: "butt" } );

// All the phrases to spell
var texts;
var text_index = 0;
var top_text, right_text, text_is_on_top;


var init = function() {

  // container = document.createElement( 'div' );
  // document.body.appendChild( container );
  container = document.getElementById(divId);

  // camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 1, 3000 );
  // camera.position.z = 1000;
  var ORTHOZOOM = 2;
  camera = new THREE.OrthographicCamera(-WIDTH/ORTHOZOOM, WIDTH/ORTHOZOOM, HEIGHT/ORTHOZOOM, -HEIGHT/ORTHOZOOM, -3000, 3000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  scene.add( camera );

  var PI2 = Math.PI * 2;

  group = new THREE.Object3D();
  MOA2012ANIMATION.group = group;
  // groupX = new THREE.Object3D();
  // group.add( groupX );
  // groupY = new THREE.Object3D();
  // group.add( groupY );
  // groupZ = new THREE.Object3D();
  // group.add( groupZ );
  groupGrid = new THREE.Object3D();
  group.add( groupGrid );



  scene.add( group );

  var particleprogram = function (context){
    context.beginPath();
    context.arc( 0, 0, 1, 0, PI2, true );
    context.closePath();
    context.fill();
  };
  var particlematerial = new THREE.ParticleCanvasMaterial( { color: 0xFFFFFF, opacity: 0.4, program: particleprogram } );

  var borderwidth = 3;

  for (var x=0; x<count; x++) {
    for (var y=0; y<count; y++) {
      for (var z=0; z<count; z++) {
        if (Math.random()>0.995) {
          particle = new THREE.Particle( particlematerial );
          particle.position.x = x*spacing - halfsize;
          particle.position.y = y*spacing - halfsize;
          particle.position.z = z*spacing - halfsize;
          particle.scale.x = particle.scale.y = 2;
          groupGrid.add( particle );
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

var animate = function() {

  requestAnimationFrame( animate );
  render();

};


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
    lettermaterial1.opacity = tweenRotation.opacity1;
    lettermaterial2.opacity = tweenRotation.opacity2;
  } else {
    group.rotation.x = mouseY/windowHalfY * RIGHTANGLE;
    group.rotation.y = mouseX/windowHalfX * RIGHTANGLE;
  }

  // Move grid dots
  // groupX.children[Math.floor(Math.random()*groupX.children.length)].position.x -= spacing;
  // groupX.children[Math.floor(Math.random()*groupX.children.length)].position.x += spacing;
  // groupY.children[Math.floor(Math.random()*groupY.children.length)].position.y -= spacing;
  // groupY.children[Math.floor(Math.random()*groupY.children.length)].position.y += spacing;
  // groupZ.children[Math.floor(Math.random()*groupZ.children.length)].position.z -= spacing;
  // groupZ.children[Math.floor(Math.random()*groupZ.children.length)].position.z += spacing;

  renderer.render( scene, camera );
}


var gotoAngle = function(x, y, z) {
  gotoAngle = true;

  tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z };
  var target = { x: x, y: y, z: z };
  tween = new TWEEN.Tween(tweenRotation).to(target, 2000)
    .easing(TWEEN.Easing.Quadratic.EaseInOut)
    .start();
};

var cameraLoop = function() {
  gotoAngle = true;

  tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z, opacity1: 0, opacity2: 0 };

  var top = { x: 1.5708, y: 0, z: 0, opacity1: 0.8, opacity2: 0 }
  var right = { x: 0, y: -1.5708, z: 0, opacity1: 0, opacity2: 0.8 };

  var firstTop = new TWEEN.Tween(tweenRotation)
    .to(top, 2000)
    .delay(500)
    .onComplete(nextText)
    .easing(TWEEN.Easing.Quadratic.EaseInOut)
    .start();

  var tweenTop = new TWEEN.Tween(tweenRotation)
    .to(top, 2000)
    .delay(4000)
    .onComplete(nextText)
    .easing(TWEEN.Easing.Quadratic.EaseInOut);

  var tweenRight = new TWEEN.Tween(tweenRotation)
    .to(right, 2000)
    .delay(4000)
    .onComplete(nextText)
    .easing(TWEEN.Easing.Quadratic.EaseInOut);

  // first
  firstTop.chain(tweenRight); 
  // loop
  tweenRight.chain(tweenTop); 
  tweenTop.chain(tweenRight);
};


// Letters

var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ä','ö',' ','-','_'];
// This is the most hackerish-looking block of code I have ever produced.
// Font by Prashant Coakley
var charSegments = [
// 1 2 3 4 5 6 7 8 9 101112131415161718192021
  [1,1,1,1,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //a
  [1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //b
  [1,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0], //c
  [1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,0,0,1,0], //d
  [1,1,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0], //e
  [1,1,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0], //f 
  [1,1,0,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0], //g
  [0,0,1,1,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //h
  [1,1,0,0,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0], //i
  [0,0,0,0,1,1,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //j
  [0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,0,0,0], //k
  [0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0], //l
  [1,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0], //m
  [0,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,0,0,0,0,0], //n
  [1,1,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //o
  [1,1,1,1,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0], //p
  [1,1,0,0,1,1,1,0,1,1,0,1,0,0,0,1,0,0,0,0,0], //q
  [1,1,1,1,0,0,1,0,1,1,0,0,0,0,0,1,0,0,0,0,0], //r
  [1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0], //s
  [1,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0], //t
  [0,0,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //u
  [0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0], //v
  [0,0,0,0,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0], //w
  [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1,0,0], //x
  [0,0,1,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0], //y
  [1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0], //z
  [1,1,1,1,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1], //ä
  [1,1,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,1], //ö
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //' '
  [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //-
  [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //_
];

var geoAddPoint = function (geometry, x, y, z) {
  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize ) ) );
}

var drawsegment = function(i, x, y, _material) {
  var geometry = new THREE.Geometry();

  var randomZ = Math.floor(Math.random()*count);
  var randomZ2 = randomZ + (Math.random()>.5 ? -1 : 1);

  switch (i) {
    case 0:
      geoAddPoint(geometry, 0+x, 0+y, randomZ);
      geoAddPoint(geometry, 1+x, 0+y, randomZ2);
      break;
    case 1:
      geoAddPoint(geometry, 1+x, 0+y, randomZ);
      geoAddPoint(geometry, 2+x, 0+y, randomZ2);
      break;
    case 2:
      geoAddPoint(geometry, 0+x, 1+y, randomZ);
      geoAddPoint(geometry, 1+x, 1+y, randomZ2);
      break;
    case 3:
      geoAddPoint(geometry, 1+x, 1+y, randomZ);
      geoAddPoint(geometry, 2+x, 1+y, randomZ2);
      break;
    case 4:
      geoAddPoint(geometry, 0+x, 2+y, randomZ);
      geoAddPoint(geometry, 1+x, 2+y, randomZ2);
      break;
    case 5:
      geoAddPoint(geometry, 1+x, 2+y, randomZ);
      geoAddPoint(geometry, 2+x, 2+y, randomZ2);
      break;
    case 6:
      geoAddPoint(geometry, 0+x, 0+y, randomZ);
      geoAddPoint(geometry, 0+x, 1+y, randomZ2);
      break;
    case 7:
      geoAddPoint(geometry, 1+x, 0+y, randomZ);
      geoAddPoint(geometry, 1+x, 1+y, randomZ2);
      break;
    case 8:
      geoAddPoint(geometry, 2+x, 0+y, randomZ);
      geoAddPoint(geometry, 2+x, 1+y, randomZ2);
      break;
    case 9:
      geoAddPoint(geometry, 0+x, 1+y, randomZ);
      geoAddPoint(geometry, 0+x, 2+y, randomZ2);
      break;
    case 10:
      geoAddPoint(geometry, 1+x, 1+y, randomZ);
      geoAddPoint(geometry, 1+x, 2+y, randomZ2);
      break;
    case 11:
      geoAddPoint(geometry, 2+x, 1+y, randomZ);
      geoAddPoint(geometry, 2+x, 2+y, randomZ2);
      break;
    case 12:
      geoAddPoint(geometry, 0+x, 0+y, randomZ);
      geoAddPoint(geometry, 1+x, 1+y, randomZ2);
      break;
    case 13:
      geoAddPoint(geometry, 1+x, 0+y, randomZ);
      geoAddPoint(geometry, 2+x, 1+y, randomZ2);
      break;
    case 14:
      geoAddPoint(geometry, 0+x, 1+y, randomZ);
      geoAddPoint(geometry, 1+x, 2+y, randomZ2);
      break;
    case 15:
      geoAddPoint(geometry, 1+x, 1+y, randomZ);
      geoAddPoint(geometry, 2+x, 2+y, randomZ2);
      break;
    case 16:
      geoAddPoint(geometry, 1+x, 0+y, randomZ);
      geoAddPoint(geometry, 0+x, 1+y, randomZ2);
      break;
    case 17:
      geoAddPoint(geometry, 2+x, 0+y, randomZ);
      geoAddPoint(geometry, 1+x, 1+y, randomZ2);
      break;
    case 18:
      geoAddPoint(geometry, 1+x, 1+y, randomZ);
      geoAddPoint(geometry, 0+x, 2+y, randomZ2);
      break;
    case 19:
      geoAddPoint(geometry, 2+x, 1+y, randomZ);
      geoAddPoint(geometry, 1+x, 2+y, randomZ2);
      break;
    case 20: // dots
      geoAddPoint(geometry, 0+x, -0.5+y, randomZ);
      geoAddPoint(geometry, 2+x, -0.5+y, randomZ2);
      break;
    default:
      break;
  }

  var line = new THREE.Line( geometry, _material );

  return line;
}

var drawtext = function(text, _material) {
  var word = new THREE.Object3D();

  var characters = text.split("");
  var text_length = characters.length <= 33 ? characters.length : 33;
  for (var i = 0; i<text_length; i++) {
    var charIndex = chars.indexOf(characters[i]);
    if (charIndex !== -1) {
      var segments = charSegments[charIndex];

      for (var j=0; j<22; j++) {
        if (segments[j] === 1) {
          word.add( drawsegment(j, (i%11*3)+4, Math.floor(i/11)*3+17, _material) );
        }
      }

    }
  }

  word.rotation.y = Math.PI;
  word.rotation.z = Math.PI;
  return word;
}

var nextText = function() {
  text_index++;
  if (text_index >= texts.length) {
    text_index = 0;
  }
  text_is_on_top = !text_is_on_top;

  if (text_is_on_top){
    // top
    if (top_text){ group.remove(top_text); }

    top_text = drawtext(texts[text_index], lettermaterial1);
    top_text.rotation.x -= RIGHTANGLE;
    group.add(top_text);
  } else {
    //right
    if (right_text){ group.remove(right_text); }

    right_text = drawtext(texts[text_index], lettermaterial2);
    right_text.rotation.y += RIGHTANGLE;
    group.add(right_text);
  }

}

MOA2012ANIMATION.setTexts = function(_texts) {
  texts = _texts;
  text_index = 0;
  text_is_on_top = true;

  top_text = drawtext(texts[0], lettermaterial1);

  top_text.rotation.x -= RIGHTANGLE;
  group.add(top_text);

  cameraLoop();

}

// Start
init();
animate();

return MOA2012ANIMATION;

};
