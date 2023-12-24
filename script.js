var canvasContext = document.getElementById('canvas').getContext('2d')
const screenWidth = window.screen.width
const screenHeight = window.screen.height 
const left = 'a'
const right = 'd'
const up = 'w'
const maxSpeedX = 8
const maxSpeedY = 20
const EntityWidth = 71*1.2
const EntityHeight = 100*1.2
const NumOfObjects = 1000
const maxEnemies = 50
const maxBullets = 50
const deathFrames = 9
var song = new Audio('sounds/song.mp3')
var pPics = []
var click = 0
for (i = 1; i <= 6; i++) {
    pPics[i] = new Image()
    pPics[i].src = 'images/gg/gg' + i + '.png'
}
var pistolPics = []
for (i = 1; i <= 7; i++) {
    pistolPics[i] = new Image()
    pistolPics.src = 'images/pistol/pistol' + i + '.png'
}

{//Раздел переменных
    var AllAmmo = 120
    var M4Ammo = 30
    var PistolAmmo = 7
    var MoveFrame = 10
    var Enemies = []
    var bullet = []
    var tracing = []
    var Objects = []
    var collObj = 0
    var onObj = 0
    var missionStartX
    var missionStartY
    var backGroundPic = new Image()
    var MouseX
    var MouseY
    var bn = 0
    var tn = 0
    backGroundPic.src = 'images/back.jpg'

}//Конец раздела переменных

{//Раздел объектов

    var mission = {
        Width: screenWidth * 3,
        Height: screenHeight,
    }

    var allWeapons = [ //Оружие
        {Name: 'pistol', Damage: 1, Width: 62, Height: 22, Sprite: [], maxFrames: 7, NF: 2, offsetX: 22, reloadFrames: 11}, 
        {Name: 'm4', Damage: 1, Width: 96, Height: 33, Sprite: [], maxFrames: 11, NF: 5, offsetX: 30, reloadFrames: 15}
    ]

    for (i = 1; i <= 7; i++) { //Загрузка спрайтов анимации пистолета
        allWeapons[0].Sprite[i] = new Image()
        allWeapons[0].Sprite[i].src = 'images/pistol/pistol' + i + '.png'
    }
    for (i = 7 + 1; i <= 7 + 11; i++) { //Загрузка спрайтов анимации перезарядки пистолета
        allWeapons[0].Sprite[i] = new Image()
        allWeapons[0].Sprite[i].src = 'images/pistol/pistolReload/reload' + (i - 7)+ '.png'
    }

    for (i = 1; i <= 11; i++) { //Загрузка спрайтов анимации M4
        allWeapons[1].Sprite[i] = new Image()
        allWeapons[1].Sprite[i].src = 'images/m4/m4' + i + '.png'
    }

    for (i = 11 + 1; i <= 11 + 15; i++) { //Загрузка спрайтов анимации перезарядки M4
        allWeapons[1].Sprite[i] = new Image()
        allWeapons[1].Sprite[i].src = 'images/m4/ReloadM4/reload' + (i - 11) + '.png'
    }

    var Player = { //Игрок
        X: screenWidth / 2 - EntityHeight / 2,
        Y: 0,
        HP: 100,
        Height: EntityHeight,
        Width: EntityWidth,
        Pics: pPics,
        SpeedX: 0,
        SpeedY: 0,
        left: 0,
        right: 0,
        Weapon: allWeapons[1],
        AngleOfSight: 0,
        offsetX: allWeapons[1].offsetX,
        ShotFrame: 10,
    }

    function initEnemies(){ //Враги
        for (i = 0; i < maxEnemies; i++){
            NWeapon = Math.floor(randomNumber(0, 2))
            if (Math.round(randomNumber()) == 0) {
                S = maxSpeedX
            } else {
                S = -maxSpeedX
            }
            NWeapon = 0
            Enemies[i] = {
                X: 250 * -i,
                Y: 0,
                HP: 3,
                ePic: [],
                Width: 40 * 1.2,
                Height: EntityHeight,
                Weapon: allWeapons[NWeapon],
                AngleOfSight: 0,
                SpeedY: 0,
                offsetX: allWeapons[NWeapon].offsetX,
                ShotFrame: 10,
                deathFrame: 10,
                deathScale: 'true',
                Active: false,
                SpeedX: S
            }
        }
    }

    function initObjects(){ //Объекты
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

    {//Раздел генерации и установок 

        function initAll() {
            initObjects()
            initEnemies()
            for (i = 0; i < maxEnemies; i++) {
                Enemies[i].ePic[0] = new Image()
                Enemies[i].ePic[0].src = 'images/bot.png'
                for (j = 1; j <= deathFrames; j++) {
                    Enemies[i].ePic[j] = new Image()
                    Enemies[i].ePic[j].src = 'images/bot/death/death' + j + '.png'
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
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", mouseup)
        window.addEventListener("mousedown", mousedown)
        window.addEventListener("keydown", keyDown)
        window.addEventListener("keyup", keyUp)
        document.addEventListener("keydown", setWindow)
    }

    function mousemove(event) {
        Player.AngleOfSight = Math.asin(((Player.Y + 45) - event.clientY) / Math.sqrt(Math.pow(event.clientX - (Player.X + Player.Width / 2), 2) + Math.pow(event.clientY - (Player.Y + 45), 2)))
        if (Player.AngleOfSight > 0.5) {
            Player.AngleOfSight = 0.5
        }
        if (Player.AngleOfSight < -0.5) {
            Player.AngleOfSight = -0.5
        }
        MouseX = event.clientX;
    }

    function mousedown(event) {
        if (Player.Weapon.Name == 'm4') {
            click = 1
        } else {
            playerShoot()
        }
    }

    function mouseup(event) {
        click = 0
    }

    function keyDown(event) {
        switch(event.key) {
            case right:
                Player.SpeedX = maxSpeedX
                Player.right = 1
                break
            case left:
                Player.SpeedX = -maxSpeedX
                Player.left = 1
                break
            case up: 
                if ((isOnFloor(Player) === "floor") || (isOnFloor(Player) === "object")) {
                    Player.SpeedY = maxSpeedY
                }
                break
            case '1':
                if (Player.ShotFrame == 10) {
                    Player.Weapon = allWeapons[0]
                    Player.offsetX = allWeapons[0].offsetX
                }
                break
            case '2':
                if (Player.ShotFrame == 10) {
                    Player.Weapon = allWeapons[1]
                    Player.offsetX = allWeapons[1].offsetX
                }
                break
            case 'r':
                if (Player.ShotFrame == 10) {
                    reload()
                }
        }
    }

    function keyUp(event) {
        switch (event.key) {
            case right:
                Player.right = 0
                if (Player.left === 1) {
                    Player.SpeedX = -maxSpeedX
                } else {
                    Player.SpeedX = 0
                }
                break
            case left: 
                Player.left = 0;
                if (Player.right === 1) {
                    Player.SpeedX = maxSpeedX
                } else {
                    Player.SpeedX = 0
                }
                break
        }
    }

}//Конец раздела ивентов


{//Раздел отрисовки

    function drawInterface() {

    }

    function drawFrame() {
        drawBackground()
        drawPlayer()
        drawEnemies()
        drawAllObjects()
        bulletMove()
    }

    function drawAllObjects(){
        canvasContext.fillStyle = "white"
        for (let i=0; i<NumOfObjects; i++){
            canvasContext.fillRect(Objects[i].X, Objects[i].Y, Objects[i].Width, Objects[i].Height)
        }
    }

    function drawBackground() {
        canvasContext.drawImage(backGroundPic, 0, 0)
    }

    function drawPlayer() {
        canvasContext.save()
        if (reflection(MouseX, Player.X + Player.Width / 2)){
            canvasContext.translate(Player.X, Player.Y)
            canvasContext.drawImage(Player.Pics[Math.round(MoveFrame / 10)], 0, 0, Player.Width, Player.Height)
        } else {
            canvasContext.translate(Player.X + Player.Width / 2, Player.Y)
            canvasContext.scale(-1,1)
            canvasContext.drawImage(Player.Pics[Math.round(MoveFrame / 10)], - Player.Width / 2, 0, Player.Width, Player.Height)
            canvasContext.scale(-1,1)
        }
        canvasContext.restore()
        if (Player.Weapon.Name == 'pistol') {
            drawWeapon(Player.Weapon, Player.X, Player.Y, Player.AngleOfSight, reflection(MouseX, Player.X + Player.Width / 2), Player.offsetX, Player.ShotFrame, Player.Height, Player.Width, 0)
        } else {
            drawWeapon(Player.Weapon, Player.X, Player.Y, Player.AngleOfSight, reflection(MouseX, Player.X + Player.Width / 2), Player.offsetX, Player.ShotFrame, Player.Height, Player.Width, 10)
        }
    }

    function drawEnemies() {
        for (let i = 0; i < maxEnemies; i++){
            if (Enemies[i].HP > 0) {
                Enemies[i].AngleOfSight = aimPlayer(Enemies[i]) 
                canvasContext.save()
                if (reflection(Player.X, Enemies[i].X + 40 / 2)){
                    canvasContext.translate(Enemies[i].X, Enemies[i].Y)
                    canvasContext.drawImage(Enemies[i].ePic[0], 0, 0, Enemies[i].Width, Enemies[i].Height)
                } else {
                    canvasContext.translate(Enemies[i].X + 40 / 2, Enemies[i].Y)
                    canvasContext.scale(-1,1)
                    canvasContext.drawImage(Enemies[i].ePic[0], -40 / 2, 0, Enemies[i].Width, Enemies[i].Height)
                    canvasContext.scale(-1,1)
                }
                canvasContext.restore()
                drawWeapon(Enemies[i].Weapon, Enemies[i].X, Enemies[i].Y, Enemies[i].AngleOfSight, reflection(Player.X + Player.Width / 2, Enemies[i].X + Player.Width / 2), Enemies[i].offsetX, Enemies[i].ShotFrame, Enemies[i].Height, Enemies[i].Width, 0)
            } else {
                canvasContext.save()
                if (Enemies[i].deathFrame == 10) {
                    Enemies[i].deathScale = reflection(Player.X, Enemies[i].X + 40 / 2)
                }
                if (Enemies[i].deathScale){
                    if (Enemies[i].deathFrame == 10) {
                        Enemies[i].X -= Enemies[i].Width + 92
                    }
                    canvasContext.translate(Enemies[i].X, Enemies[i].Y)
                    canvasContext.drawImage(Enemies[i].ePic[Math.round(Enemies[i].deathFrame / 10)], 0, -14, Enemies[i].Width + 92, Enemies[i].Height + 14)
                } else {
                    if (Enemies[i].deathFrame == 10) {
                        Enemies[i].X += Enemies[i].Width + 92
                    }
                    canvasContext.translate(Enemies[i].X + 40 / 2, Enemies[i].Y)
                    canvasContext.scale(-1,1)
                    canvasContext.drawImage(Enemies[i].ePic[Math.round(Enemies[i].deathFrame / 10)], -40 / 2, -14, Enemies[i].Width + 92, Enemies[i].Height + 14)
                    canvasContext.scale(-1,1)
                }
                if (Enemies[i].deathFrame < 90) {
                    Enemies[i].deathFrame += 2
                }
                canvasContext.restore()
            }
        }
    }

    function drawWeapon(Weapon, X, Y, angle, isRefl, offsetX, ShotFrame, Height, Width, offsetY) {
        X = X + Width / 2
        Y += Height - 70 - offsetY
        if (isRefl) {
            canvasContext.save()
            canvasContext.translate(X - offsetX, Y)
            canvasContext.rotate(-angle)
            canvasContext.drawImage(Weapon.Sprite[Math.floor(ShotFrame / 10)], 0, 0, Weapon.Width, Weapon.Height)
        }
        else {
            canvasContext.save()
            canvasContext.translate(X + offsetX, Y)
            canvasContext.scale(-1,1)
            canvasContext.rotate(-angle)
            canvasContext.drawImage(Weapon.Sprite[Math.floor(ShotFrame / 10)], 0, 0, Weapon.Width, Weapon.Height)
        }
        canvasContext.restore();
    }

}//Конец раздела отрисовки

{//Раздел механик

    function reload() {
        if (Player.Weapon.Name == 'm4') {
            Player.ShotFrame = (11 + 1) * 10
            if (AllAmmo >= 30) {
                AllAmmo -= 30 - M4Ammo
                M4Ammo = 30
            } else {
                M4Ammo = AllAmmo
                AllAmmo = 0
            }
        }
        if (Player.Weapon.Name == 'pistol') {
            Player.ShotFrame = (7 + 1) * 10
            PistolAmmo = 7 
        }
    }

    function aimPlayer(Enemy) {
        Angle = Math.asin(((Enemy.Y ) - Player.Y) / Math.sqrt(Math.pow(Player.X - (Enemy.X + Enemy.Width / 2), 2) + Math.pow(Player.Y - (Enemy.Y + 45), 2)))
        if (Angle > 0.5) {
            Angle = 0.5
        }
        if (Angle < -0.5) {
            Angle = -0.5
        }
        return(Angle)
    }
    
    function reflection(X1, X2) {
        if ((X1 - X2) > 0) {
            return(true)
        }
        return(false)
    }
    
    function randomNumber(min, max) {
        return (Math.random() * (max - min) + min)
    }
    
    function isCollision(Entity) {
        for (let i=0; i < NumOfObjects; i++){
            if ((Entity.Y + Entity.Height >= Objects[i].Y) && (Entity.Y <= Objects[i].Y + Objects[i].Height)){
                if ((Entity.X + Entity.Width >= Objects[i].X) && (Entity.X <= Objects[i].X + Objects[i].Width)){
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
                if (!isCollision(Player)){
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
                if (!isCollision(Player)){
                    for (j = 0; j < maxEnemies; j++){
                        Enemies[j].X--
                    }
                    for (j = 0; j < NumOfObjects; j++){
                        Objects[j].X--
                    }
                }
            }
        }
        if (isCollision(Player)) {
            if (Player.SpeedX < 0) {
                for (i = Player.SpeedX; i != 0; i+=1) {
                    for (j = 0; j < maxEnemies; j++) {
                        Enemies[j].X-=0.25
                    }
                    for (j = 0; j < NumOfObjects; j++) {
                        Objects[j].X-=0.25
                    }
                }
            }
            if (Player.SpeedX > 0) {
                for (i = Player.SpeedX; i != 0; i-=1) {
                    for (j = 0; j < maxEnemies; j++) {
                        Enemies[j].X+=0.25
                    }
                    for (j = 0; j < NumOfObjects; j++) {
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
                Entity.SpeedY = 0
            } else {
                Entity.SpeedY -= 0.5 
            }
        } else {
            if (isOnFloor(Entity) === "floor"){
                Entity.Y = screenHeight - Entity.Height
                Entity.SpeedY = 0
            } else {
                if (isOnFloor(Entity) === "object") {
                    Entity.Y = Objects[onObj].Y - Entity.Height - 0.1
                    Entity.SpeedY = 0
                } else {
                    Entity.SpeedY -= 0.5 
                }
            }
        }
    }
    
    function bulletMove() {
        for (b = 0; b < bn; b++) {
            for (s = 0; s < bullet[b].Speed; s++) {
                bullet[b].X += Math.cos(bullet[b].Angle) * bullet[b].dir
                bullet[b].Y -= Math.sin(bullet[b].Angle)
                canvasContext.beginPath();
                canvasContext.moveTo(bullet[b].X , bullet[b].Y);
                canvasContext.strokeStyle = 'yellow'
                canvasContext.lineTo(bullet[b].X + 1, bullet[b].Y + 1);
                canvasContext.stroke();
                for (e = 0; e < maxEnemies; e++) {
                    if ((bullet[b].X >= Enemies[e].X - Enemies[e].Width / 6) && (bullet[b].X <= Enemies[e].X + Enemies[e].Width) && (bullet[b].Y >= Enemies[e].Y) && (bullet[b].Y <= Enemies[e].Y + Enemies[e].Height) && (Enemies[e].HP > 0)){
                        bullet[b].X = screenWidth + 1
                        Enemies[e].HP--
                    }
                    if ((bullet[b].X >= Player.X - Player.Width / 6) && (bullet[b].X <= Player.X + Player.Width) && (bullet[b].Y >= Player.Y) && (bullet[b].Y <= Player.Y + Player.Height) && (Player.HP > 0)){
                        bullet[b].X = screenWidth + 1
                        Player.HP--
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
        if (((Player.Weapon.Name == 'pistol') && (PistolAmmo > 0)) || ((Player.Weapon.Name == 'm4') && (M4Ammo > 0))) {
            if (Player.ShotFrame == 10) {
                Player.ShotFrame += Player.Weapon.NF
                if (Math.sign(MouseX - Player.X) > 0) {
                    Width = Player.Width
                } else {
                    Width = -20
                }
                if (Math.sign(MouseX - Player.X) > 0) {
                    X0 = 0
                } else {
                    X0 = Player.Width
                }
                bullet[bn] = {
                    X: Player.X + X0 + Math.cos(Player.AngleOfSight) * 100 * Math.sign(MouseX - Player.X) + 15 * Math.sign(MouseX - Player.X),
                    Y: Player.Y + Player.Height - 70 - Math.sin(Player.AngleOfSight) * 101,
                    Angle: Player.AngleOfSight,
                    Speed: 100,
                    shot: new Audio('sounds/shot.mp3'),
                    dir: Math.sign(MouseX - Player.X)
                }
                if (Player.Weapon.Name == 'm4') {
                    M4Ammo--
                }
                if (Player.Weapon.Name == 'pistol') {
                    PistolAmmo--
                }
                bullet[bn].shot.play()
                bn++
                if (bn > maxBullets) {
                    bn = 1
                }
            }
        } 
    }
    
    function isActive(index) {
        if (Enemies[index].HP <= 0){
            return(false)
        }
        if (Math.abs(Player.X - Enemies[index].X) < screenWidth / 2) {
            return(true)
        }
        return(false)
    }
    
    function moveEnemy(Enemy) {
        Enemy.X += Enemy.SpeedX
        if (isCollision(Enemy)){
            Enemy.SpeedX = -Enemy.SpeedX
        }
        if (Math.round(randomNumber(0, 50)) == 50) {
            Enemy.SpeedX = -Enemy.SpeedX
        }
        if ((Math.round(randomNumber(0, 50)) == 50) && (isOnFloor(Enemy) == "floor" || isOnFloor(Enemy) == "object")) {
            Enemy.SpeedY = maxSpeedY
        }
    }
    
    function enemyShoot(index) {
            if (Enemies[index].ShotFrame == 10) {
                Enemies[index].ShotFrame += Enemies[index].Weapon.NF
                if (Math.sign(Player.X - Enemies[index].X) > 0) {
                    Width = Enemies[index].Width
                } else {
                    Width = -20
                }
                if (Math.sign(Player.X - Enemies[index].X) > 0) {
                    X0 = 0
                } else {
                    X0 = Enemies[index].Width
                }
                bullet[bn] = {
                    X: Enemies[index].X + X0 + Math.cos(Enemies[index].AngleOfSight) * 100 * Math.sign(Player.X - Enemies[index].X) + 15 * Math.sign(Player.X - Enemies[index].X),
                    Y: Enemies[index].Y + Enemies[index].Height - 70 - Math.sin(Enemies[index].AngleOfSight) * 101,
                    Angle: Enemies[index].AngleOfSight + randomNumber(-0.15, 0.15),
                    Speed: 100,
                    shot: new Audio('sounds/shot.mp3'),
                    dir: Math.sign(Player.X - Enemies[index].X)
                }
                bullet[bn].shot.play()
                bn++
                if (bn > maxBullets) {
                    bn = 1
                }
            }
    }

}//Конец раздела механик

function updateFrame() {
    for (e=0; e < maxEnemies; e++){
        MoveY(Enemies[e])
        Enemies[e].Active = isActive(e)
        if (Enemies[e].Active == true) {
            moveEnemy(Enemies[e])
            enemyShoot(e)
        }
    }
    PlayerMove()
    if (click == 1) {
        playerShoot()
    }
    if (Player.ShotFrame !== 10) {
        Player.ShotFrame += Player.Weapon.NF
        if (Player.ShotFrame == Player.Weapon.maxFrames * 10) {
            Player.ShotFrame = 10
        }
        if (Player.ShotFrame == (Player.Weapon.maxFrames + Player.Weapon.reloadFrames) * 10) {
            Player.ShotFrame = 10
        }
    }
    for (i = 0; i < maxEnemies; i++){
        if (Enemies[i].ShotFrame !== 10){
            Enemies[i].ShotFrame += Enemies[i].Weapon.NF
            if (Enemies[i].ShotFrame == Enemies[i].Weapon.maxFrames * 10) {
                Enemies[i].ShotFrame = 10
            }
        }
    }
}

function play() {
    Objects[0].Height = 500
    Objects[0].Width = 10
    updateFrame()
    drawFrame()
    requestAnimationFrame(play)
    //song.play()
}

initAll()
play()
initEventListeners()