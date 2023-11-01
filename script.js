var canvasContext = canvas.getContext("2d");
var ctx = document.getElementById('canvas').getContext('2d');
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
var MouseX;
var MouseY;
backGroundPic.src = 'images/back.jpg'

}//Конец раздела переменных

{//Раздел объектов

var mission = {
    Width: screenWidth * 3,
    Height: screenHeight,
}

var allWeapons = [
    {Name: '1', Damage: 1, Width: 90, Height: 20, Sprite: 'green'}, 
    {Name: '2', Damage: 1, Width: 100, Height: 30, Sprite: 'white'}
]

var Player = {
    X: screenWidth / 2 - EntityHeight / 2,
    Y: 0,
    HP: 100,
    Height: EntityHeight,
    Width: EntityWidth,
    SpeedX: 0,
    SpeedY: 0,
    left: 0,
    right: 0,
    Weapon: allWeapons[1],
    AngleOfSight: 0,
}

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
                    Weapon: allWeapons[Math.floor(randomNumber(0, 2))],
                    AngleOfSight: 1,
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
    Player.AngleOfSight = Math.asin(((Player.Y + 45) - event.clientY) / Math.sqrt(Math.pow(event.clientX - (Player.X + EntityWidth / 2), 2) + Math.pow(event.clientY - (Player.Y + 45), 2)))
    MouseX = event.clientX;
}

function mouseclick(event) {
    //alert("mouseclick")
}

function keyDown(event) {
    switch(event.key) {
        case right:
            Player.SpeedX = maxSpeedX;
            Player.right = 1;
            break;
        case left:
            Player.SpeedX = -maxSpeedX;
            Player.left = 1;
            break;
        case up: 
            if ((isOnFloor() === "floor") || (isOnFloor() === "object")) {
                Player.SpeedY = maxSpeedY
            }
    }
}

function keyUp(event) {
    switch (event.key) {
        case right:
            Player.right = 0;
            if (Player.left === 1) {
                Player.SpeedX = -maxSpeedX;
            } else {
                Player.SpeedX = 0;
            }
            break
        case left: 
            Player.left = 0;
            if (Player.right === 1) {
                Player.SpeedX = maxSpeedX;
            } else {
                Player.SpeedX = 0;
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
    canvasContext.fillRect(Player.X, Player.Y, Player.Width, Player.Height);
    drawWeapon(Player.Weapon, Player.X, Player.Y, Player.AngleOfSight, reflection(MouseX, Player.X + EntityWidth / 2))
}

function drawEnemies() {
    for (let i = 0; i < maxEnemies; i++){
        Enemies[i].AngleOfSight = aimPlayer(Enemies[i]) 
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(Enemies[i].X, Enemies[i].Y, Enemies[i].Width, Enemies[i].Height)
        drawWeapon(Enemies[i].Weapon, Enemies[i].X, Enemies[i].Y, Enemies[i].AngleOfSight, reflection(Player.X + EntityWidth / 2, Enemies[i].X + EntityWidth / 2))
    }
}

function drawWeapon(Weapon, X, Y, angle, isRefl) {
    X = X + EntityWidth / 2
    Y = Y + 45
    canvasContext.fillStyle = Weapon.Sprite;
    ctx.save()
    ctx.translate(X, Y);
    if (isRefl) {
        ctx.rotate(-angle);
        ctx.fillRect(0, 0, Weapon.Width, Weapon.Height);
    }
    else {
        ctx.rotate(angle);
        ctx.fillRect(0 - Weapon.Width, 0, Weapon.Width, Weapon.Height);
    }
    ctx.restore();
}

}//Конец раздела отрисовки

function aimPlayer(Enemy) {
    return(Math.asin(((Enemy.Y ) - Player.Y) / Math.sqrt(Math.pow(Player.X - (Enemy.X + EntityWidth / 2), 2) + Math.pow(Player.Y - (Enemy.Y + 45), 2))))
}

function reflection(X1, X2) {
    if ((X1 - X2) > 0) {
        return(true)
    }
    return(false)
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function isCollision() {
    for (let i=0; i < NumOfObjects; i++){
        if ((Player.Y + Player.Height >= Objects[i].Y) && (Player.Y <= Objects[i].Y + Objects[i].Height)){
            if ((Player.X + Player.Width >= Objects[i].X) && (Player.X <= Objects[i].X + Objects[i].Width)){
                collObj = i;
                return(true)
            }
        }
    }
    return(false)
}

function isOnFloor() {
    if (Player.Y + Player.Height >= screenHeight) {
        return("floor")
    } else {
        for (i = 0; i < NumOfObjects; i++) {
            if ((Player.Y + Player.Height > Objects[i].Y - 0.11) && (Player.Y < Objects[i].Y)){
                if (((Player.X + Player.Width >= Objects[i].X) && (Player.X <= Objects[i].X + Objects[i].Width))) {
                    onObj = i
                    return("object")
                }
            }
        }
    }
}

function PlayerMove() {
    PlayerMoveY()
    PlayerMoveX()
}

function PlayerMoveX(){
    if (Player.SpeedX < 0) {
        for (i = Player.SpeedX; i != 0; i+=1) {
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
    if (Player.SpeedX > 0) {
        for (i = Player.SpeedX; i != 0; i-=1) {
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
        if (Player.SpeedX < 0) {
            for (i = Player.SpeedX; i != 0; i+=1) {
                for (j = 0; j < maxEnemies; j++){
                    Enemies[j].X-=0.25
                }
                for (j = 0; j < NumOfObjects; j++){
                    Objects[j].X-=0.25
                }
            }
        }
        if (Player.SpeedX > 0) {
            for (i = Player.SpeedX; i != 0; i-=1) {
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

function PlayerMoveY(){
    Player.Y -= Player.SpeedY
    if (Player.SpeedY > 0) {
        if (isOnFloor() === "object") {
            Player.Y = Objects[onObj].Y + Objects[onObj].Height + 1
            Player.SpeedY = 0;
        } else {
            Player.SpeedY -= 0.5 
        }
    } else {
        if (isOnFloor() === "floor"){
            Player.Y = screenHeight - Player.Height
            Player.SpeedY = 0;
        } else {
            if (isOnFloor() === "object") {
                Player.Y = Objects[onObj].Y - Player.Height - 0.1
                Player.SpeedY = 0;
            } else {
                Player.SpeedY -= 0.5 
            }
        }
    }
}

function updateFrame() {
    //Тут потом будут двигаться крипы
    PlayerMove()
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
