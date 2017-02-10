
var particules = []
var MAX = 200;
var G = 6;
var FRICTION = 1;

var maxSlider,gSlider,frictionSlider;

function setup(){
  createCanvas(1200,1200);

  createP("Max");
  maxSlider = createSlider(1,500,200);
  createP("G");
  gSlider = createSlider(0.1,60,6);
  createP("friction");
  frictionSlider = createSlider(0,100,100);


  //particules.push(new Particule2D(200,300,20, color(255,0,0)));
  //particules.push(new Particule2D(width/2, height/2, 64, 0));
  for(var i=0; i< 0; i++){
    particules.push(new Particule2D(random(width),random(height),random(25,100), color(random(255),random(255),random(255))));
  }


  for(var i=0; i< particules.length; i++){
    particules[i].applyForce(createVector(50,00));
  }

  background(128);
}

function keyPressed(){
  if (keyCode === LEFT_ARROW && iterations > 1) {
      iterations--;
    } else if (keyCode === RIGHT_ARROW) {
      iterations++;
    }


}

function mousePressed(){
  particules.push(new Particule2D(mouseX,mouseY,random(25,100), color(random(255),random(255),random(255))))
}

var iterations = 1;
function draw(){
  G = gSlider.value();
  FRICTION = frictionSlider.value() / 100;
  MAX = maxSlider.value();

  background(128);

  for(var k = 0; k< iterations; k++){

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
        particules[i].show(1);

      }

    }

    // console.log(particules.length);
    if(particules.length < MAX)
      particules.push(new Particule2D(random(width),random(height),random(1,9), color(random(255),random(255),random(255))));
  }



}
