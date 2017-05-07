var ais;

var genP;
var gen;
var fitP;
var bestP;

var input;
var btn;


var w = 15;
var h = 30;

var popSize = 20;


var tetris;

function setup(){
  createCanvas(400,800)

  genP = createP();
  fitP = createP();
  bestP = createP();

  input = createInput();
  btn = createButton('Generer');

  btn.mousePressed(function(){
    var genS = input.value();
    loadFromGen(genS);
  });

  gen = 0;

  ais = [];

  for(var i=0; i< popSize; i++){
    var tetris = new Tetris(w,h);
    var ai = new AI(tetris);
    ais.push(ai);
  }

  frameRate(120);


  // tetris = new Tetris(w,h);
  // tetris.init();

}


function draw(){
  background(0);
  //
  // tetris.updateCtrl();
  // tetris.update();
  // tetris.draw();

  var best;
  var bestfitnessValue = -Infinity;
  var sum = 0;
  for(var i=0; i< ais.length; i++){
    var ai = ais[i];
    ai.update();
    var fit = ai.fitness();
    if(fit > bestfitnessValue){
      bestfitnessValue = fit;
      best = i;
    }
    sum += fit;
  }

  var prob = [];
  for(var i=0; i< ais.length; i++){
    var ai = ais[i];
    prob[i] = ai.fitness()/sum;
  }

  ais[best].tetris.draw();

  var allDead = true;
  var nAlive = 0;
  for(var i=0; i< ais.length; i++){
    var ai = ais[i];
      if(!ai.isDead()){
        allDead = false;
        nAlive++;
      }
    }

  if(allDead){
    gen++;
    for(var i=0; i< ais.length; i++){
      var ai = ais[i];
        if(i == best){
          exportGen(i);
        }
        var oldAi = newAiFromPool(ais,prob)[0];
        ais[i] = oldAi.clone(w,h);
    }
  }


  genP.html('Population : '+nAlive + '/' + ais.length  + ' Generation : ' + gen);
  bestP.html('Best fitness : ' + bestfitnessValue + " Number : "  + best);
  fitP.html('Avg fitness : ' + (sum/ais.length));





}

function newAiFromPool(list,prob){
   var index = 0;
   var r = random(1);

   while (r > 0) {
     r = r - prob[index];
     index++;
   }
   index--;
   return list.slice(index,index+1);
}


function exportGen(i){
  console.log(JSON.stringify(ais[i].dna));
}

function loadFromGen(gen){
  if(typeof gen == "string"){
    gen = JSON.parse(gen);
  }
  var ai = new AI(new Tetris(w,h),gen);
  for(var i=0; i < popSize; i++){
    ais[i] = ai.clone(w,h);
  }
  gen = 0;
}
