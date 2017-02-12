function Universe2D(s){
  this.size = s;
  this.particules = []
  this.pos = createVector();
  this.mass = 0;
  this.selected = false;



  this.G;
  this.MAX;
  this.FRICTION;
  this.SPAWN;

  this.setup = function(newG, newF, newMax, newSpawn){
    this.G = newG;
    this.FRICTION = newF;
    this.MAX = newMax
    this.SPAWN = newSpawn;
  }


  this.show = function(zoom){
    push();
    translate(width/2, height/2);
    fill(this.selected ? 200 : 0);
    ellipse(this.pos.x, this.pos.y, zoom * this.size * 2);
    pop();
    push();

    if(this.selected){
      translate(this.pos.x, this.pos.y);
      for(var i=0; i < this.particules.length ; i++){
          this.particules[i].show(zoom,1);
      }
    }else{
      textSize(this.size * zoom);
      text(this.particules.length, this.pos.x + width/2 - this.size * zoom/4,this.pos.y + height/2 + this.size * zoom/4);
      textSize(this.size * zoom * 0.1);
      text(this.mass.toFixed(1), this.pos.x + width/2 - this.size * zoom/4,this.pos.y + height/2 + 2 * this.size * zoom/4);
      fill(255);
    }
    pop();
  }

  this.update = function(){
    for(var i=0; i< this.particules.length; i++){
        if(dist(0,0, this.particules[i].pos.x, this.particules[i].pos.y) > this.size){
          this.particules[i].kill();
          continue;
        }
        for(var j=0; j < this.particules.length; j++){
          if(i == j) continue;
          this.particules[i].attract(this.particules[j]);
        }

    }

    var mass = 0;
    for(var i=this.particules.length-1; i>= 0 ; i--){
      if(this.particules[i].isDead) {
        this.particules.splice(i,1);
      }else{
        this.particules[i].update();
        mass += this.particules[i].mass;
      }

    }

    if(this.particules.length < this.MAX && this.SPAWN)
        this.spawn();

    this.mass = mass;
  }

  this.spawn = function(x,y,zoom, size){

    if(x && y && zoom){
      x -= this.pos.x * 1/zoom;
      y -= this.pos.y * 1/zoom;

    }else{
      x = random(-this.size, this.size);
      y = random(-this.size, this.size);
      size = 1;
    }
    if(dist(x,y,0,0) > this.size) return;
    this.add(new Particule2D(x,y,random(sq(size),sq(size + 3)), color(random(255),random(255),random(255))));




  }

  this.add = function(part){
    part.setup(this.G, this.FRICTION);
    this.particules.push(part);
  }

  this.moveTo = function(x,y){
    this.pos = createVector(x,y);
  }

}
