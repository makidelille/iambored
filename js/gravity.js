
var particules = []

function setup(){
  createCanvas(1920,1080);


  //particules.push(new Particule2D(200,300,20, color(255,0,0)));
  particules.push(new Particule2D(width/2, height/2, 50, 0));
  for(var i=0; i< 100; i++){
    particules.push(new Particule2D(random(width),random(height),random(10), color(255,0,0)));
  }


  for(var i=0; i< 100; i++){
    particules.push(new Particule2D(random(width),random(height),1, color(0,255,0)));
  }

}

function keyPressed(){
  if (keyCode === LEFT_ARROW && iterations > 1) {
      iterations--;
    } else if (keyCode === RIGHT_ARROW) {
      iterations++;
    }


}

var iterations = 1;
function draw(){
  //background(51);

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
        particules[i].show();

      }

    }

    particules.push(new Particule2D(random(width),random(height),1, color(0,255,0)));
  }



}
