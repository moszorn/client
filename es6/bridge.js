export const STATUS = {
    init:0/*洗*/,
    start:1/*發*/,
    auctionBridge:3/*叫*/,
    firstLead:4/*首引*/,
    assignSeat:101/*指定座位*/,
    play:102/*出牌*/,
    trick:200/*一輪牌*/,
    setSuit:100/*指定花王*/,
    shuffle:201/*洗牌*/,
    close:-1
};
/*FOLLOW SUIT 跟着出什么花色*/

export const SEAT = {s:'s',n:'n',w:'w',e:'e'};
export const PLAYER = {
    all:0,s:1,e:2,n:3,w:4,
    dummy:10,decraler:11
};



export const gameManager = {
    currentCards :[],
    updateNS(pointer,canvas,suite){
            let outCard = null,destory = null;
            suite.forEach(card=>{
                card.update(pointer,canvas);
                if(card.state === 'down') {
                    outCard =  suite.splice(suite.indexOf(card), 1)[0];
                    if(outCard) {
                        destory =(sec)=> setTimeout(()=>{outCard.destory();},sec);
                    }
                }
            });
           return destory ;
    },
    updateNorth(pointer,canvas,suite,destory){
       return this.updateNS(pointer,canvas,suite,destory);
    },
    updateSourth(pointer,canvas,suite,destory){
        return this.updateNS(pointer,canvas,suite,destory);
    },
    pushCurrent(...toDestory){
        toDestory.forEach(destory=>{
           if(destory)
               this.currentCards.push(destory);
        });
    },
    destory(sec){
        console.log('[cardManager - destory] this.currentCards : %o', this.currentCards);
        if(this.currentCards.length > 1){
            this.currentCards.forEach(destory=>{
                destory(sec);
            });
            this.currentCards.length = 0;
        }
    }
}