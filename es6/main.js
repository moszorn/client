const canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      canvasCenterX = ctx.canvas.width/2,
      canvasCenterY = ctx.canvas.height/2,
      competition = document.querySelector('#competition');
      competition.addEventListener('click',auctionBridge,false);
      canvas.ctx = ctx;


import {auctionBridge} from './noncanvas';
import {assets} from "./assets";
import {mousePointer} from "./MousePointer";
import {stage,text,group,render,imageSprite,card,cardBack} from './sprite';
import {dealerFun,cardsSort,dealer} from './shuffler';
import {STATUS,SEAT,PLAYER,gameManager} from './bridge';

/********************************************************************************/
const socket =new WebSocket('ws://localhost:8181');
socket.onopen = (e)=> console.log('[%con open%c]建立連線','color:pink','color:black');
socket.onclose= (e)=> console.log('[%con close%c]','color:green','color:black');
socket.onerror= (e)=> console.log('[%con error%c]' ,'color:red','color:black');
socket.onmessage= (msgjson)=>{
    let {type, id, nick, message} = JSON.parse(msgjson.data);
    console.log(' type= %c%o, %c id= %c%o, %c nick= %c%o , %c message= %c%o','color:blue',type,'color:#555','color:blue',id,'color:#555','color:blue',nick,'color:#555','color:blue',message);
    switch(type){
        case STATUS.close:close({code:1000,reason:'關閉連線'}); break;
        case STATUS.start:start(message);break;
        case STATUS.assignSeat:  playerSeat = id ; break;
        case STATUS.auctionBridge: /* auctionBridge(message); */break;
        case STATUS.firstLead: /**/ break;
    }
};
function sent2Server(type,id,nick,message){
    if(socket.readyState != WebSocket.OPEN) return false;
    let tosend =  Object.prototype;
    Object.assign(tosend,{type,id,nick,message,time:Date.now()});
    console.info(`%c[send] %o`,'color:brown', tosend);
    socket.send(JSON.stringify(tosend));
}
/********************************************************************************/
assets.load(["images/poker.json","images/poker.png","images/overlay.png","images/bluecover.png","images/bluecoverR.png"]).then(() => setup());
let TABLE ,CARD_BACK ,CARD_RACK ;
let playerSeat , ME=[],SOURTH = [],NORTH = [] ,west , east , NORTH_COVERS=[],WEST_COVERS=[], EAST_COVERS =[], pointer;
let shuffler = dealerFun();

function start(suite){
    shuffler.shuffCtxShift().then(()=>{
        xs.style.display='none';
        for(let u of dealer._n) NORTH_COVERS.push(cardBack(CARD_BACK,0,0,u[0],u[1]));
        for(let u of dealer._w) WEST_COVERS.push(cardBack(CARD_RACK,0,0,u[0],u[1]));
        for(let u of dealer._e) EAST_COVERS.push(cardBack(CARD_RACK,0,0,u[0],u[1]));
     SOURTH = dealer.dealSourth(suite);
    });
}
function close(o){
    socket.close(o.code,o.reason);
}

function setup(){
 // let src = assets["images/poker.json"];
    TABLE = assets["images/overlay.png"];
    CARD_BACK =  assets['images/bluecover.png'];
    CARD_RACK =  assets['images/bluecoverR.png'];
    pointer = mousePointer(canvas);
    gameLoop();

    let fromSocket = ['d1','s1','c13','d4','s6','c10','h13','h2','d5','c4','s11','h9','d3'];

    shuffler.shuffCtxShift().then(()=>{
        xs.style.display='none';
        //for(let u of dealer._n) NORTH_COVERS.push(cardBack(CARD_BACK,0,0,u[0],u[1]));
        for(let u of dealer._w) WEST_COVERS.push(cardBack(CARD_RACK,0,0,u[0],u[1]));
        for(let u of dealer._e) EAST_COVERS.push(cardBack(CARD_RACK,0,0,u[0],u[1]));
        startGame(fromSocket);
    });
}

window.sec = 0;
var btn = document.querySelector('#destroy'),btn2 = document.querySelector('#dispatch');
btn.addEventListener('click',()=>{
    gameManager.destroy(window.sec);
    west.destroy(-1);
    east.destroy(-1);
},false);
btn2.addEventListener('click',btnDispatch,false);

function btnDispatch(){
    west = card(assets["images/poker.json"].frames["s7"],"s7");
    west.rotation = 1.58002;
    west.x = 0; west.y = 350;
    WEST_COVERS.pop().destroy();

    east = card(assets["images/poker.json"].frames["d12"],"d12");
    east.rotation = 1.58002;
    east.x = canvas.width - 170;east.y = 350;
    EAST_COVERS.pop().destroy();
}



function gameLoop(){
    requestAnimationFrame(gameLoop);

    gameManager.pushCurrent(gameManager.updateNorth(pointer,canvas,NORTH),gameManager.updateSourth(pointer,canvas,SOURTH));

    if(west){
        if(west.x < 560)   west.x += 40;
        if(west.rotation > 0) west.rotation += -0.0791;
    }
    if(east){
        if(east.x > 850)   east.x -= 40;
        if(east.rotation > 0) east.rotation += -0.0791;
    }
    render(TABLE,canvas);
}

function startGame(suite){
    NORTH = dealer.dealNorth(suite);
    SOURTH = dealer.dealSourth(suite);
}











































let N =[],E=[],S=[],W=[];
function dealNorth(){
 let coordinate = [];
    //partner card suite 坐落點y為 650 , x為 520 ~ 1040 間格為40
    for(var i = 520 ; i < 1040 ; i += 40)
    {
        coordinate.push([i,20]);
        N.push([i,20]);
        imageSprite(CARD_BACK,i,20);
    }
    console.log(`North 座標 :`);
    console.group();
    let strs = [];
    coordinate.forEach(c=>strs.push(`[${c[0]},${c[1]}]`));
    console.log('['+ strs.join(',') +']');
    console.groupEnd();
}

function dealSourth(){
    //[[520,650],[560,650],[600,650],[640,650],[680,650],[720,650],[760,650],[800,650],[840,650],[880,650],[920,650],[960,650],[1000,650]]
    //Player card suite 坐落點y為 650 , x為 520 ~ 1040 間格為40
    let coordinate = [];
    for(var i = 520 ; i < 1040 ; i += 40)
    {
        imageSprite(CARD_BACK,i,650);
        coordinate.push([i,650]);
    S.push([i,20]);
    }
    console.log(`Sourth 座標 :`);
    console.group();
    let strs = [];
    coordinate.forEach(c=>strs.push(`[${c[0]},${c[1]}]`));
    console.log('['+ strs.join(',') +']');
    console.groupEnd();
}

function dealWest(){
    //[[20,100],[20,130],[20,160],[20,190],[20,220],[20,250],[20,280],[20,310],[20,340],[20,370],[20,400],[20,430]]
    let coordinate = [];
    for(var i = 100 ; i < 490 ; i += 30) {
        imageSprite(CARD_RACK,20,i);
        coordinate.push([20, i]);
        W.push([20, i]);
    }
    console.log(`West 座標 :`);
    console.group();
    let strs = [];
    coordinate.forEach(c=>strs.push(`[${c[0]},${c[1]}]`));
    console.log('['+ strs.join(',') +']');
    console.groupEnd();
}

function dealEast(){
    //[[1410,100],[1410,130],[1410,160],[1410,190],[1410,220],[1410,250],[1410,280],[1410,310],[1410,340],[1410,370],[1410,400],[1410,430]]
    let coordinate = [];
    for(var i = 100 ; i < 490 ; i += 30) {
        imageSprite(CARD_RACK,ctx.canvas.width - 210, i);
        coordinate.push([ctx.canvas.width - 210, i]);
        E.push([ctx.canvas.width - 210, i]);
    }
    console.log(`East 座標 :`);
    console.group();
    let strs = [];
    coordinate.forEach(c=>strs.push(`[${c[0]},${c[1]}]`));
    console.log('['+ strs.join(',') +']');
    console.groupEnd();
}

function CardsInSea(){
    //海底置牌點
    let canvasCenterX = ctx.canvas.width/2,canvasCenterY = ctx.canvas.height/2,
        placeOffsetX = 60,placeOffsetY = 20,
        southCardPlacement = {x: canvasCenterX - placeOffsetX , y: canvasCenterY + placeOffsetY},
        northCardPlacement = {x: canvasCenterX - placeOffsetX , y: canvasCenterY - (placeOffsetY * 10)},
        westCardPlacement = {x: canvasCenterX - ( 3.5*placeOffsetX) , y: canvasCenterY - 120 },
        eastCardPlacement = {x: canvasCenterX + ( 1.5*placeOffsetX),  y: canvasCenterY - 120};

    ctx.drawImage(assets["images/poker.png"],600,0,120,174,
        southCardPlacement.x,
        southCardPlacement.y,
        120,174);

    ctx.drawImage(assets["images/poker.png"],1080,174,120,174,
        northCardPlacement.x,
        northCardPlacement.y,
        120,174);

    ctx.drawImage(assets["images/poker.png"],1320,522,120,174,
        westCardPlacement.x,
        westCardPlacement.y,
        120,174);

    ctx.drawImage(assets["images/poker.png"],960,522,120,174,
        eastCardPlacement.x,
        eastCardPlacement.y,
        120,174);
}


let sourth = [];
function cardSuite(src){
    var cards = ['d1','s1','c13','d4','s6','c10','h13','h2','d5','c4','s11','h9','d3'];
    cards.forEach(c=>sourth.push(card(src.frames[c],c)));
    console.log(`d1: %o`, sourth[0]);
}