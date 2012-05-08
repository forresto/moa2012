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

var MOA2012ANIMATION = MOA2012ANIMATION || function(divId, _w, _h, _count){

"use strict";

if (!divId) { return false; }
if (!_w) { _w=720; }
if (!_h) { _h=220; }
if (!_count) { _count=40; }

var container;
var camera, scene, renderer;
var group, groupEven, groupOdd;

var WIDTH = _w;
var HEIGHT = _h;

var windowHalfX = WIDTH / 2;
var windowHalfY = HEIGHT / 2;

var DEGREE = Math.PI/180;
var RIGHTANGLE = Math.PI/2;

// set up the grid
var size = WIDTH*1;
var halfsize = size/2;
var count = _count;
var spacing = Math.floor(size/count);
var PHOTONWIDTH = 5;

// All the phrases to spell
var texts = [];
var text_index = 0;
var top_text, right_text;
var text_is_on_top = true;
var looping = false;


// Materials
var materialRight = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonRight() ), 
  blending: THREE.AdditiveBlending
} );
var materialRightOdd = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonRight() ), 
  blending: THREE.AdditiveBlending
} );
function generatePhotonRight() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = spacing*2;
  canvas.height = PHOTONWIDTH;
  var context = canvas.getContext( '2d' );
  var gradient = context.createLinearGradient( spacing, 0, canvas.width, 0 );
  gradient.addColorStop( 0, 'rgba(255, 255, 255, 0.4)' );
  gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );
  context.fillStyle = gradient;
  context.fillRect( spacing, 0, canvas.width, canvas.height );
  return canvas;
}

var materialDown = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDown() ), 
  blending: THREE.AdditiveBlending
} );
var materialDownOdd = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDown() ), 
  blending: THREE.AdditiveBlending
} );
function generatePhotonDown() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = PHOTONWIDTH;
  canvas.height = spacing*2;
  var context = canvas.getContext( '2d' );
  var gradient = context.createLinearGradient( 0, spacing, 0, canvas.height );
  gradient.addColorStop( 0, 'rgba(255, 255, 255, 0.4)' );
  gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );
  context.fillStyle = gradient;
  context.fillRect( 0, spacing, canvas.width, canvas.height );
  return canvas;
}

var materialDownRight = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDownRight() ), 
  blending: THREE.AdditiveBlending
} );
var materialDownRightOdd = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDownRight() ), 
  blending: THREE.AdditiveBlending
} );
function generatePhotonDownRight() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = spacing*2;
  canvas.height = spacing*2;
  var context = canvas.getContext( '2d' );
  var gradient = context.createLinearGradient( spacing, spacing, canvas.width, canvas.height );
  gradient.addColorStop( 0, 'rgba(255, 255, 255, 0.4)' );
  gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );
  context.fillStyle = gradient;
  context.moveTo(spacing, spacing); 
  context.lineTo(spacing+PHOTONWIDTH*4/3, spacing+0); 
  context.lineTo(canvas.width, canvas.height-PHOTONWIDTH*4/3);
  context.lineTo(canvas.width, canvas.height);
  context.fill(); 
  return canvas;
}

var materialDownLeft = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDownLeft() ), 
  blending: THREE.AdditiveBlending
} );
var materialDownLeftOdd = new THREE.ParticleBasicMaterial( { 
  map: new THREE.Texture( generatePhotonDownLeft() ), 
  blending: THREE.AdditiveBlending
} );
function generatePhotonDownLeft() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = spacing*2;
  canvas.height = spacing*2;
  var context = canvas.getContext( '2d' );
  var gradient = context.createLinearGradient( spacing, spacing, 0, canvas.height );
  gradient.addColorStop( 0, 'rgba(255, 255, 255, 0.4)' );
  gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );
  context.fillStyle = gradient;
  context.moveTo(spacing, spacing); 
  context.lineTo(spacing-PHOTONWIDTH*4/3, spacing); 
  context.lineTo(0, canvas.height-PHOTONWIDTH*4/3);
  context.lineTo(0, canvas.height);
  context.fill(); 
  return canvas;
}


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
  MOA2012ANIMATION.scene = scene;

  scene.add( camera );

  var PI2 = Math.PI * 2;

  var master = new THREE.Object3D();
  master.rotation.x = Math.PI;
  scene.add( master );

  group = new THREE.Object3D();
  // groupGrid = new THREE.Object3D();
  // group.add( groupGrid );
  group.position.y = 2;
  group.position.x = 0;
  group.position.z = 2;
  master.add( group );

  groupEven = new THREE.Object3D();
  group.add( groupEven );

  groupOdd = new THREE.Object3D();
  group.add( groupOdd );

  // var particleprogram = function (context){
  //   context.beginPath();
  //   context.arc( 0, 0, 1, 0, PI2, true );
  //   context.closePath();
  //   context.fill();
  // };
  // var particlematerial = new THREE.ParticleCanvasMaterial( { color: 0xFFFFFF, opacity: 0.4, program: particleprogram } );

  // var borderwidth = 3;

  // for (var x=0; x<count; x++) {
  //   for (var y=0; y<count; y++) {
  //     for (var z=0; z<count; z++) {
  //       if (Math.random()>0.995) {
  //         particle = new THREE.Particle( particlematerial );
  //         particle.position.x = x*spacing - halfsize;
  //         particle.position.y = y*spacing - halfsize;
  //         particle.position.z = z*spacing - halfsize;
  //         particle.scale.x = particle.scale.y = 2;
  //         groupGrid.add( particle );
  //       }
  //     }
  //   }
  // }

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( WIDTH, HEIGHT );
  renderer.setClearColorHex ( 0x000000, 1 );
  container.appendChild( renderer.domElement );

}



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
  if (tweenRotation) {
    TWEEN.update();
    group.rotation.x = tweenRotation.x;
    group.rotation.y = tweenRotation.y;

    // materialRight.opacity = tweenRotation.opacity1;
    // materialRightOdd.opacity = tweenRotation.opacity2;
    // materialDown.opacity = tweenRotation.opacity1;
    // materialDownOdd.opacity = tweenRotation.opacity2;
    // materialDownRight.opacity = tweenRotation.opacity1;
    // materialDownRightOdd.opacity = tweenRotation.opacity2;
    // materialDownLeft.opacity = tweenRotation.opacity1;
    // materialDownLeftOdd.opacity = tweenRotation.opacity2;
  } else {
    // group.rotation.x = mouseY/windowHalfY * RIGHTANGLE;
    // group.rotation.y = mouseX/windowHalfX * RIGHTANGLE;
  }

  // Move grid dots
  // var randomdot = groupGrid.children[Math.floor(Math.random()*groupGrid.children.length)];
  // var move_rand = Math.random();
  // if (move_rand<.333) {
  //   randomdot.position.x += (Math.random() > .5 ? spacing : -spacing);
  // } else if (move_rand>=.667) {
  //   randomdot.position.y += (Math.random() > .5 ? spacing : -spacing);
  // } else {
  //   randomdot.position.z += (Math.random() > .5 ? spacing : -spacing);
  // }

  renderer.render( scene, camera );
}


// var gotoAngle = function(x, y, z) {
//   gotoAngle = true;

//   tweenRotation = { x: group.rotation.x, y: group.rotation.y, z: group.rotation.z };
//   var target = { x: x, y: y, z: z };
//   tween = new TWEEN.Tween(tweenRotation).to(target, 2000)
//     .easing(TWEEN.Easing.Quadratic.EaseInOut)
//     .start();
// };

var cameraLoop = function() {
  looping = true;

  tweenRotation = { 
    x: group.rotation.x, 
    y: group.rotation.y, 
    // opacity1: 0, 
    // opacity2: 0 
  };

  var even = { 
    x: -RIGHTANGLE, 
    y: 0, 
    // opacity1: 0.9, 
    // opacity2: 0 
  };
  var odd = { 
    x: 0, 
    y: RIGHTANGLE, 
    // opacity1: 0, 
    // opacity2: 0.9 
  };

  var tween_curve = TWEEN.Easing.Quintic.EaseInOut;
  var tween_time = 8000;
  var tween_delay = 1000;

  var firstEven = new TWEEN.Tween(tweenRotation)
    .to(even, tween_time)
    .delay(500)
    .onComplete(nextText)
    // .easing(tween_curve)
    .start();

  var tweenEven = new TWEEN.Tween(tweenRotation)
    .to(even, tween_time)
    .delay(tween_delay)
    .onComplete(nextText)
    // .easing(tween_curve);

  var tweenOdd = new TWEEN.Tween(tweenRotation)
    .to(odd, tween_time)
    .delay(tween_delay)
    .onComplete(nextText)
    // .easing(tween_curve);

  // first
  firstEven.chain(tweenEven); 
  // loop
  tweenEven.chain(tweenOdd); 
  tweenOdd.chain(tweenEven);
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

var calcPosition = function (x, y, z) {
  return {
    x: x * spacing - halfsize,
    y: y * spacing - halfsize,
    z: z * spacing - halfsize
  };
}

var drawsegment = function(i, x, y, randomZ, even) {
  // var geometry = new THREE.Geometry();

  var randomZ = randomZ + Math.floor(2 - Math.random()*4);

  var particleGroup = even ? groupEven : groupOdd;
  var particleMaterial;
  if (i < 6) {
    particleMaterial = even ? materialRight : materialRightOdd;
  } else if (i < 12) {
    particleMaterial = even ? materialDown : materialDownOdd;
    // y += 1;
  } else if (i < 16) {
    particleMaterial = even ? materialDownRight : materialDownRightOdd;
    // x += 1;
    // y += 1;
  } else if (i < 20) {
    particleMaterial = even ? materialDownLeft : materialDownLeftOdd;
    // x -= 1;
    // y += 1;
  } else {
    return;
  }

  var particle = new THREE.Particle( particleMaterial );
  // particle.position.x = x*spacing - halfsize;
  // particle.position.y = y*spacing - halfsize;
  // particle.position.z = z*spacing - halfsize;
  // particle.scale.x = particle.scale.y = 2;
  // groupGrid.add( particle );

  switch (i) {
    case 0:
      particle.position = calcPosition(0+x, 0+y, randomZ);
      break;
    case 1:
      particle.position = calcPosition(1+x, 0+y, randomZ);
      break;
    case 2:
      particle.position = calcPosition(0+x, 1+y, randomZ);
      break;
    case 3:
      particle.position = calcPosition(1+x, 1+y, randomZ);
      break;
    case 4:
      particle.position = calcPosition(0+x, 2+y, randomZ);
      break;
    case 5:
      particle.position = calcPosition(1+x, 2+y, randomZ);
      break;
    case 6:
      particle.position = calcPosition(0+x, 0+y, randomZ);
      break;
    case 7:
      particle.position = calcPosition(1+x, 0+y, randomZ);
      break;
    case 8:
      particle.position = calcPosition(2+x, 0+y, randomZ);
      break;
    case 9:
      particle.position = calcPosition(0+x, 1+y, randomZ);
      break;
    case 10:
      particle.position = calcPosition(1+x, 1+y, randomZ);
      break;
    case 11:
      particle.position = calcPosition(2+x, 1+y, randomZ);
      break;
    case 12:
      particle.position = calcPosition(0+x, 0+y, randomZ);
      break;
    case 13:
      particle.position = calcPosition(1+x, 0+y, randomZ);
      break;
    case 14:
      particle.position = calcPosition(0+x, 1+y, randomZ);
      break;
    case 15:
      particle.position = calcPosition(1+x, 1+y, randomZ);
      break;
    case 16:
      particle.position = calcPosition(1+x, 0+y, randomZ);
      break;
    case 17:
      particle.position = calcPosition(2+x, 0+y, randomZ);
      break;
    case 18:
      particle.position = calcPosition(1+x, 1+y, randomZ);
      break;
    case 19:
      particle.position = calcPosition(2+x, 1+y, randomZ);
      break;
    case 20: // dots
      // particle.position = calcPosition(0+x, -0.5+y, randomZ);
      break;
    default:
      break;
  }

  // var line = new THREE.Line( geometry, _material );
  // return line;

  particleGroup.add( particle );

}

var drawtext = function(text, even) {

  var characters = text.split("");
  var text_length = characters.length <= 33 ? characters.length : 33;
  for (var i = 0; i<text_length; i++) {
    var charIndex = chars.indexOf(characters[i]);
    if (charIndex !== -1) {
      var segments = charSegments[charIndex];
      var x = i%11*3 + 4;
      var y = Math.floor(i/11)*3 + 17;
      var randomZ = Math.floor(count*4/7 - Math.random()*count*2/7 );

      for (var j=0; j<22; j++) {
        if (segments[j] === 1) {
          // word.add( drawsegment(j, x, y, randomZ, _material) );
          drawsegment(j, x, y, randomZ, even);
        }
      }

    }
  }
}

var nextText = function() {
  text_index++;
  if (text_index >= texts.length) {
    text_index = 0;
  }
  text_is_on_top = !text_is_on_top;

  if (text_is_on_top){
    // top
    if (groupEven) { group.remove(groupEven); }

    groupEven = new THREE.Object3D();

    drawtext(texts[text_index], text_is_on_top);
    groupEven.rotation.x = RIGHTANGLE;

    group.add(groupEven); 
  } else {
    // Right
    if (groupOdd) { group.remove(groupOdd); }

    groupOdd = new THREE.Object3D();

    drawtext(texts[text_index], text_is_on_top);
    groupOdd.rotation.y = -RIGHTANGLE;

    group.add(groupOdd); 
  }

}

MOA2012ANIMATION.setTexts = function(_texts) {
  texts = _texts;
  text_index = 0;

  nextText();

  // drawtext(texts[0], text_is_on_top);
  // groupRight.rotation.y = -RIGHTANGLE;
  // groupDown.rotation.x = RIGHTANGLE;
  // groupDownRight.rotation.x = RIGHTANGLE;
  // groupDownRight.rotation.y = -RIGHTANGLE;
  // groupDownLeft.rotation.x = RIGHTANGLE;
  // groupDownLeft.rotation.y = RIGHTANGLE;

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
