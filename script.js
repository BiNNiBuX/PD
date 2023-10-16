var canvasContext = canvas.getContext("2d");
//Раздел переменных
var missionStartX;
var missionStartY;
const screenWidth = window.screen.width;
const screenHeight = window.screen.height ;
const left = 'a';
const right = 'd';
const up = 'w';
//Конец раздела переменных
//Раздел объектов
var player = {
    X: 1000,
    Y: 0,
    HP: 100,
    Height: 100,
    Width: 40,
    SpeedX: 0,
    SpeedY: 0,
    left: 0,
    right: 0,
    setSpeed: 5
}
//Конец раздела объектов

function setWindow(){
    if ((document.fullscreenEnabled === true) && (document.fullscreenElement === null)) {
        document.documentElement.requestFullscreen() //Полноэкранный режим
    }
    canvas.width = screenWidth; //Ширина игрового окна
    canvas.height = screenHeight //Высота игрового окна
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
            player.SpeedX = player.setSpeed;
            player.right = 1;
            break;
        case left:
            player.SpeedX = -player.setSpeed;
            player.left = 1;
            break;
        case up: 
            if (player.Y >= screenHeight - player.Height) {
                player.SpeedY = 10
            }
    }
}

function keyUp(event) {
    switch (event.key) {
        case right:
            player.right = 0;
            if (player.left === 1) {
                player.SpeedX = -player.setSpeed;
            } else {
                player.SpeedX = 0;
            }
            break
        case left: 
            player.left = 0;
            if (player.right === 1) {
                player.SpeedX = player.setSpeed;
            } else {
                player.SpeedX = 0;
            }
            break
    }
}
//Конец раздела ивентов


function drawBackground() {
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, screenWidth, screenHeight)
}

function drawPlayer() {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(player.X, player.Y, player.Width, player.Height);
}

function drawFrame() {
    drawBackground();
    drawPlayer();
}

function playerMove() {
    player.X += player.SpeedX;
    player.Y -= player.SpeedY;
    console.log(player.SpeedY);
    if (player.Y < screenHeight - player.Height) {
        player.SpeedY -= 0.3
    } else {
        player.Y = screenHeight - player.Height
        player.SpeedY = 0
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

play()
initEventListeners()