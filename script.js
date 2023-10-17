var canvasContext = canvas.getContext("2d");

{//Раздел переменных

var Enemies = [];
var Objects = [];
var collObj = 0;
var missionStartX;
var missionStartY;
var backGroundPic = new Image();
backGroundPic.src = 'images/back.jpg'
const screenWidth = window.screen.width;
const screenHeight = window.screen.height ;
const left = 'a';
const right = 'd';
const up = 'w';
const maxSpeedX = 8;
const maxSpeedY = 20;
const EntityWidth = 70;
const EntityHeight = 180;
const NumOfObjects = 2;
const maxEnemies = 2;

}//Конец раздела переменных

{//Раздел объектов

var mission = {
    Width: screenWidth * 3,
    Height: screenHeight,
}

var player = {
    X: screenWidth / 2 - EntityHeight / 2,
    Y: 0,
    HP: 100,
    Height: EntityHeight,
    Width: EntityWidth,
    SpeedX: 0,
    SpeedY: 0,
    left: 0,
    right: 0,
}

}//Конец раздела объектов

{//Раздел ивентов

function initEventListeners() {
    window.addEventListener("mousemove", onmousemove);
    window.addEventListener("click", mouseclick);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    document.addEventListener("keydown", setWindow)
}

function onmousemove(event) {
    //alert("mousemove")
}

function mouseclick(event) {
    //alert("mouseclick")
}

function keyDown(event) {
    switch(event.key) {
        case right:
            player.SpeedX = maxSpeedX;
            player.right = 1;
            break;
        case left:
            player.SpeedX = -maxSpeedX;
            player.left = 1;
            break;
        case up: 
            if ((player.Y >= screenHeight - player.Height)) {
                player.SpeedY = maxSpeedY
            }
    }
}

function keyUp(event) {
    switch (event.key) {
        case right:
            player.right = 0;
            if (player.left === 1) {
                player.SpeedX = -maxSpeedX;
            } else {
                player.SpeedX = 0;
            }
            break
        case left: 
            player.left = 0;
            if (player.right === 1) {
                player.SpeedX = maxSpeedX;
            } else {
                player.SpeedX = 0;
            }
            break
    }
}

}//Конец раздела ивентов


{//Раздел отрисовки

function drawFrame() {
    drawBackground();
    drawPlayer();
    drawEnemies();
    drawAllObjects();
}

function drawAllObjects(){
    canvasContext.fillStyle = "white";
    for (let i=0; i<NumOfObjects; i++){
        canvasContext.fillRect(Objects[i].X, Objects[i].Y, Objects[i].Width, Objects[i].Height)
    }
}

function drawBackground() {
    canvasContext.fillStyle = "black";
    canvasContext.drawImage(backGroundPic, 0, 0)
}

function drawPlayer() {
    canvasContext.fillStyle = "blue";
    canvasContext.fillRect(player.X, player.Y, player.Width, player.Height);
}

function drawEnemies() {
    for (let i = 0; i < maxEnemies; i++){
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(Enemies[i].X, Enemies[i].Y, Enemies[i].Width, Enemies[i].Height)
    }
}

}//Конец раздела отрисовки

function setWindow(){
    if ((document.fullscreenEnabled === true) && (document.fullscreenElement === null)) {
        document.documentElement.requestFullscreen() //Полноэкранный режим
    }
    canvas.width = screenWidth; //Ширина карты окна
    canvas.height = screenHeight //Высота карты окна
}

function initObjects(){
    for (let i=0; i<NumOfObjects; i++){
        Objects[i] = {
            X: 100 * i * 4,
            Y: 1080 - 400,
            Width: 200,
            Height: 300,
        }   
    }
}

function initEnemies(){
    for (let i = 0; i < maxEnemies; i++){
        Enemies[i] = {
            X: 250 * i,
            Y: 1080 - 180,
            Width: EntityWidth,
            Height: EntityHeight,
        }
    }
}

function isCollision() {
    for (let i=0; i < NumOfObjects; i++){
        if ((player.Y + player.Height >= Objects[i].Y) && (player.Y <= Objects[i].Y + Objects[i].Height)){
            if ((player.X + player.Width >= Objects[i].X) && (player.X <= Objects[i].X + Objects[i].Width)){
                collObj = i;
                return(true)
            }
        }
    }
    return(false)
}

function playerMoveX(){
    if (player.SpeedX < 0) {
        for (i = player.SpeedX; i != 0; i+=1) {
            if (!isCollision()){
                for (j = 0; j < maxEnemies; j++){
                    Enemies[j].X++
                }
                for (j = 0; j < NumOfObjects; j++){
                    Objects[j].X++
                }
            }
        }
    }
    if (player.SpeedX > 0) {
        for (i = player.SpeedX; i != 0; i-=1) {
            if (!isCollision()){
                for (j = 0; j < maxEnemies; j++){
                    Enemies[j].X--
                }
                for (j = 0; j < NumOfObjects; j++){
                    Objects[j].X--
                }
            }
        }
    }
    if (isCollision()) {
        if (player.SpeedX < 0) {
            for (i = player.SpeedX; i != 0; i+=1) {
                for (j = 0; j < maxEnemies; j++){
                    Enemies[j].X-=0.25
                }
                for (j = 0; j < NumOfObjects; j++){
                    Objects[j].X-=0.25
                }
            }
        }
        if (player.SpeedX > 0) {
            for (i = player.SpeedX; i != 0; i-=1) {
                for (j = 0; j < maxEnemies; j++){
                    Enemies[j].X+=0.25
                }
                for (j = 0; j < NumOfObjects; j++){
                    Objects[j].X+=0.25
                }
            }
        } 
    }
}

function playerMoveY(){
    player.Y -= player.SpeedY;
    if (player.Y + player.Height >= screenHeight) {
        player.Y = screenHeight - player.Height
        player.SpeedY = 0;
    } else player.SpeedY -= 0.5
    player.Y -= player.SpeedY
}

function playerMove() {
    playerMoveY()
    playerMoveX()
}

function updateFrame() {
    //Тут потом будут двигаться крипы
    playerMove()
}

function play() {
    //startMission();
    drawFrame();
    updateFrame();
    requestAnimationFrame(play)
}

initObjects();
initEnemies()
play()
initEventListeners()