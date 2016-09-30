const canvas = document.querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      canvasCenterX = ctx.canvas.width/2,
      canvasCenterY = ctx.canvas.height/2,
      competition = document.querySelector('#competition');
      competition.addEventListener('click',auctionBridge,false);
      canvas.ctx = ctx;
var btn = document.querySelector('#destroy'),btn2 = document.querySelector('#dispatch');

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
    btn.removeAttribute('disabled');
    btn2.removeAttribute('disabled');
}










































btn.addEventListener('click',()=>{
    gameManager.destroy(window.sec);
    west.destroy(-1);
    east.destroy(-1);
},false);
btn2.addEventListener('click',btnDispatch,false);

function btnDispatch(){
    const num1 = Math.floor(Math.random() * 13 ) + 1,
        num2 = Math.floor(Math.random() * 13 ) + 1;
    west = card(assets["images/poker.json"].frames["s"+num1],"s"+num1);
    west.rotation = 1.58002;
    west.x = 0; west.y = 350;
    WEST_COVERS.pop().destroy();

    east = card(assets["images/poker.json"].frames["d"+num2],"d"+num2);
    east.rotation = 1.58002;
    east.x = canvas.width - 170;east.y = 350;
    EAST_COVERS.pop().destroy();
}

