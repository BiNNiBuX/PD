var canvasContext = canvas.getContext("2d");
//Раздел переменных
var maxEnemies = 2;
var Enemies = [];
var Objects = [];
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
const NumOfObjects = 1;
//Конец раздела переменных
//Раздел объектов

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
//Конец раздела объектов

function setWindow(){
    if ((document.fullscreenEnabled === true) && (document.fullscreenElement === null)) {
        document.documentElement.requestFullscreen() //Полноэкранный режим
    }
    canvas.width = screenWidth; //Ширина карты окна
    canvas.height = screenHeight //Высота карты окна
}

//Раздел ивентов
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
            if ((player.Y >= screenHeight - player.Height) || (isOnSurfaceF() != "false")) {
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
//Конец раздела ивентов

function drawMap(){
    
}

function drawAllObjects(){
    canvasContext.fillStyle = "white";
    for (let i=0; i<NumOfObjects; i++){
        canvasContext.fillRect(Objects[i].X, Objects[i].Y, Objects[i].Width, Objects[i].Height)
    }
}

function initObjects(){
    for (let i=0; i<NumOfObjects; i++){
        Objects[i] = {
            X: 100 * i * 4,
            Y: 1080 - 400,
            Width: 200,
            Height: 20,
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

function drawFrame() {
    drawBackground();
    drawPlayer();
    drawEnemies();
    drawAllObjects();
}

function isOnSurfaceF() {
    if (player.Y + player.Height < screenHeight) {
        for(let i=0;i<NumOfObjects;i++){
            if ((player.Y + player.Height >= Objects[i].Y) && (player.Y + player.Height - Objects[i].Height <= Objects[i].Y)){
                if (((player.X + player.Width) > Objects[i].X) && (player.X < (Objects[i].X + Objects[i].Width))){
                    return(i)
                }
            }
        }
        return("false")
    } else return("onFloor")
}

function playerMove() {
    player.Y -= player.SpeedY;
    let isOnSurface = isOnSurfaceF();
    for (let i = 0; i < maxEnemies; i++){
        Enemies[i].X -= player.SpeedX;
    }
    for (let i = 0; i < NumOfObjects; i++){
        Objects[i].X -= player.SpeedX
    }
    for (i=0;i<NumOfObjects;i++){
        if ((player.Y <= Objects[i].Y + Objects[i].Height / 1.5) && (player.Y >= Objects[i].Y)) {
            if (((player.X + player.Width) > Objects[i].X) && (player.X < (Objects[i].X + Objects[i].Width))) {
                player.SpeedY = 0
            }
        }
    }
    if (isOnSurface === "onFloor") {
        player.Y = screenHeight - player.Height
        player.SpeedY = 0
    } 
    else {
        if (isOnSurface === "false") {
            player.SpeedY -= 0.5
        } 
        else {
            player.Y = Objects[isOnSurface].Y - player.Height
            player.SpeedY = 0
        }
    }    
}
//(((player.Y + player.Height) < Objects[i].Y) && (((player.X + player.Width) > Objects[i].X) && (player.X < (Objects[i].X + Objects[i].Width))))

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