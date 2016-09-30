
import {assets} from "./assets";
import {text,card,cardBack} from './sprite';

export function dealerFun(){

    var pokerBack = "/images/bluecover.png";
    var sourthCollection = [];
    var F = 4;
    var offsetNS = 40,offsetWE = 20, startNSPoint = -480,startWEPoint = -200;
    var sleft,stop,nleft,ntop,wleft , wtop ,eleft,etop ;
    var s,e,n,w;
    var leftOffset = 125;

    for(let i = 0 ; i <13 ; i++) {
        n = new Image();
        n.id = 'n'+ i.toString();
        n.height = '174';
        n.width = '125';
        n.style.position = 'relative';
        n.style.left = `${ 1000 -( i * leftOffset )  * F}px`;
        n.style.top = '400px';
        n.src = pokerBack;
        xs.appendChild(n);

        w =n.cloneNode(false);
        w.id = 'w' + i.toString();
        w.style.left = `${ 980 -( i * leftOffset) * F}px`;
        w.style.top = '400px';
        xs.appendChild(w);

        e =n.cloneNode(false);
        e.id ='e' + i.toString();
        e.style.left = `${ 710 - ( i * leftOffset) * F  }px`;
        e.style.top = '400px';
        xs.appendChild(e);

        s =n.cloneNode(false);
        s.id = 's' + i.toString();
        s.style.left = `${650 -( i * leftOffset)* F }px`;
        s.style.top = '400px';
        xs.appendChild(s);

        sleft =startNSPoint + (offsetNS * i);    stop = 380;
        nleft =startNSPoint + (offsetNS * i);    ntop= -344;
        wleft = -1000  ;    wtop= startWEPoint + (offsetWE * i);
        eleft= 530 ;    etop =  startWEPoint + (offsetWE * i);

        s.dataLeft = sleft;s.dataTop = stop;s.dataRotate = '';
        e.dataLeft = eleft;e.dataTop = etop;e.dataRotate = 'rotate(90deg)';
        n.dataLeft = nleft ;n.dataTop = ntop;n.dataRotate = '';
        w.dataLeft = wleft;w.dataTop = wtop;w.dataRotate = 'rotate(90deg)';

        sourthCollection.push(...[s,e,n,w]);
    }


    function getRandom(min,max){   return Math.floor(Math.random() * (max - min + 1)) + min;}
    function done(){
        sourthCollection.forEach((card)=>{
            card.style.transition = 'transform 1s ';
            card.style.transform = `translate3d(${card.dataLeft}px,${card.dataTop}px,0px)${card.dataRotate}`;
        });
    }
    function shuffle(){
        xs.style.display='block';
        return new Promise(resolve=>{
            if(sourthCollection.length > 0)
            {   let u = 0.5;
                sourthCollection.forEach((card)=>{
                    setTimeout(()=>{
                        card.style.transition = 'transform 1s ';
                        card.style.transform = `translate3d(${getRandom(-400,400)}px,${getRandom(-400,400)}px,0px) rotate(${getRandom(0,360)}deg)`;
                    }, u++ * 100/* 暫時mark : u++ * 100 */);
                });
            }
            setTimeout(()=> {resolve();} , 5000);
        });
    }
    function go(){
        return new Promise(resolve=>{
            if(sourthCollection.length > 0)
            {        let u = 0.5;
                sourthCollection.forEach((card)=>{
                    setTimeout(()=>{
                        card.style.transition = 'transform 1s ';
                        card.style.transform = `translate3d(${card.dataLeft}px,${card.dataTop}px,0px)${card.dataRotate}`;
                        if(card.id === 'w12') setTimeout(()=> resolve(),1.5 * 1000);
                    }, u++ * 100/* 暫時mark : u++ * 100 */ );
                });
            }
        });
    }

    return {
        shuffle : ()=> shuffle().then(()=>shuffle()),
        shuffCtxShift:()=>{
           return shuffle().then(()=>shuffle()).then(()=>go());
        },
        done:done
    };
}



function cardsSort(a,b){

    var ra = a.constructor === String ? a.match(/\D+|\d+/g) : a.value.match(/\D+|\d+/g) ;
    var rb = b.constructor === String ? b.match(/\D+|\d+/g): b.value.match(/\D+|\d+/g);
    var r = 0;

    while(!r && ra.length && rb.length) {
        var x = ra.shift(), y = rb.shift(),
            nx = parseInt(x), ny = parseInt(y);

        if(isNaN(nx) || isNaN(ny))
            r = x > y ? 1 : (x < y ? -1 : 0);
        else
            r = nx - ny;
    }
    return r || ra.length - rb.length;
}

export {cardsSort};




const dealer = {
    src:assets,
    _n:[[470,20],[510,20],[550,20],[590,20],[630,20],[670,20],[710,20],[750,20],[790,20],[830,20],[870,20],[910,20],[950,20]],
    _s:[[487,740],[527,740],[567,740],[607,740],[647,740],[687,740],[727,740],[767,740],[807,740],[847,740],[887,740],[927,740],[967,740]],
    _w:[[22,120],[22,150],[22,180],[22,210],[22,240],[22,270],[22,300],[22,330],[22,360],[22,390],[22,420],[22,450],[22,480]],
    _e:[[1408,118],[1408,148],[1408,178],[1408,208],[1408,238],[1408,268],[1408,298],[1408,328],[1408,358],[1408,388],[1408,418],[1408,448],[1408,478]],
    getNorthCoodinateByIdx(idx){
        if( 0 > idx || idx >= this._n.length) throw new Error('out of bound _n');
        return { x:this._n[idx][0] , y:this._n[idx][1]};
    }
    ,
    getSourthCoodinateByIdx(idx){
        if( 0 > idx || idx >= this._s.length) throw new Error('out of bound _s');
        return { x:this._s[idx][0] , y:this._s[idx][1]};
    }
    ,
    dealSourth(cards){
        cards.sort(cardsSort);
        let locateAt = 0;
        let sourthDeck = [];
        cards.forEach(c=>{
            let cc = card(this.src["images/poker.json"].frames[c],c);
            let l = this.getSourthCoodinateByIdx(locateAt++);
            cc.x = l.x;
            cc.y = l.y;
            activeInteractive(cc,'s');
            sourthDeck.push(cc);
        });
        return sourthDeck;
    }
    ,
    dealNorth(cards){
        cards.sort(cardsSort);
        let locateAt = 0;
        let northDeck = [];
        cards.forEach(c=>{
            let cc = card(this.src["images/poker.json"].frames[c],c);
            let l = this.getNorthCoodinateByIdx(locateAt++);
            cc.x = l.x;
            cc.y = l.y;
            activeInteractive(cc,'n');
            northDeck.push(cc);
        });
    return northDeck;
    }
}
export {dealer};

function activeInteractive(o,position){
    const sea = {s:{x: 700 , y : 510 },n:{x:700,y:220}};
    const {X,Y} = {X:o.x,Y:o.y};
    o.press = o.press || undefined;
    o.release = o.release || undefined;
    o.over = o.over || undefined;
    o.state = "up";o.pressed = false;o.hoverOver = false;
    o.update = (pointer,canvas)=>{
        let hit = pointer.hitSprite(o);
        if(pointer.isUp){
            o.state = 'up';
            //don`t move ,Stay
            o.x = X ; o.y = Y;
        }
        if(hit){
            o.state = 'over';
            // up/down
            o.y += o.y > 500? -100 : 100;
           // o.y -= 100;

            if(pointer.isDown){
                o.state = 'down';
                o.x = sea[position].x; o.y = sea[position].y;
            }
        }

        if (o.state === "down") {
            if (!o.pressed) {
                if (o.press){ o.press();}
                o.pressed = true;
                o.action = "pressed";
            }
        }

        if (o.state === "over") {
            if (o.pressed) {
                if (o.release) o.release();
                o.pressed = false;
                o.action = "released";
            }

            if (!o.hoverOver) {
                if (o.over) o.over();
                o.hoverOver = true;
            }
        }

        if (o.state === "up") {
            if (o.pressed) {
                if (o.release) o.release();
                o.pressed = false;
                o.action = "released";
            }


            if (o.hoverOver) {
                o.hoverOver = false;
            }
        }
    };
}

