export function mousePointer(element, scale = 1){

    let pointer = {
        element:element,
        scale:scale,
        _x:0,
        _y:0,
        get x(){
            return this._x/this.scale;},
        get y(){
            return this._y/this.scale;},
        /*底下centerX,centerY用於漸變涵式與碰撞偵測函數*/
        get centerX(){return this.x;},
        get centerY(){return this.y;},
        get position(){return {x:this.x,y:this.y};},

        isDown:false,
        isUp:true,
        tapped:false,

        downTime:0,
        elapsedTime:0,

        press:undefined,
        release:undefined,
        tap:undefined,


        dragSprite: null,


        dragOffsetX: 0,
        dragOffsetY: 0,

        moveHandler(e){
            let emt = e.target;
            this._x = e.pageX - emt.offsetLeft;
            this._y = e.pageY - emt.offsetTop;

    //console.log('this._x = %c%o, %cthis._y = %c%o','color:blue',this._x,'color:#555','color:blue',this._y);

            if(this._x > 569 && this._x < (569+599) && this._y > 733 && this._y < (744 + 184))
                element.style.cursor = "pointer";
            else
                element.style.cursor = "default";

            e.preventDefault();
        },
        downHandler(e){
            this.isDown=true;
            this.isUp=false;
            this.tapped=false;

            //capture the current time
            this.downTime = Date.now();
            if(this.press) this.press(e);
            e.preventDefault();
        },
        touchmoveHandler(e){
            let emt = e.target,touching = e.targetTouches[0];
            this._x = touching.pageX - emt.offsetLeft;
            this._y = touching.pageY - emt.offsetTop;
            e.preventDefault();
        },

        touchstartHandler(e){
            this.isDown=true;
            this.isUp=false;
            this.tapped=false;

            this.downTime = Date.now();

            let emt = e.target,touching = e.targetTouches[0];
            this._x = touching.pageX - emt.offsetLeft;
            this._y = touching.pageY - emt.offsetTop;
            if(this.press)this.press(e);
            e.preventDefault();
        },
        upHandler(e){
            this.elapsedTime = Math.abs(this.downTime - Date.now());

            if(this.elapsedTime <= 200 && this.tapped == false){
                this.tapped = true;
                if(this.tap)this.tap(e);
            }
            this.isUp = true;
            this.isDown = false;
            if(this.release) this.release(e);
            event.preventDefault();
        },
        touchedHandler(e){
            this.elapsedTime = Math.abs(this.downTime - Date.now());
            if(elapsedTime <= 200 && this.tapped === false){
                this.tapped = true;
                if(this.tap)this.tap(e);
            }
            this.isUp = true;
            this.isDown = false;
            if(this.release)this.release(e);
            e.preventDefault();
        },
        hitSprite(sprite) {
            let deckcardOffsetLeft = 81 , deckcardOffsetRight = 32, deckcardOffsetHeight = 100, hit = false;

            if (!sprite.circular) {
                let left = sprite.gx + deckcardOffsetLeft,
                    right = left + deckcardOffsetRight,
                    top = sprite.gy,
                    bottom = sprite.gy + sprite.height + deckcardOffsetHeight;

                hit = this.x > left && this.x < right && this.y > top && this.y < bottom;
            }
            else {
                //TODO
            }
            return hit;
        }
    };

    element.addEventListener('mousemove',pointer.moveHandler.bind(pointer),false);
    element.addEventListener('mousedown',pointer.downHandler.bind(pointer),false);

    if(window.PointerEvent){
        //2015-9-12 TODO: https://www.w3.org/TR/pointerevents/
        element.addEventListener("pointermove", pointer.moveHandler.bind(pointer), false);
    }

    element.addEventListener('touchmove',pointer.touchmoveHandler,false);
    element.addEventListener('touchstart',pointer.touchstartHandler.bind(pointer),false);

    window.addEventListener('mouseup',pointer.upHandler.bind(pointer),false);
    window.addEventListener('touchend',pointer.touchedHandler.bind(pointer),false);

    element.style.touchAction = 'none';
    return pointer;
}
