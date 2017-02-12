
var particules = []
var MAX, G, FRICTION,SPAWN ,MAX_DIST = 50000,MAX_SIZE = 16;

var maxSlider,gSlider,frictionSlider;
var spawnCheckbox;
var maxP, gP, frictionP;
var camX,camY,zoom;

function setup(){
  frameRate(244);

  maxP = createP("Max");
  maxSlider = createSlider(0,10000,200);
  gP = createP("G");
  gSlider = createSlider(0,100,6);
  frictionP = createP("friction");
  frictionSlider = createSlider(0,100,100);
  spawnCheckbox = createCheckbox();

  var c = createCanvas(800,800);
  c.mousePressed(mousePressedCanvas);
  c.mouseMoved(mouseDraggedCanvas);
  c.mouseWheel(mouseWheelCanvas);

  camX = 0;
  camY = 0;
  zoom = 1;



  load();

  background(128);
}

var min_zoom =  0.001;
function mouseWheelCanvas(event){
  zoom -= zoom * event.deltaY/1000;
  if(zoom < min_zoom) zoom = min_zoom;
  return false;
}


var prevX = 0;
var prevY = 0;
var pressed = false;
function mousePressedCanvas(){
  prevX = mouseX;
  prevY = mouseY;
  pressed = true;
}

function mouseDraggedCanvas(){
  if(!pressed) return true;
  noCursor();
  var dx = prevX - mouseX;
  var dy = prevY - mouseY;
  camX += dx;
  camY += dy;
  prevX = mouseX;
  prevY = mouseY;
  return false;
}

function mouseReleased(){
  pressed = false;
  cursor();
}



var speedfactor = 10;
function draw(){
  if(keyIsDown(LEFT_ARROW)){
    camX-= speedfactor;
  }
  if(keyIsDown(RIGHT_ARROW)){
    camX+=speedfactor;
  }
  if(keyIsDown(UP_ARROW)){
    camY-=speedfactor;
  }
  if(keyIsDown(DOWN_ARROW)){
    camY+=speedfactor;
  }
  if(keyIsDown(32)){
    particules.push(new Particule2D(1/zoom * (mouseX + camX - width/2), 1/zoom * (mouseY + camY - height/2),random(4, 100), color(random(255),random(255),random(255))));
  }



  G = gSlider.value();
  FRICTION = frictionSlider.value() / 100;
  MAX = maxSlider.value();

  SPAWN = spawnCheckbox.checked();

  maxP.html('MAX : ' + MAX);
  gP.html('G : ' + G);
  frictionP.html('Friction : ' + FRICTION);


  background(128);

  textSize(16);
  text(frameRate().toFixed(0)+"," + particules.length + " : " + camX + "," + camY + "," + zoom.toFixed(3) ,5, 5 + 16);
  fill(255);

  camera(camX,camY,0);


  for(var i=0; i< particules.length; i++){
      for(var j=0; j < particules.length; j++){
        if(i == j) continue;
        particules[i].attract(particules[j]);
      }
  }

    for(var i=particules.length-1; i>= 0 ; i--){
      if(particules[i].isDead) {
        particules.splice(i,1);
      }else{
        particules[i].update();
        particules[i].show(zoom);

      }

    }

   if(particules.length < MAX && SPAWN)
       particules.push(new Particule2D(random(-width, width),random(-height, height),random(1,9), color(random(255),random(255),random(255))));

}

function load(loadString){
  particules = [];
  if(loadString){
    eval(loadString);
  }else{
    preset1();
  }


}


function preset1(){

  frictionSlider.value(100);
  gSlider.value(6);
  maxSlider.value(0);
  spawnCheckbox.checked(false);

  particules.push(new Particule2D(0,-0,1000, color(255,0,0)));
  particules.push(new Particule2D(0,300,20, color(0,0,255)));
  particules[1].vel = (createVector(6 * 4000 * 20/ 100000,0));
  particules.push(new Particule2D(0,-300,20, color(0,0,255)));
  particules[2].vel = (createVector(-6 * 4000 * 20/ 100000,0));
  particules.push(new Particule2D(0,150,10, color(0,0,255)));
  particules[3].vel = (createVector(-6 * 2500 * 10/ sq(150),0));
  particules.push(new Particule2D(0,-150,10, color(0,0,255)));
  particules[4].vel = (createVector(6 * 2500 * 10/ sq(150),0));

}

function randompreset(){
  frictionSlider.value(100);
  gSlider.value(6);
  maxSlider.value(200);
  spawnCheckbox.checked(true);
}
