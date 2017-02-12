function Particule2D(x,y,m,c){
  this.color = c;
  this.pos = createVector(x,y);
  this.mass = m;
  this.vel = createVector();//p5.Vector.random2D(); //createVector();
  this.acc = createVector();
  this.prev = [];


  this.update = function(){

    this.vel.mult(FRICTION);
    this.prev.push(this.pos.copy());

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);


    if(dist(0,0, this.pos.x, this.pos.y) > (MAX_DIST)){
      this.kill();
    }

    while(this.prev.length >= MAX_SIZE){
      this.prev.splice(0,1);
    }

  }

  this.applyForce = function(f){ //slow
    f.mult(1/ this.mass);
    this.acc.add(f);
  }

  this.showForce = false;

  this.show = function(zoomFactor){
    push();
    translate(width/2,height/2);
    stroke(c);
    strokeWeight(zoomFactor * sqrt(this.mass));
    point(this.pos.x * zoomFactor, this.pos.y * zoomFactor);
    for(var i=0; i< this.prev.length; i++){
     var prev = this.prev[i];
     stroke(c, 20);
     strokeWeight(zoomFactor);
     point(prev.x* zoomFactor, prev.y* zoomFactor);
    }
    pop();
  }

  this.kill = function(){
    this.mass = 0;
    this.isDead = true;
  }

  this.collide = function(other){
    this.mass += other.mass/2;
    other.mass /=2;
    //this.color = color(red(this.color) + red(other.color), green(this.color) + green(other.color), blue(this.color) + blue(other.color));
    //this.color /= 2;
    //this.acc.mult(other.mass/this.mass);
    if(other.mass < 1)
      other.kill();
  }

  this.attract = function(attractor){
    var vect = createVector();
    //we do the calculation by hand it's faster;
    vect.x = attractor.pos.x - this.pos.x;
    vect.y = attractor.pos.y - this.pos.y;
    var distSq = vect.magSq();


    var force = G  * (attractor.mass * this.mass) / distSq;
    if(distSq < (this.mass + attractor.mass)/4){
      //collision
      if(this.mass > attractor.mass){
          this.collide(attractor);
      }else{
        attractor.collide(this);
      }

    }else{
      vect.setMag(force);
      this.applyForce(vect);
      if(this.showForce){
        stroke(255);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.pos.x + sqrt(distSq) * vect.x,this.pos.y + sqrt(distSq) * vect.y);
      }
    }



  }
}
