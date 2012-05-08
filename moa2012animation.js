/*

Made by Forrest Oliphant http://forresto.com/
  for MoA - Masters of Aalto University http://moa.fi/
  with Three.js https://github.com/mrdoob/three.js/
  and Tween.js https://github.com/sole/tween.js

Design Copyright (c) 2012 MoA - Masters of Aalto University

Code Copyright (c) 2012 Forrest Oliphant
  JavaScript source available at https://github.com/forresto/moa2012

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var MOA2012ANIMATION = MOA2012ANIMATION || function(divId, settings){

"use strict";

if (!divId) { return false; }
if (!settings) { var settings = {}; }
if (!settings.hasOwnProperty("width")) { settings.width=720; }
if (!settings.hasOwnProperty("height")) { settings.height=220; }
if (!settings.hasOwnProperty("pausetime")) { settings.pausetime=2000; }
if (!settings.hasOwnProperty("transitiontime")) { settings.transitiontime=2000; }

var container;
var camera, scene, renderer, group, groupGrid, particle;
var mouseX = 0, mouseY = 0;

var WIDTH = settings.width;
var HEIGHT = settings.height;

var windowHalfX = WIDTH / 2;
var windowHalfY = HEIGHT / 2;

var DEGREE = Math.PI/180;
var RIGHTANGLE = Math.PI/2;
var THIRDWINDOW = Math.floor();

// set up the grid
var size = WIDTH*1.2;
var halfsize = size/2;
var count = 40;
var spacing = Math.floor(size/count);

var lettermaterial1 = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0, linewidth: 3, linecap: "butt" } );
var lettermaterial2 = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0, linewidth: 3, linecap: "butt" } );

// All the phrases to spell
var texts = [];
var text_index = 0;
var top_text, right_text;
var text_is_on_top = true;
var looping = false;


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
  group.position.y = 9;
  group.position.x = 11;
  group.position.z = 2;


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
  renderer.setClearColorHex ( 0x000000, 1 );
  container.appendChild( renderer.domElement );

  // container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // container.addEventListener( 'click', onDocumentMouseClick, false );
  // container.addEventListener( 'touchstart', onDocumentTouchStart, false );
  // container.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

/*
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
*/

var animate = function() {

  requestAnimationFrame( animate );
  render();

};


var gotoAngle = false;
var tween;
var tweenRotation;
var gotoAngleX, gotoAngleY, gotoAngleZ;

function render() {

  // Rotate group and fade
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
  var randomdot = groupGrid.children[Math.floor(Math.random()*groupGrid.children.length)];
  var move_rand = Math.random();
  if (move_rand<.333) {
    randomdot.position.x += (Math.random() > .5 ? spacing : -spacing);
  } else if (move_rand>=.667) {
    randomdot.position.y += (Math.random() > .5 ? spacing : -spacing);
  } else {
    randomdot.position.z += (Math.random() > .5 ? spacing : -spacing);
  }

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
  looping = true;

  tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z, opacity1: 0, opacity2: 0 };

  var top = { x: 1.5708, y: 0, z: 0, opacity1: 0.8, opacity2: 0 }
  var right = { x: 0, y: -1.5708, z: 0, opacity1: 0, opacity2: 0.8 };

  var tween_curve = TWEEN.Easing.Quintic.EaseInOut;
  var tween_time = settings.transitiontime;
  var tween_delay = settings.pausetime;

  var firstTop = new TWEEN.Tween(tweenRotation)
    .to(top, tween_time)
    .delay(500)
    .onComplete(nextText)
    .easing(tween_curve)
    .start();

  var tweenTop = new TWEEN.Tween(tweenRotation)
    .to(top, tween_time)
    .delay(tween_delay)
    .onComplete(nextText)
    .easing(tween_curve);

  var tweenRight = new TWEEN.Tween(tweenRotation)
    .to(right, tween_time)
    .delay(tween_delay)
    .onComplete(nextText)
    .easing(tween_curve);

  // first
  firstTop.chain(tweenRight); 
  // loop
  tweenRight.chain(tweenTop); 
  tweenTop.chain(tweenRight);
};


// Letters

var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ä','ö',' ','-','_','1','2','3','4','5','6','7','8','9','0'];
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
  [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //_
  [0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0], //1
  [1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0], //2
  [1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0], //3
  [0,0,1,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], //4
  [1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0], //5
  [1,1,1,1,1,1,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0], //6
  [1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0], //7
  [1,1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0], //8
  [1,1,1,1,1,1,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0], //9
  [1,1,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0,1,1,0,0], //0
];

var geoAddPoint = function (geometry, x, y, z) {
  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( x*spacing - halfsize, y*spacing - halfsize, z*spacing - halfsize ) ) );
}

var drawsegment = function(i, x, y, randomZ, _material) {
  var geometry = new THREE.Geometry();

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
      var x = i%11*3 + 4;
      var y = Math.floor(i/11)*3 + 17;
      var randomZ = Math.floor(count/4 + Math.random()*count/2);

      for (var j=0; j<22; j++) {
        if (segments[j] === 1) {
          word.add( drawsegment(j, x, y, randomZ, _material) );
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
    right_text.position.y = -2;
    right_text.position.z = -2;
    group.add(right_text);
  }

}

MOA2012ANIMATION.setTexts = function(_texts) {
  texts = _texts;
  text_index = 0;

  top_text = drawtext(texts[0], lettermaterial1);

  top_text.rotation.x -= RIGHTANGLE;
  group.add(top_text);

  if (!looping) {
    cameraLoop();
  }

}
MOA2012ANIMATION.addText = function(_text) {
  texts.push(_text);
  MOA2012ANIMATION.setTexts(texts);
}

// Start
init();
animate();

return MOA2012ANIMATION;

};
