function Tetris(w,h){
  this.grid = [];
  this.endGame = false;
  this.shape = {
    form : [],
    x : 0,
    y : 0,
    falltime : 2
  };
  this.score = 0;
  this.falltime = 2;
  this.w = w;
  this.h = h;

  this.init = function(){
    this.grid = [];
    this.endGame = false;
    this.score = 0;
    for(var i=0; i< this.h; i++){
      var row = [];
      for(var j=0; j< this.w; j++){
        row[j] = 0;
      }
      this.grid.push(row);
    }

    this.newShape();
    return this;
  };


  this.draw = function(){
    var heightScale = height /   this.grid.length;
    var widthScale = width /   this.grid[0].length;

    for(var i=0; i<   this.grid.length; i++){
      var row =   this.grid[i];
      for(var j=0; j < row.length;j++){
        stroke(i/  this.grid.length * 255);
        if(row[j]){
          fill(255);
        }else{
          noFill();
        }

        rect(j * widthScale,height - (  this.grid.length - i) * heightScale,widthScale-1,heightScale-1);
      }
    }

    //draw the shape

    for(var i=  this.shape.y; i <   this.shape.y +   this.shape.form.length; i++){
      for(var j=  this.shape.x; j <   this.shape.x +   this.shape.form[0].length; j++){
        if(  this.shape.form[i-  this.shape.y][j-  this.shape.x]){
          fill(color('red'));
          rect(j * widthScale,height - (  this.grid.length - i) * heightScale,widthScale-1,heightScale-1);
        }
      }
    }


    textSize(32);
    fill(255);
    stroke(0);
    text("score :" + this.score,10,40);
  }

  this.update = function(){
    if(this.endGame){
      for(var i=0; i< this.grid.length; i++){
        for(var j=0; j< this.grid[i].length; j++){
          if(!this.grid[i][j]){
            this.grid[i][j] = 1;
            break;
          }
        }
      }



      return;
    }


    if(this.shape.x < 0 )this.shape.x = 0;
    else {
        for(var i=0; i< this.shape.form.length; i++){
          if(this.shape.form[i][0] && this.grid[this.shape.y +i] && this.grid[this.shape.y +i][this.shape.x]){
            for(var j=this.shape.x; j < this.grid[this.shape.y +i].length; j++){
              if(!this.grid[this.shape.y +i][j]){
                this.shape.x = j;
                break;
              }
            }
          }
        }
    }




    if(this.shape.x + this.shape.form[0].length > this.grid[0].length )this.shape.x =  this.grid[0].length - this.shape.form[0].length;
    else{
      for(var i=0; i< this.shape.form.length; i++){
        for(var k=0; k< this.shape.form[i].length; k++){
          if(this.shape.form[i][k] && this.grid[this.shape.y +i]  && this.grid[this.shape.y +i][this.shape.x+k]){
            this.shape.x--;
            break;
          }
        }
      }
    }

      if(this.hit()){
        for(var i=this.shape.y; i < this.shape.y + this.shape.form.length; i++){
          for(var j=this.shape.x; j < this.shape.x + this.shape.form[0].length; j++){
            if(this.shape.form[i-this.shape.y][j-this.shape.x]){
              this.grid[i][j] = 1;
              if(i == 0){
                this.end();
                return;
              }
            }
          }
        }

        this.newShape();

        this.shape.y = 0;

      }else if(!this.endGame){
        this.shape.falltime--;
        if(this.shape.falltime == 0){
          this.shape.y++;
          this.shape.falltime = falltime;
        }

      }

      //check lines
      for(var i=0; i< this.grid.length; i++){
        var ok = true;
        for(var j=0; j< this.grid[i].length; j++){
          if(!this.grid[i][j]){
            ok = false;
          }
        }
        if(ok){
          var row =[];
          for(var j=0; j< this.grid[i].length;j++){
            row.push(0);
          }
          this.grid.splice(i,1);
          this.grid.splice(0,0,row);
          this.score += row.length * this.grid.length;
        }
      }





  }

  this.left = function(){
      this.shape.x--;
  }
  this.right = function(){
      this.shape.x++;
  }
  this.up = function(){
      this.rotateShape();
  }
  this.down = function(){
      this.shape.falltime = 1;
      this.score++;
  }

  this.updateCtrl = function(){
    if(keyIsDown(LEFT_ARROW)){
      this.left();
    }

    if(keyIsDown(RIGHT_ARROW)){
      this.right();
    }

    if(keyIsDown(DOWN_ARROW) ){
      this.down();
    }

    if(keyIsDown(UP_ARROW) ){
      this.up();
    }
  }

  this.hit = function(){
    if(this.shape.y + this.shape.form.length >= this.grid.length) return true;
    for(var i=this.shape.y; i < this.shape.y + this.shape.form.length; i++){
      for(var j=this.shape.x; j < this.shape.x + this.shape.form[0].length; j++){
        if(this.shape.form[i-this.shape.y][j-this.shape.x] && this.grid[i+1][j]){
          return true;
        }
      }
    }

    return false;
  }


  this.rotateShape = function(){
    var newForm = [];
    var oldForm = this.shape.form;
    var form = this.shape.form;
    for(var i=0; i< form.length; i++){
      for(var j=0; j < form[i].length; j++){
        if(!newForm[j]) newForm[j] = [];
        newForm[j][i] = form[form.length-1-i][j]
      }
    }

    this.shape.form = newForm;
    if(this.hit()){
      this.shape.form = oldForm;
    }
  }


  this.end = function(){
    this.endGame = true;
    this.shape.form = [];
  }

  this.newShape = function(){
    var index = floor(random(forms.length));
    this.shape.form = forms[index];
  }


}

var forms = [
  [[1,1,1,1]],
  [[1,1,1],[1,0,0]],
  [[1,1,1],[0,1,0]],
  [[1,1,1],[0,0,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,1],[1,1]],

];

var falltime = 30;
