var canvasContext = document.getElementById('canvas').getContext('2d');
const screenWidth = window.screen.width;
const screenHeight = window.screen.height ;
const left = 'a';
const right = 'd';
const up = 'w';
const maxSpeedX = 8;
const maxSpeedY = 20;
const EntityWidth = 71*1.2;
const EntityHeight = 100*1.2;
const NumOfObjects = 10;
const maxEnemies = 2;
const maxBullets = 100;
var song = new Audio('sounds/song.mp3');
var pPics = []
for (i = 1; i <= 6; i++) {
    pPics[i] = new Image()
    pPics[i].src = 'images/gg/gg' + i + '.png';
}
var hPics = []
for (i = 1; i <= 7; i++) {
    hPics[i] = new Image();
    hPics[i].src = 'images/pistol/pistol' + i + '.png';
}
var ePic = new Image();
ePic.src = 'images/bot.png';
pPics.src
{//Раздел переменных

var ShotFrame = 10;
var MoveFrame = 10;
var Enemies = [];
var bullet = [];
var Objects = [];
var collObj = 0;
var onObj = 0;
var missionStartX;
var missionStartY;
var backGroundPic = new Image();
var MouseX;
var MouseY;
var bn = 0;
backGroundPic.src = 'images/back.jpg'

}//Конец раздела переменных

{//Раздел объектов

var mission = {
    Width: screenWidth * 3,
    Height: screenHeight,
}

var allWeapons = [
    {Name: '1', Damage: 1, Width: 62, Height: 22, Sprite: 'green'}, 
    {Name: '2', Damage: 1, Width: 62, Height: 22, Sprite: 'white'}
]

var Player = {
    X: screenWidth / 2 - EntityHeight / 2,
    Y: 0,
    HP: 100,
    Height: EntityHeight,
    Width: EntityWidth,
    Pics: [],
    hPics: [],
    SpeedX: 0,
    SpeedY: 0,
    left: 0,
    right: 0,
    Weapon: allWeapons[0],
    AngleOfSight: 0,
    offset: 0,
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
            for (i = 0; i < maxEnemies; i++){
                Enemies[i] = {
                    X: 250 * -i,
                    Y: 0,
                    HP: 3,
                    ePic: new Image(),
                    Width: 40 * 1.2,
                    Height: EntityHeight,
                    Weapon: allWeapons[Math.floor(randomNumber(0, 2))],
                    AngleOfSight: 1,
                    SpeedY: 0,
                    offset: 20,
                }
            }
        }

        ePic.onload = function() {
            for (i = 0; i < maxEnemies; i++) {
                Enemies[i].ePic = ePic; 
            }
        }
        
        for (i = 1; i <= 6; i++) {
            Player.Pics[i] = pPics[i]
            console.log('images/' + i + 'gg.png')
        }

        for (i = 1; i <= 7; i++) {
            Player.hPics[i] = hPics[i]
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
    playerShoot()
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
            if ((isOnFloor(Player) === "floor") || (isOnFloor(Player) === "object")) {
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
    bulletMove();
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
    canvasContext.save()
    if (reflection(MouseX, Player.X + EntityWidth / 2)){
        canvasContext.translate(Player.X, Player.Y);
        canvasContext.drawImage(Player.Pics[Math.round(MoveFrame / 10)], 0, 0, Player.Width, Player.Height);
    } else {
        canvasContext.translate(Player.X + EntityWidth / 2, Player.Y);
        canvasContext.scale(-1,1)
        canvasContext.drawImage(Player.Pics[Math.round(MoveFrame / 10)], -EntityWidth / 2, 0, Player.Width, Player.Height);
        canvasContext.scale(-1,1)
    }
    canvasContext.restore()
    drawWeapon(Player.Weapon, Player.X, Player.Y, Player.AngleOfSight, reflection(MouseX, Player.X + EntityWidth / 2), Player.offset)
}

function drawEnemies() {
    for (let i = 0; i < maxEnemies; i++){
        Enemies[i].AngleOfSight = aimPlayer(Enemies[i]) 
        canvasContext.save()
        if (reflection(Player.X, Enemies[i].X + 40 / 2)){
            canvasContext.translate(Enemies[i].X, Enemies[i].Y);
            canvasContext.drawImage(Enemies[i].ePic, 0, 0, Enemies[i].Width, Enemies[i].Height);
        } else {
            canvasContext.translate(Enemies[i].X + 40 / 2, Enemies[i].Y);
            canvasContext.scale(-1,1)
            canvasContext.drawImage(Enemies[i].ePic, -40 / 2, 0, Enemies[i].Width, Enemies[i].Height);
            canvasContext.scale(-1,1)
        }
        canvasContext.restore()
        drawWeapon(Enemies[i].Weapon, Enemies[i].X, Enemies[i].Y, Enemies[i].AngleOfSight, reflection(Player.X + EntityWidth / 2, Enemies[i].X + EntityWidth / 2), Enemies[i].offset)
    }
}

function drawWeapon(Weapon, X, Y, angle, isRefl, offset) {
    canvasContext.fillStyle = Weapon.Sprite;
    if (isRefl) {
        X = X + EntityWidth / 4 - offset
        Y = Y + 45 + offset / 2
        canvasContext.save()
        canvasContext.translate(X, Y);
        canvasContext.rotate(-angle);
        canvasContext.drawImage(Player.hPics[Math.round(ShotFrame / 10)], 0, 0, Weapon.Width, Weapon.Height);
    }
    else {
        X = X + EntityWidth / 1.3 - offset
        Y = Y + 45 + offset / 2
        canvasContext.save()
        canvasContext.translate(X, Y);
        canvasContext.scale(-1,1)
        canvasContext.rotate(-angle);
        canvasContext.drawImage(Player.hPics[Math.round(ShotFrame / 10)], 0, 0, Weapon.Width, Weapon.Height);
    }
    canvasContext.restore();
    if (ShotFrame != 10) {
        ShotFrame++
        if (ShotFrame == 70) {
            ShotFrame = 10
        }
    }
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

function isOnFloor(Entity) {
    if (Entity.Y + Entity.Height >= screenHeight) {
        return("floor")
    } else {
        for (i = 0; i < NumOfObjects; i++) {
            if ((Entity.Y + Entity.Height > Objects[i].Y - 0.11) && (Entity.Y < Objects[i].Y)){
                if (((Entity.X + Entity.Width >= Objects[i].X) && (Entity.X <= Objects[i].X + Objects[i].Width))) {
                    onObj = i
                    return("object")
                }
            }
        }
    }
    return('none')
}

function PlayerMove() {
    MoveY(Player)
    PlayerMoveX()
}

function PlayerMoveX(){
    if ((MoveFrame != 60) && (Player.SpeedX != 0)) {
        MoveFrame++
    } else {
        MoveFrame = 10
    }
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

function MoveY(Entity){
    Entity.Y -= Entity.SpeedY
    if (Entity.SpeedY > 0) {
        if (isOnFloor(Entity) === "object") {
            Entity.Y = Objects[onObj].Y + Objects[onObj].Height + 1
            Entity.SpeedY = 0;
        } else {
            Entity.SpeedY -= 0.5 
        }
    } else {
        if (isOnFloor(Entity) === "floor"){
            Entity.Y = screenHeight - Entity.Height
            Entity.SpeedY = 0;
        } else {
            if (isOnFloor(Entity) === "object") {
                Entity.Y = Objects[onObj].Y - Entity.Height - 0.1
                Entity.SpeedY = 0;
            } else {
                Entity.SpeedY -= 0.5 
            }
        }
    }
}

function bulletMove() {
    for (b = 0; b < bn; b++) {
        for (s = 0; s < bullet[b].Speed; s++) {
            canvasContext.beginPath();
            canvasContext.moveTo(bullet[b].X , bullet[b].Y);
            canvasContext.strokeStyle = 'yellow'
            canvasContext.lineTo(bullet[b].X + 1, bullet[b].Y + 1);
            canvasContext.stroke();
            bullet[b].X += Math.cos(Player.AngleOfSight) * Math.sign(MouseX - Player.X)
            bullet[b].Y -= Math.sin(Player.AngleOfSight)
            for (e = 0; e < maxEnemies; e++) {
                if ((bullet[b].X >= Enemies[e].X) && (bullet[b].X <= Enemies[e].X + Enemies[e].Width) && (bullet[b].Y >= Enemies[e].Y) && (bullet[b].Y <= Enemies[e].Y + Enemies[e].Height)){
                    bullet[b].X = screenWidth + 1
                    Enemies[e].HP--
                    console.log(Enemies[e].HP)
                }
            }
            for (e = 0; e < NumOfObjects; e++) {
                if ((bullet[b].X >= Objects[e].X) && (bullet[b].X <= Objects[e].X + Objects[e].Width) && (bullet[b].Y >= Objects[e].Y) && (bullet[b].Y <= Objects[e].Y + Objects[e].Height)){
                    bullet[b].X = screenWidth + 1
                }
            }
            if ((bullet[b].X < 0) || (bullet[b].X > screenWidth) || (bullet[b].Y > screenHeight) || (bullet[b].Y < 0)){
                bullet[b].Speed = 0;
            }
        }
    }
}

function playerShoot() {
    if (ShotFrame == 10) {
        ShotFrame++
        bullet[bn] = {
            X: Player.X + Player.Width / 2 + Math.cos(Player.AngleOfSight) * Math.sign(MouseX - Player.X) * 50 - 25 * Math.sign(MouseX - Player.X) ,
            Y: Player.Y + Player.Height / 2 - Math.sin(Player.AngleOfSight) * 50 - 10,
            Angle: Player.AngleOfSight,
            Speed: 100,
            shot: new Audio('sounds/shot.mp3'),
        }
        bullet[bn].shot.play()
        bn++
        if (bn == maxBullets) {
            bn = 0
        }
    }
}

function updateFrame() {
    //Тут потом будут двигаться крипы
    for (e=0; e < maxEnemies; e++){
        MoveY(Enemies[e])
        if (isOnFloor(Enemies[e]) != "none") {
            //Enemies[e].SpeedY = maxSpeedY
        }
    }
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
