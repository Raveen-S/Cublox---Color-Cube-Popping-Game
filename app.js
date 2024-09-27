let container = document.querySelector('.container');
let lifeCountText = document.querySelector('.life-count');

let gameOverBoard = document.querySelector('.game-over-board');
let blackScreen = document.querySelector('.blackScreen');
let playAgain = document.querySelector('.play-again');
let home = document.querySelector('.home');

let liveScoreText = document.querySelector('.live-score');
let hScoreText = document.querySelector('.high-score');
let scoreText = document.querySelector('.end-score');

let menuBoard = document.querySelector('.menu-board');
let homeCube = document.querySelector('.home-cube');
let sfront = document.querySelector('.s-front');
let sback = document.querySelector('.s-back');
let stops = document.querySelector('.s-top');
let sbottom = document.querySelector('.s-bottom');
let sleft = document.querySelector('.s-left');
let sright = document.querySelector('.s-right');

let faces = document.querySelectorAll('.faces');

let rotAnim;

let hcSize = 120;
let hcSizeHalf = hcSize/2;

let fr = 0;
let bar = 180;
let tr = 90;
let bor = -90;
let lr = -90;
let rr = 90;

let HCRZ = 0;
let HCRX = 0;
let HCRY = 0;

let ht = 0;
let hv = 0;
let hl = 50;
let hm = 500;
let hi = 0;

let op = 1;

let highScore = 0;
let liveScore = 0;
let lifeCount = 10;
lifeCountText.textContent = lifeCount;
liveScoreText.textContent = `Score:${liveScore}`;

let cubeArray = [];
let numberOfCubes = 3;
let passForNextRound = false
let start = true;
let deadCount = 0;
let round = 1;

let roundInterval = 100;
let tick = 0;
let timePass = false;

let gameRunningAnimation;

let desolveCubePass = true;
let animatePass = true;
let playFromHomePass = true;
let homeEventPass = true;


//------------------------------Home Cube Set--------------------------------
homeCube.style.width = `${hcSize}`;
homeCube.style.height = `${hcSize}`;

sfront.style.transform = `rotateY(${fr}deg) translateZ(${hcSizeHalf}px)`;
sback.style.transform = `rotateY(${bar}deg) translateZ(${hcSizeHalf}px)`;
stops.style.transform = `rotateX(${tr}deg) translateZ(${hcSizeHalf}px)`;
sbottom.style.transform = `rotateX(${bor}deg) translateZ(${hcSizeHalf}px)`;
sleft.style.transform = `rotateY(${lr}deg) translateZ(${hcSizeHalf}px)`;
sright.style.transform = `rotateY(${rr}deg) translateZ(${hcSizeHalf}px)`;



function delay(ms){
    return new Promise( resolve => {
        setTimeout(()=> {resolve('')},ms);
    })
}


let IdNumber = 0;
function idGenerator(){
    let idName = `cube${IdNumber}`;
    IdNumber++;
    return idName;
}

let fcNumber = 0;
function faceIdGenerator(face){
    let idName = `${face}${fcNumber}`;
    fcNumber++;
    return idName;
}

let mouse = {
    clicked : false,
    x : undefined,
    y : undefined,
}

class CubeBuilder {
    
    constructor(){
        
        this.sizeArray = [30,40,50,50];
        this.sizeArray = [40,45,50,60];
        this.BrightnessArray = [65,60,55,50,45,40];
        
        this.size = this.sizeArray[Math.floor(Math.random()*this.sizeArray.length)];

        this.x = Math.floor(Math.random()*window.innerWidth);
        if((this.x + this.size) > window.innerWidth) this.x -= this.size;
        this.y = 0 - this.size*3;
        this.jumpHeight = Math.floor(Math.random()*window.innerHeight/4) + 2*window.innerHeight/3;
        this.i = 0;
        this.delay = Math.floor(Math.random()*100);
        this.delayCount = 0;

        this.sat = 100;
        this.hue = Math.floor(Math.random()*360);

        this.rotX = Math.floor(Math.random()*360);
        this.rotY = Math.floor(Math.random()*360);
        this.rotZ = Math.floor(Math.random()*360);

        this.reached = false;
        this.travelPass = true;
        this.rotatePass = true;
        this.breakPass = false;

        this.captured = false;

        this.deadMarked = false;
        this.addedToDeadCount = false;

        this.opacity = 1;
    }
    
    built(){
        this.cube = idGenerator();
        this.cube = document.createElement('div');
        this.cube.setAttribute("class","cube");
        this.cube.style.width = `${this.size}px`;
        this.cube.style.height = `${this.size}px`;
        
        
        this.front = faceIdGenerator('front')
        this.front = document.createElement('div');
        this.front.setAttribute("class","side front");
        this.front.style.transform = `rotateY(0deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.front);
        
        this.back = faceIdGenerator('back')
        this.back = document.createElement('div');
        this.back.setAttribute("class","side back");
        this.back.style.transform = `rotateY(180deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.back);
        
        this.tops = faceIdGenerator('tops')
        this.tops = document.createElement('div');
        this.tops.setAttribute("class","side tops");
        this.tops.style.transform = `rotateX(90deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.tops);
        
        this.bottom = faceIdGenerator('bottom')
        this.bottom = document.createElement('div');
        this.bottom.setAttribute("class","side bottom");
        this.bottom.style.transform = `rotateX(-90deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.bottom);
        
        this.left = faceIdGenerator('left')
        this.left = document.createElement('div');
        this.left.setAttribute("class","side left");
        this.left.style.transform = `rotateY(-90deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.left);
        
        this.right = faceIdGenerator('right')
        this.right = document.createElement('div');
        this.right.setAttribute("class","side right");
        this.right.style.transform = `rotateY(90deg) translateZ(${this.size/2}px)`;
        this.cube.appendChild(this.right);

        this.front.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[0]}%)`;
        this.back.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[1]}%)`;
        this.tops.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[2]}%)`;
        this.bottom.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[3]}%)`;
        this.left.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[4]}%)`;
        this.right.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.BrightnessArray[5]}%)`;

        this.cube.style.left = `${this.x}px`;
        this.cube.style.bottom = `${this.y}px`;

        this.cube.addEventListener('mouseover',(e)=>{
            this.travelPass = false;
            this.breakPass = true;
            this.captured = true;  	
        })

        container.appendChild(this.cube);
    }
    
    travel(){
        
        this.v = this.y;
        this.l = 100;
        this.t = this.l*2;
        this.rate = (this.v-this.jumpHeight)*(this.i-this.l)*(this.i-this.l)/((this.t-this.l)*(this.t-this.l)) + this.jumpHeight
        if(this.rate == this.jumpHeight){
            this.reached = true;
        }
        
        if(this.captured) this.deadMarked = true;

        if(this.reached && this.rate == this.y){
            this.sat = 0;
            this.travelPass = false;
            this.rotatePass = false;
            if(!this.deadMarked) {
                lifeCount --;
                this.deadMarked = true;
            }
        }
        

        lifeCountText.textContent = lifeCount;

        if(this.travelPass)this.cube.style.bottom = `${this.rate}px`;
        if(this.delayCount < this.delay)this.delayCount += 1;
        if(this.delayCount >= this.delay) this.i += 1;
        if(this.i>this.t)this.i = 0; 

        this.cube.style.transform = `rotateZ(${this.rotZ}deg) rotateY(${this.rotY}deg) rotateX(${this.rotX}deg)`;

        if(this.rotatePass){
            this.rotX += 2;
            this.roty += 4;
            this.rotZ += 2;
        }
        // coloring
        
    }
    
    break(){
        if(this.breakPass){
            this.cube.style.opacity = this.opacity;
            this.opacity -= 0.05;
        }
    }
    
    desolve(){
        this.cube.style.opacity = 0;
    }

}


async function callPlayAgain(){
    
    console.log('callPLayAgain');

    let opacity = 0;
    await delay(500);

    blackScreen.style.visibility = 'visible';
    blackScreen.style.opacity = opacity;

    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity += 0.01;
        await delay(5);
    }

    lifeCount = 10;
    cubeArray = [];
    numberOfCubes = 3;
    passForNextRound = false
    start = true;
    deadCount = 0;
    round = 1;

    roundInterval = 100;
    tick = 0;
    timePass = false;
    await delay(500);

    liveScore = 0;
    liveScoreText.textContent = `Score:${liveScore}`;

    gameOverBoard.style.opacity = 0;
    gameOverBoard.style.visibility = 'hidden';


    await delay(1500);



    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity -= 0.01;
        await delay(5);
    }
    blackScreen.style.visibility = 'hidden';
    animate();
}


function animate(){

    if(!animatePass) return
    console.log('animate');

    for(let i=0; i< cubeArray.length; i++){
        cubeArray[i].travel();
        cubeArray[i].break();
        if(cubeArray[i].deadMarked && !cubeArray[i].addedToDeadCount) {
            deadCount++;
            cubeArray[i].addedToDeadCount = true;
        }
    }
    
    if(deadCount == cubeArray.length) tick++;
    
    if(tick == roundInterval) {
        timePass = true;
        tick = 0;
    }
    
    if(deadCount == cubeArray.length && timePass){
        deadCount = 0;
        cubeArray = [];
        if(round%3 == 0)numberOfCubes++;
        round++;

        if(round>2) liveScore += (100 + 100*numberOfCubes + window.innerWidth);
        liveScoreText.textContent = `Score:${liveScore}`; 

        timePass = false;
        for(let i=0; i< numberOfCubes; i++){
            cubeArray.push(new CubeBuilder)
        }

        for(let i=0; i< cubeArray.length; i++){
            cubeArray[i].built();
        }
    }

    gameRunningAnimation = requestAnimationFrame(animate);

    if(lifeCount <= 0) {
        animatePass = false;
        cancelAnimationFrame(gameRunningAnimation)
        gameOver();
    };
}


async function gameOver(){

    console.log('gameOver');

    if(cubeArray.length == 0 ) return

    scoreText.style.color = `rgb(255, 255, 255)`; 
    scoreText.textContent = `Score:${liveScore}`; 
    highScore = localStorage.getItem('HS')
    if(liveScore > highScore){ 
        highScore = liveScore;
        localStorage.setItem('HS',highScore);
        scoreText.style.color = `rgb(255, 196, 0)`; 
        scoreText.textContent = `New Record`; 
    }
    let opacity = 0;
    gameOverBoard.style.opacity = opacity;
    hScoreText.textContent = `High Score:${highScore}`; 
    await delay(500);
    gameOverBoard.style.visibility = 'visible';
    
    for(let i=0;i<100;i++){
        gameOverBoard.style.opacity = opacity;
        opacity += 0.01;
        await delay(2);
    }
    await delay(500);
    for(let i=0;i<cubeArray.length;i++){
        cubeArray[i].desolve()
        await delay(50);
    }

    cubeArray = [];
    
}


async function backToHome(){
    console.log('backToHome');
    for(let i= 0; i < faces.length; i++){
        faces[i].style.opacity = 1;
    }
    hcSize = 120;
    hcSizeHalf = hcSize/2;
    fr = 0;
    bar = 180;
    tr = 90;
    bor = -90;
    lr = -90;
    rr = 90;

    sfront.style.transform = `rotateY(${fr}deg) translateZ(${hcSizeHalf}px)`;
    sback.style.transform = `rotateY(${bar}deg) translateZ(${hcSizeHalf}px)`;
    stops.style.transform = `rotateX(${tr}deg) translateZ(${hcSizeHalf}px)`;
    sbottom.style.transform = `rotateX(${bor}deg) translateZ(${hcSizeHalf}px)`;
    sleft.style.transform = `rotateY(${lr}deg) translateZ(${hcSizeHalf}px)`;
    sright.style.transform = `rotateY(${rr}deg) translateZ(${hcSizeHalf}px)`;

    HCRZ = 0;
    HCRX = 0;
    HCRY = 0;

    ht = 0;
    hv = 0;
    hl = 50;
    hm = 500;
    hi = 0;

    hcubeRotate();

    let opacity = 0;
    await delay(500);

    blackScreen.style.visibility = 'visible';
    blackScreen.style.opacity = opacity;
    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity += 0.01;
        await delay(5);
    }

    lifeCount = 10;
    cubeArray = [];
    numberOfCubes = 3;
    passForNextRound = false
    start = true;
    deadCount = 0;
    round = 1;

    roundInterval = 100;
    tick = 0;
    timePass = false;
    await delay(500);


    menuBoard.style.opacity = 1;
    menuBoard.style.visibility = 'visible';
    gameOverBoard.style.opacity = 0;
    gameOverBoard.style.visibility = 'hidden';


    await delay(1500);



    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity -= 0.01;
        await delay(5);
    }
    blackScreen.style.visibility = 'hidden';
    
}


function hcubeRotate(){
    console.log('homecubeRotate');
    let hTrvl = (hv-hm)*(hi-hl)*(hi-hl)/((ht-hl)*(ht-hl)) + hm
    homeCube.style.bottom = `${hTrvl}px`;

    hi++;
    if(hi == 2*hl)hi = 0;

    homeCube.style.transform = `rotateZ(${HCRZ}deg) rotateY(${HCRY}deg) rotateX(${HCRX}deg) translateX(-50%)`;
    
    HCRX += 1;
    HCRY += 2;
    HCRZ += 1;

    rotAnim  = requestAnimationFrame(hcubeRotate);
}



async function desolveCube(){

    if(!desolveCubePass) return

    console.log('desolveCube');
    let op = 1;
    
    for(let i= 0; i < 100; i++){
        for(let i= 0; i < faces.length; i++){
            faces[i].style.opacity = op;
        }
        op -= 0.01;
        hcSizeHalf += 1;
        
        fr += 0.1*2;
        bar+= 0.2*2;
        tr += 0.2*2;
        bor+= 0.1*2;
        lr += 0.2*2;
        rr += 0.1*2;
        
        sfront.style.transform = `rotateY(${fr}deg) translateZ(${hcSizeHalf}px)`;
        sback.style.transform = `rotateY(${bar}deg) translateZ(${hcSizeHalf}px)`;
        stops.style.transform = `rotateX(${tr}deg) translateZ(${hcSizeHalf}px)`;
        sbottom.style.transform = `rotateX(${bor}deg) translateZ(${hcSizeHalf}px)`;
        sleft.style.transform = `rotateY(${lr}deg) translateZ(${hcSizeHalf}px)`;
        sright.style.transform = `rotateY(${rr}deg) translateZ(${hcSizeHalf}px)`;
        
        await delay(10);
    }
    
    desolveCubePass = false;
}



async function playFromHome(){
    if(!playFromHomePass) return
    console.log('playFromHOme');

    let opacity = 0;
    await delay(500);
    
    blackScreen.style.visibility = 'visible';
    blackScreen.style.opacity = opacity;

    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity += 0.01;
        await delay(5);
    }

    lifeCount = 10;
    cubeArray = [];
    numberOfCubes = 3;
    passForNextRound = false
    start = true;
    deadCount = 0;
    round = 1;
    roundInterval = 100;
    tick = 0;
    timePass = false;

    await delay(500);

    menuBoard.style.opacity = 0;
    menuBoard.style.visibility = 'hidden';

    gameOverBoard.style.opacity = 0;
    gameOverBoard.style.visibility = 'hidden';


    for(let i=0; i< numberOfCubes; i++){
        cubeArray.push(new CubeBuilder)
    }
    for(let i=0; i< cubeArray.length; i++){
        cubeArray[i].built();
    }

    await delay(1500);

    for(let i=0;i<100;i++){
        blackScreen.style.opacity = opacity;
        opacity -= 0.01;
        await delay(5);
    }
    blackScreen.style.visibility = 'hidden';
    playFromHomePass = false;
    animate();
}


hcubeRotate();


playAgain.addEventListener('click',(e)=>{
    animatePass = true;
    callPlayAgain();
})

/* home.addEventListener('click',(e)=>{
    desolveCubePass = true;
    homeEventPass = true;
    backToHome();
}) */
home.addEventListener('click',(e)=>{
    window.location.reload();
})

homeCube.addEventListener('mouseover',(e)=>{
    if(!homeEventPass) return;
    homeEventPass = false;
    playFromHomePass =true;
    animatePass = true;
    cancelAnimationFrame(rotAnim);
    desolveCube();
    playFromHome();
})