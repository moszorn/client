/**
 * Created by zorn on 2016/9/15.
 */

class SpriteBase{
    constructor(){

        this.width = 0; this.height = 0;
        this.x = 0; this.y = 0;
        this.rotation = 0;  this.alpha = 1;
        this.scaleX = 1;    this.scaleY = 1;
        this.visible = 1;   this._layer = 0;
        this.pivotX = .5;   this.pivotY = .5;
        this.vx = 0;    this.vy = 0;
        this.shadow = false;
        this.shadowBlur = 3;    this.shadowColor = "rgba(100, 100, 100, 0.5)";
        this.shadowOffsetX = 3; this.shadowOffsetY = 3;
        this.parent = undefined;    this.children = [];
        this._circular = false;

        //特殊屬性
        //改變sprite圖片狀態,或對 sprite進行動態效果(animate),Image states and animation
        this.frames = [];   this._currentFrame = 0;
        this.loop = true;   this.playing = false;

        //特殊屬性
        //定義sprite可不可以拖曳 (或mouse touch)
        this._draggable = undefined;

        //特殊屬性
        //讓sprite可以進行互動
        this._interactive = false;
    }//constructor

    get gx(){   return this.parent?(this.x + this.parent.gx) : this.x ; }
    get gy(){   return this.parent?(this.y + this.parent.gx) : this.y ; }

    get layer(){return this._layer;}
    set layer(value){
        this._layer = value;
        if(this.parent) this.parent.children.sort((s1,s2)=> s1.layer - s2.layer);
    }

    get halfWidth(){ return this.width/2;}
    get halfHeight(){return this.height/2;}

    get centerX(){return this.x + this.halfWidth;}
    get centerY(){return this.y+this.halfHeight;}

    get position(){return {x:this.x, y:this.y};}
    setPosition(x,y){this.x = x ; this.y = y ;}


    get localBounds(){
        let iHaveQuestion = true;
        if(iHaveQuestion) throw new Error('我這裡有問題,為何x:0,y:0');
        else  return  {  x: 0, y:0, width: this.width, height: this.height  };
    }
    get globalBounds(){ return { x: this.gx , y: this.gy, width: this.gx + this.width, height: this.gy + this.height  };    }


    get empty(){ return this.children.length === 0 ; }

    /*這個Sprite是否具有仿圓形化的功能,true:具有半徑,和直徑屬性, false:不具有半徑與直徑屬性*/
    get circular(){return this._circular;}
    set circular(value){
        if(value === true && this._circular === false){
            Object.defineProperties(this,{
                diameter:{
                    get(){ return this.width},
                    set(value){//throw new Error('為何直徑的指定是 this.width = this.height = value');
                        this.width = value; this.height = value;
                    },
                    configurable:true, enumerable:true
                },
                radius:{
                    get(){return this.halfWidth;},
                    set(value){
                        throw new Error('為何半徑的指定是 this.width =  this.height = value * 2');
                        this.width = value * 2;
                        this.height =value * 2;
                    },
                    configurable:true, enumerable:true
                }
            });
            this._circular = true;
        }
        if(value === false && this._circular === true){
            delete this.diameter;
            delete this.radius;
            this._circular = false;
        }
    }//set circular

    get interactive(){return this._interactive;}
    set interactive(value){
        if(value === true){
            makeInactive(this);
            this._interactive = true;
        }
    }
    /***********************************Methods*************************************************/
    addChild(sprite){
        if(sprite.parent){
            sprite.parent.removeChild(sprite);
        }
        sprite.parent = this;
        this.children.push(sprite);
    }
    removeChild(sprite){
        if(sprite.parent === this)
            this.children.splice(this.children.indexOf(sprite),1);
        else throw new Error(sprite+' is not a child of '+ this);
    }
    add(...sprites){ sprites.forEach(sprite=> this.addChild(sprite));}
    remove(...sprites){sprites.forEach(sprite=>this.removeChild(sprite));}
    /*******************************************************************************************/
    putCenter(b, xOffset = 0 , yOffset =0 ){
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.y = (a.y + a.halfHeight - b.halfHeight ) + yOffset;
    }
    putTop(b, xOffset = 0 , yOffset =0 ){
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.y = (a.y - b.height) + yOffset;
    }
    putRight(b, xOffset = 0 , yOffset =0 ){
        let a = this;
        b.x = (a.x + a.width ) + xOffset;
        b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    }
    putBottom(b, xOffset = 0 , yOffset =0 ){
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.y = (a.y + a.height) + yOffset;
    }
    putLeft(b, xOffset = 0 , yOffset =0 ){
        let a = this;
        b.x = (a.x - b.width) + xOffset;
        b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    }
    /*******************************************************************************************/
    // swap the depth layer positions of two child sprites
    swapChildren(child1,child2){
        if(this.children.indexOf(child1) !== -1 && this.children.indexOf(child2) !== -1){
            //因為設定layer時,底層會重新進行排序,參考 set layer
            [child1.layer,child2.layer] = [child2.layer,child1.layer];
        } else {
            throw new Error(`兩個Sprite物件必須是這個Sprite的子物件`);
        }
    }
}//ZornSprite

export let stage = new SpriteBase();

class TextSprite extends SpriteBase{
    constructor(content='hello world',font='1em sans-serif',fillStyle='purple',strokeStyle='#aaa', x=0,y=0){
        super();
        Object.assign(this,{content, font, fillStyle, strokeStyle, x, y});
        this.textBaseline = 'top';
    }
    render(ctx){

        ctx.font = this.font;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.storkeStyle;
        ctx.textBaseline = this.textBaseline;

        /*座標轉換到sprite中心,  sprite.width * sprite.pivotX (表sprite距中心百分比處)
         sprite.x + (sprite.width * sprite.pivotX),
         sprite.y + (sprite.height * sprite.pivotY)
         * */
        ctx.translate(
            -1 * (this.width * this.pivotX),
            -1 * (this.height * this.pivotY)
        );
        // ctx.translate(this.x,this.y);
        ctx.fillText(this.content,0,0);
        if(this.strokeStyle !== 'none') ctx.strokeText(this.content,0,0);

        //因為必須字出現在canvas上後執行量測,所以底下這兩行才寫在這
        this.width = ctx.measureText(this.content).width;
        this.height = ctx.measureText('M').width;
    }
}
export function text(content, font, fillStyle, strokeStyle, x, y) {
    //Create the sprite
    let sprite = new TextSprite(content, font, fillStyle, strokeStyle, x, y);

    //Add the sprite to the stage
    stage.addChild(sprite);

    //Return the sprite to the main program
    return sprite;
}

class GroupSprites extends SpriteBase{
    constructor(...sprites){
        super();
        if(sprites.length === 0){
            //content='hello world',font='1em sans-serif',fillStyle='purple',strokeStyle='#aaa', x=0,y=0
            let text = new TextSprite('空的Group','5em sans-serif','red','yellow',300,300);
            sprites.push(text);
        }
        sprites.forEach(s=> this.addChild(s));
    }
    /*因為這個addChild複寫了 SpriteBase的addChild,layer的更動只會影響group的parent,也就是 stage*/
    addChild(sprite) {
        if (sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
        sprite.parent = this;
        this.children.push(sprite);

        //Figure out the new size of the group
        this.calculateSize();
    }

    removeChild(sprite) {
        if(sprite.parent === this) {
            this.children.splice(this.children.indexOf(sprite), 1);
            //Figure out the new size of the group
            this.calculateSize();
        } else {
            throw new Error(`${sprite} is not a child of ${this}`);
        }
    }
    calculateSize(){
        let maxWidth=0,maxHeight=0;
        if(this.children.length>0){
            this.children.sort((a,b)=> b.width - a.width);
            maxWidth = this.children[0].width;

            this.children.sort((a,b)=> b.height - a.height);
            maxHeight = this.children[0].height;

        }

        this.width = maxWidth;
        this.height = maxHeight;
    }
}
export function group(...sprites){
    let gpSprite = new GroupSprites(...sprites);
    stage.addChild(gpSprite);
    return gpSprite;
}
class ImageSprite extends  SpriteBase{
    constructor(img,x=0,y=0){
        super();
        this.source = img;
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = img.width;
        this.height = img.height;
        this.sourceWidth = img.width;
        this.sourceHeight = img.height;
        this.x = x;
        this.y = y;
    }
    render(ctx){
        ctx.drawImage(
            this.source,
            this.sourceX, this.sourceY,
            this.sourceWidth, this.sourceHeight,
            -this.width * this.pivotX,
            -this.height * this.pivotY,
            this.width, this.height
        );
    }
}
export function imageSprite(src,x,y){
    let sprite = new ImageSprite(src,x,y);
    stage.addChild(sprite);
    return sprite;
}
class CardBack extends ImageSprite{
    constructor(img,toX,toY, x,y){
       super(img,x,y);
        this.toX = toX;
        this.toY = toY;
        this.vx = 45;
        this.vy = 45;
    }
    destory(){
        console.log('[CardBack destory]');
        this.parent.children.splice(this.parent.children.indexOf(this),1);
    }
    render(ctx){
        super.render(ctx);
    }
}
export function cardBack(src,toX,toY, x,y){
    let sprite = new CardBack(src,toX,toY, x,y);
    stage.addChild(sprite);
    return sprite;
}
class CardSprite extends SpriteBase{
    constructor(info,value = undefined,x = 0,y = 0,){
        super();
        this.source = info.source;
        this.sourceX = info.frame.x;
        this.sourceY = info.frame.y;
        this.width = info.sourceSize.w;
        this.height = info.sourceSize.h;
        this.sourceWidth = info.sourceSize.w;
        this.sourceHeight = info.sourceSize.h;
        this.x = x;
        this.y = y;
        this.value = value;
    }
    destory(sec){
        console.log('[Card destory]');
        let that = this;
        setTimeout(()=>{
            let idx = that.parent.children.indexOf(that);
            if(idx !== -1) {
                that.parent.children.splice(that.parent.children.indexOf(that), 1);
                that = null;
            }
        },sec);
        //this.parent.children.splice(this.parent.children.indexOf(this),1);
    }
    render(ctx){
        ctx.drawImage(
            this.source,
            this.sourceX, this.sourceY,
            this.sourceWidth, this.sourceHeight,
            -this.width * this.pivotX,
            -this.height * this.pivotY,
            this.width, this.height
        );
    }
}

export function card(cardInfo,x,y){
    let sprite = new CardSprite(cardInfo,x,y);
    stage.addChild(sprite);
    return sprite;
}



export function render(background,canvas) {
    let ctx = canvas.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background,0,0,101,101,0,0,ctx.canvas.width,ctx.canvas.height);
    stage.children.forEach(sprite => {
        displaySprite(sprite);
    });

    function displaySprite(sprite) {
        if (
            sprite.visible
            && sprite.gx < canvas.width + sprite.width
            && sprite.gx + sprite.width >= -sprite.width
            && sprite.gy < canvas.height + sprite.height
            && sprite.gy + sprite.height >= -sprite.height
        ) {
            ctx.save();


            ctx.translate(
                sprite.x + (sprite.width * sprite.pivotX),
                sprite.y + (sprite.height * sprite.pivotY)
            );


            ctx.rotate(sprite.rotation);
            ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
            ctx.scale(sprite.scaleX, sprite.scaleY);


            if(sprite.shadow) {
                ctx.shadowColor = sprite.shadowColor;
                ctx.shadowOffsetX = sprite.shadowOffsetX;
                ctx.shadowOffsetY = sprite.shadowOffsetY;
                ctx.shadowBlur = sprite.shadowBlur;
            }





            if (sprite.render) sprite.render(ctx);

            if (sprite.children && sprite.children.length > 0) {

                ctx.translate(-sprite.width * sprite.pivotX , -sprite.height * sprite.pivotY);

                sprite.children.forEach(child => {
                    displaySprite(child);
                });
            }


            ctx.restore();
        }
    }
}