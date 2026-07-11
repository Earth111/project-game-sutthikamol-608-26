let board;
let boardWidth = 1200;
let boardHeight = 500;
let context;

let playerWidth = 85;
let playerHeight = 85;
let playerx = 50;
let playery = 417; 
let playerImg;
let playerImg2;
let player = {
    x:playerx,
    y:playery,
    width:playerWidth,
    height:playerHeight
}
let normalImg;
let transformImg;

let gameOver = false;
let score = 0;
let time = 0;
let Timeout = false;    
let lives = 3;
let hit = false;

let boxImg;
let boxWidth = 60;
let boxHeight = 80;
let boxY = 438;
let skyBoxY = 360;
let skyBoxImg;

let boxesArray = [];
let boxspeed = -7;

let velocityY = 0;
let gravity = 0.35;
let isCrouch = false;
let isTransformed = false;
let victory = false;



console.log(player);

let musicStarted = false; 

window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    normalImg = new Image();
    normalImg.src = "wingman.png";
    transformImg = new Image();
    transformImg.src = "thresh.png";
    playerImg = normalImg;
   
    requestAnimationFrame(update);

    document.addEventListener("keydown",function(e) {
        if(!musicStarted) {
         backgroundMusic.loop = true;
         backgroundMusic.volume = 0.03;
         backgroundMusic.play(); 

         musicStarted = true;
        }
        if(e.code == "Space") {
            jumpSound.currentTime = 0; 
            jumpSound.volume = 0.1;
            jumpSound.play();
        }
    });
    document.addEventListener("keydown", function(e) {
    if(e.code == "ArrowDown") {
        isCrouch = true;
    }
});

document.addEventListener("keyup", function(e) {
    if(e.code == "ArrowDown") {
        isCrouch = false;
    }
});

    document.addEventListener("keydown", movePlayer);

    boxImg = new Image();
    boxImg.src = "mosh.png";
    
    skyBoxImg = new Image();
    skyBoxImg.src = "dizzy.png";
    spawnBox();
}
function spawnBox() {
    createBox();

    let randomTime = Math.random() * 3000 + 500; 
    setTimeout(spawnBox, randomTime);
}

function update() {
    requestAnimationFrame(update);

    if(gameOver) {
        return;
    }

    context.clearRect(0,0,board.width,board.height);
    velocityY += gravity;

    player.y = Math.min(player.y + velocityY,playery);
    let drawHeight = isCrouch ? player.height * 0.7 : player.height;

let drawY = player.y + (player.height - drawHeight) - 0.2;

if(Math.floor(score / 200)% 2 == 1){
    playerImg = transformImg;
    player.width = 110;
    player.height = 102;

    boxspeed = -20;
    if(!isTransformed) {
        transformSound.currentTime = 0;
        transformSound.volume = 0.1;
        transformSound.play();
        isTransformed = true;
    }
}
else {
    if(isTransformed) {
        transformBackSound.currentTime = 0;
        transformBackSound.volume = 0.5;
        transformBackSound.play();
        isTransformed = false;
    }
    playerImg = normalImg;
    player.width = 85;
    player.height = 85;
    boxspeed = -15;
}

context.drawImage(
    playerImg,
    player.x,
    drawY,
    player.width,
    drawHeight
);

    for(let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += boxspeed;
        context.drawImage(box.img,box.x,box.y,box.width,box.height);
        
        let playerObj = {
    x: player.x,
    y: isCrouch ? player.y + player.height / 3 : player.y,
    width: player.width,
    height: isCrouch ? player.height / 3 : player.height
};

if(onCollision(playerObj, box)) {
            hit = true;
            hitSound.currentTime = 0;
            hitSound.volume = 0.1;
            hitSound.play();
            lives--;

            boxesArray.splice(i,1); 
            if(lives <= 0) {
               gameOver = true;
            }
        }

        if(!onCollision(player, box)) {
    hit = false;
}


        if(time >= 5) {
    victory = true;
    gameOver = true;
}

            if(gameOver) {
            context.font = "normal bold 70px blocky, cursive";
            context.textAlign = "center";
            
            context.font = "normal bold 30px blocky, cursive";
            context.fillStyle = "black";
            context.fillText("Score : "+ (score), board.width/2, 320);
            context.font = "normal bold 30px blocky, cursive";
            context.fillStyle = "black";
            context.fillText("Lives : " + lives, board.width/2, 360);
            if(victory) {
                context.fillStyle = "lime";
    context.font = "normal bold 70px blocky, cursive";
    context.fillText("Victory!", board.width/2, board.height/2);
} else {
    context.fillStyle = "red";
    context.font = "normal bold 70px blocky, cursive";
    context.fillText("Game Over!", board.width/2, board.height/2);
    
}
            let gameOverPlayed = false;
            if(gameOver && !gameOverPlayed){
                 gameOverSound.currentTime = 0;
                 gameOverSound.volume = 1;
                  gameOverSound.play();
                  gameOverPlayed = true;
                }
            return;
        }
        
}
score+= 0.5;
context.font = "normal bold 20px monospace";
context.textAlign = "left";
context.fillStyle = "white";

context.fillText("Score : "+ (score.toFixed(0)),10,30);

time += 0.01;
context.font = "normal bold 20px monospace";
context.textAlign = "right";
context.fillStyle = "white";

context.fillText("Time : "+ (time.toFixed(0)),board.width - 10,30);

context.font = "normal bold 20px monospace";
context.textAlign = "left";
context.fillStyle = "white";

context.fillText("Lives : " + lives, 10, 60);

} 

function movePlayer(e) {
    if(gameOver) {
        return;
    }
    if(e.code == "Space" && player.y == playery) {
        velocityY = -10;
    }
}

function createBox() {
    if(gameOver) {
        return;
    }
    let randomType = Math.random();
    let box;
    
    if(randomType < 0.5) {
         box = {
            img:boxImg,
            x:boardWidth + 100,
            y:boxY,
            width:boxWidth,
            height:boxHeight
    };
    }
    else{

        box = {
            img: skyBoxImg,
            x:boardWidth + 100,
            y:skyBoxY,
            width: 60,
            height: 60
        };

    }
    boxesArray.push(box);

    if(boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1,obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
    (obj1.x + obj1.width) > obj2.x //ชนกันในแนวนอน
    &&
    obj1.y < (obj2.y + obj2.height) &&
    (obj1.y + obj1.height) > obj2.y //ชนกันแนวตั้ง
}

//restart game
function restartGame() {
    location.reload();
}

let backgroundMusic = new Audio('malcomm.mp3');
let jumpSound = new Audio('jump.mp3');
let hitSound = new Audio('lost live.mp3');
let gameOverSound = new Audio('game over.mp3');
let transformSound = new Audio('transform.mp3');
let transformBackSound = new Audio('transformback.mp3');

 
