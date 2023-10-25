var canvasContext = canvas.getContext("2d");
const screenWidth = window.screen.width;
const screenHeight = window.screen.height ;
const left = 'a';
const right = 'd';
const up = 'w';
const maxSpeedX = 8;
const maxSpeedY = 20;
const EntityWidth = 70;
const EntityHeight = 180;
const NumOfObjects = 10;
const maxEnemies = 2;

{//Раздел переменных

var Enemies = [];
var Objects = [];
var collObj = 0;
var onObj = 0;
var missionStartX;
var missionStartY;
var backGroundPic = new Image();
backGroundPic.src = 'images/back.jpg'

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
            if ((isOnFloor() === "floor") || (isOnFloor() === "object")) {
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

{//Раздел генерации и установок

    function initAll() {
        initObjects();
        initEnemies()
    }

    function initObjects(){
        for (let i=0; i<NumOfObjects; i++){
            Objects[i] = {
                X: 100 * i * 4,
                Y: 1080 - 400,
                Width: 200,
                Height: 30,
            }   
        }
        Objects[1]. Y = 1080 - 500
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

    function setWindow(){
        if ((document.fullscreenEnabled === true) && (document.fullscreenElement === null)) {
            document.documentElement.requestFullscreen() //Полноэкранный режим
        }
        canvas.width = screenWidth; //Ширина карты окна
        canvas.height = screenHeight //Высота карты окна
    }

}//Конец раздела генерации и установок


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

function isOnFloor() {
    if (player.Y + player.Height >= screenHeight) {
        return("floor")
    } else {
        for (i = 0; i < NumOfObjects; i++) {
            if ((player.Y + player.Height > Objects[i].Y - 0.11) && (player.Y < Objects[i].Y)){
                if (((player.X + player.Width >= Objects[i].X) && (player.X <= Objects[i].X + Objects[i].Width))) {
                    onObj = i
                    return("object")
                }
            }
        }
    }
}

function playerMove() {
    playerMoveY()
    playerMoveX()
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
    console.log(isOnFloor())
    console.log(player.SpeedY)
    player.Y -= player.SpeedY
    if (player.SpeedY > 0) {
        if (isOnFloor() === "object") {
            player.Y = Objects[onObj].Y + Objects[onObj].Height + 1
            player.SpeedY = 0;
        } else {
            player.SpeedY -= 0.5 
        }
    } else {
        if (isOnFloor() === "floor"){
            player.Y = screenHeight - player.Height
            player.SpeedY = 0;
        } else {
            if (isOnFloor() === "object") {
                player.Y = Objects[onObj].Y - player.Height - 0.1
                player.SpeedY = 0;
            } else {
                player.SpeedY -= 0.5 
            }
        }
    }
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

initAll();
play();
initEventListeners()