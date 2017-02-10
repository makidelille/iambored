function Particule2D(x,y,m,c){
  this.color = c;
  this.pos = createVector(x,y);
  this.mass = m;
  this.vel = createVector();//p5.Vector.random2D(); //createVector();
  this.acc = createVector();
  this.prev = [];


  this.update = function(){

    this.vel.mult(FRICTION);
    //this.prev.push(this.pos);

    //console.log(this.prev.length);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    //we bound in the window
    if(this.pos.x > width){
      this.pos.x = 0;
    }

    if(this.pos.x < 0){
      this.pos.x = width;
    }

    if(this.pos.y > height){
      this.pos.y = 0;
    }

    if(this.pos.y < 0){
      this.pos.y = height;
    }
    var MAX_SIZE = 2000;
    while(this.prev.length >= MAX_SIZE){
      this.prev.splice(0,1);
    }

  }

  this.applyForce = function(f){
    f.mult(1/ sq(this.mass));
    this.acc.add(f);
  }

  this.showForce = false;

  this.show = function(showForce){
    //push();
    //beginShape();
    stroke(c);
//    strokeWeight(1);
    strokeWeight(sqrt(this.mass));
    point(this.pos.x, this.pos.y);
    //vertex(this.pos.x, this.pos.y);
    //for(var i=0; i< this.prev.length; i++){
    //  console.log(this.prev[i]);
    //  var prev = this.prev[i];
    //  vertex(prev.x, prev.y);
    //}
    //endShape();
    //pop();
    //if(showForce) this.showForce = true;
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
    var vect = p5.Vector.sub(attractor.pos, this.pos);
    var distSq = vect.magSq();


    var force = G  * (attractor.mass * this.mass) / distSq;
    if(distSq < (this.mass + attractor.mass)/9){
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
