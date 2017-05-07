var mr = 0.03;

function AI(tetris, dna){
  this.tetris = tetris.init();
  this.dna = dna;
  this.tick = 0;



  this.update = function(){
    if(!dna){
      this.dna = this.randomDNA();
    }
    //the inputs
    var grid  =   this.tetris.grid;
    var shape =   this.tetris.shape;

    if(this.tetris.endGame) {
      return;
    }
    this.tick++;

    var layer1 = []; // layer , size = grid.length + l2;
    var l1len = grid.length;
    var l2len = 6; //

    var choice = [0,0]; //LEFT/RIGHT, DOWN/UP
    var dnaIndex = 0;

    for(var i=0; i< grid.length; i++){
      for(var j=0; j< grid[i].length; j++){
        if(!layer1[i]) layer1[i] = 0;
        layer1[i] += grid[i][j] * this.coef(dnaIndex);
        dnaIndex++;
      }
    }

    var formlen = shape.form[0].length;
    for(var k=l1len; k< l1len + l2len; k++){
      layer1[k] = 0;
      layer1[k] += shape.y * this.coef(dnaIndex);  //todo find the good coefs
      dnaIndex++;
      layer1[k] += shape.x * this.coef(dnaIndex);
      dnaIndex++;
      if(shape.form[floor(k/formlen)] && shape.form[floor(k/formlen)][k%formlen]){
        layer1[k] += shape.form[floor(k/formlen)][k%formlen]  * this.coef(dnaIndex);
      }
      dnaIndex++;

    }

    for(var i=0; i< layer1.length; i++){
      choice[0] += layer1[i] * this.coef(dnaIndex);
      dnaIndex++;
      choice[1] += layer1[i] * this.coef(dnaIndex);
      dnaIndex++;
    }

    //bound between -1 and 1
    choice[0] = max(-1,min(1,choice[0]))
    choice[1] = max(-1,min(1,choice[1]))

    if(choice[0] == -1 ){
      this.tetris.left();
    }else if(choice[0] == 1 ){
      this.tetris.right();
    }

    if(choice[1] == -1 ){
      this.tetris.down();
    }else if(choice[1] == 1 ){
      this.tetris.up();
    }

    this.tetris.update();
  }

  this.isDead = function(){
    return this.tetris.endGame;
  }


  this.fitness = function(){
    return this.tetris.score/2 + this.tick;
  }

  this.coef = function(pos){
    return this.dna[pos] || 0;
  }

  this.randomDNA = function(){
    var a =[];
    var len = this.tetris.grid.length * (this.tetris.grid[0].length+2) + 5 * 6;
    for(var i=0; i< len; i++){
      a.push(random(-1,1));
    }
    return a;
  }


  this.clone = function(w,h){
    var newDna = this.mutateDNA();
    return new AI(new Tetris(w,h), newDna);
  };

  this.mutateDNA = function(){
    var newDna = [];
    for(var i=0; i< this.dna.length; i++){
      if(random(1) < mr){
        newDna.push(this.dna[i] + random(-1,1));
      }else{
        newDna.push(this.dna[i]);
      }
    }

    return newDna;
  }

}

//910
