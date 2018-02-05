var gameBoard = new Array();
var board = document.getElementById("game-table");
var column;
var row;
var currentPlayer;
var id = 1;

newgame();

function newgame(){
  prepBoard();
  placeDisc(Math.floor(Math.random()*2)+1);
}

function checkForVictory(row,col){ //WinOrLose
                                    //getadj = getTotal
  if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
    return true;
  } else {
    if(getAdj(row,col,1,0) > 2){
      return true;
    } else {
      if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
        return true;
      } else {
        if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

function getAdj(row,col,row_inc,col_inc){ //getTotal
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}

function cellVal(row,col){ //placeValue
  if(gameBoard[row] == undefined || [row][col] == undefined){
    return -1;
  } else {
    return gameBoard[row][col]; // col = column
  }
}

function firstFreeRow(col,player){ //freeRow
  for(var i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}

function possibleColumns(){
  var moves_array = new Array();
  for(var i=0; i<7; i++){
    if(gameBoard[0][i] == 0){
      moves_array.push(i);
    }
  }
  return moves_array;
}

function think(){
  var possibleMoves = possibleColumns();
  var aiMoves = new Array();
  var blocked;
  var bestBlocked = 0;
  
  for(var i=0; i<possibleMoves.length; i++){
    for(var j=0; j<6; j++){
      if(gameBoard[j][possibleMoves[i]] != 0){
        break;
      }
    }
    
    gameBoard[j-1][possibleMoves[i]] = 1;
    blocked = getAdj(j-1,possibleMoves[i],0,1)+getAdj(j-1,possibleMoves[i],0,-1);
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,0));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],-1,1));
    blocked = Math.max(blocked,getAdj(j-1,possibleMoves[i],1,1)+getAdj(j-1, possibleMoves[i],-1,-1));
    
    if(blocked >= bestBlocked){
      if(blocked>bestBlocked){
        bestBlocked = blocked;
        aiMoves = new Array();
      }
      aiMoves.push(possibleMoves[i]);
    }
    gameBoard[j-1][possibleMoves[i]] = 0;
  }
  
  return aiMoves;
}

function Disc(player){
  this.player = player;
  this.color = player == 1 ? 'red' : 'yellow';
  this.id = id.toString();
  id++;
  
  this.addToScene = function(){
    board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>';
    if(currentPlayer==2){
      //computer move
      var possibleMoves = think();
      var cpuMove = Math.floor( Math.random() * possibleMoves.length);
      column = possibleMoves[cpuMove];
      document.getElementById('d'+this.id).style.left = (14+60*column)+"px";
      dropDisc(this.id,currentPlayer);
    }
  }
  
  var $this = this;
  document.onmousemove = function(evt){
    if(currentPlayer == 1){
    column = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(column<0){column=0;}
    if(column>6){column=6;}
    document.getElementById('d'+$this.id).style.left = (14+60*column)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }
  document.onload = function(evt){
    if(currentPlayer == 1){
    column = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(column<0){column=0;}
    if(column>6){column=6;}
    document.getElementById('d'+$this.id).style.left = (14+60*column)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    }
  }
  
  document.onclick = function(evt){
    if(currentPlayer == 1){
      if(possibleColumns().indexOf(column) != -1){
        dropDisc($this.id,$this.player);
      }
    }
  }
}

function dropDisc(cid,player){
  row = firstFreeRow(column,player);
  moveit(cid,(14+row*60));
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory(){
  if(!checkForVictory(row,column)){
    placeDisc(3-currentPlayer);
  } else {
    var ww = currentPlayer == 2 ? 'Computer' : 'Player';
    placeDisc(3-currentPlayer);
    alert(ww+" win!");
    board.innerHTML = "";
    newgame();
  }
}

function placeDisc(player){
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
}

function prepBoard(){
  gameBoard = new Array();
  for(var i=0; i<6; i++){
    gameBoard[i] = new Array();
    for(var j=0; j<7; j++){
      gameBoard[i].push(0);
    }
  }
}

function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px';
}