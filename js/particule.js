function Particule2D(x,y,m,c){
  this.color = c;
  this.pos = createVector(x,y);
  this.mass = m;
  this.vel = createVector();
  this.acc = createVector();


  this.update = function(){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  this.applyForce = function(f){
    this.acc.add(f.mult(1/sq(this.mass)));
  }

  this.show = function(){
    stroke(c, 50);
    strokeWeight(this.mass);
    point(this.pos.x, this.pos.y)
  }

  this.kill = function(){
    this.mass = 0;
    this.isDead = true;
  }

  this.attract = function(attractor){
    var vect = p5.Vector.sub(attractor.pos, this.pos);
    var distSq = vect.magSq();
    var G = 6.3;
    var force = G  * (attractor.mass * this.mass) / distSq;
    if(distSq < sq(this.mass + attractor.mass)/9){
      //collision
      if(this.mass > attractor.mass){
        this.mass += attractor.mass/2;
        attractor.kill();
      }else{
        attractor.mass += this.mass/2;
        this.kill();
      }

    }else{
      vect.setMag(force);
      this.applyForce(vect);
    }



  }
}
