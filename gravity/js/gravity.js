
var universes = [];
var MAX, G, FRICTION,SPAWN ,MAX_DIST = 2000,MAX_SIZE = 16;

var maxSlider,gSlider,frictionSlider;
var spawnCheckbox;
var maxP, gP, frictionP;
var camX,camY,zoom;

function setup(){
  frameRate(244);

  maxP = createP("Max");
  maxSlider = createSlider(0,1000,200);
  gP = createP("G");
  gSlider = createSlider(-100,100,6);
  frictionP = createP("friction");
  frictionSlider = createSlider(0,100,100);
  spawnCheckbox = createCheckbox();

  var c = createCanvas(800,800);
  c.mousePressed(mousePressedCanvas);
  c.mouseMoved(mouseDraggedCanvas);
  c.mouseWheel(mouseWheelCanvas);

  camX = 0;
  camY = 0;
  zoom = 0.07;


  var universe = new Universe2D(MAX_DIST);
  universe.moveTo(200,200);
  universes.push(universe);
  //implement multivesrse with this as one universe
  load(preset1,universe);

  var universe = new Universe2D(MAX_DIST * 4);
  universe.moveTo(-200,-200);
  universes.push(universe);
  load(randompreset, universe);
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
var uniSelect;
function mousePressedCanvas(){
  prevX = mouseX;
  prevY = mouseY;
  pressed = true;
  var changed = false;
  for(var i=0; i< universes.length; i++){
    var universe = universes[i];
    if(dist(1/zoom * (mouseX + camX - width/2), 1/zoom * (mouseY + camY - height/2), 1/zoom * universe.pos.x, 1/zoom * universe.pos.y) < universe.size){
      universe.selected = true;
      uniSelect = universe;
      changed = true;
    }else{
      universe.selected = false;
    }
  }
  if(!changed) uniSelect = undefined;

  return false;
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
    if(uniSelect)
      uniSelect.spawn(1/zoom * (mouseX + camX - width/2), 1/zoom * (mouseY + camY - height/2), zoom, 4);
  }



  G = gSlider.value();
  FRICTION = frictionSlider.value() / 100;
  MAX = maxSlider.value();

  SPAWN = spawnCheckbox.checked();

  maxP.html('MAX : ' + MAX);
  gP.html('G : ' + G);
  frictionP.html('Friction : ' + FRICTION);


  background(128); //change universe background

  textSize(16);
  text(frameRate().toFixed(0)+"," + universes.length + " : " + camX + "," + camY + "," + zoom.toFixed(3) ,5, 5 + 16);
  fill(255);

  camera(camX,camY,0);

  for(var i=0; i< universes.length; i++){
    universes[i].update();
    universes[i].show(zoom);


  }




}

function load(f, universe){
  universe.particules = [];
  if(typeof f === "string"){
    eval("(" + f +  ")")(universe);
  }else if(typeof f === "function"){
    f(universe);
  }
}


function preset1(universe){


  universe.setup(6,1,0,false)

  universe.add(new Particule2D(0,-0,1000, color(255,0,0)));
  universe.add(new Particule2D(0,300,20, color(0,0,255)));
  universe.particules[1].vel = (createVector(6 * 4000 * 20/ 100000,0));
  universe.add(new Particule2D(0,-300,20, color(0,0,255)));
  universe.particules[2].vel = (createVector(-6 * 4000 * 20/ 100000,0));
  universe.add(new Particule2D(0,150,10, color(0,0,255)));
  universe.particules[3].vel = (createVector(-6 * 2500 * 10/ sq(150),0));
  universe.add(new Particule2D(0,-150,10, color(0,0,255)));
  universe.particules[4].vel = (createVector(6 * 2500 * 10/ sq(150),0));

}

function randompreset(universe){
  universe.setup(6,100,200,true);
}
