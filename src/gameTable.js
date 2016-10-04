import {text,group,imageSprite,card,cardBack} from './sprite';
import {SEAT} from './bridge';
const txtConfig = {content:'',bigFont:'7em sans-serif',smallFont:'2.2em',fontFillColor:'hsla(69, 91%, 73%, 0.97)',fontStrokeColor:'#fff'};


class GameTable{
    constructor(){
        // this._north ={wording:'North',seat:null};
        // this._south ={wording:'North',seat:null};
        // this._west = {wording:'West',seat:null};
        // this._east = {wording:'East',seat:null};
    }
    seat(seat,positionX,positionY,isMainPlayer = false){
        //ths method produce something like  this.East = {wording:'East',seat:null}
        let playSeat = SEAT[seat.toUpperCase()];
        this[playSeat] = {
            wording:playSeat
        };
        this[playSeat]['seat'] = text(txtConfig.content,isMainPlayer?txtConfig.bigFont:txtConfig.smallFont,txtConfig.fontFillColor,txtConfig.fontStrokeColor,positionX,positionY);

        return this[playSeat]['seat'];
    }
    setPlaySeat(seat,positionX,positionY){
        this['playerSeat'] = this.seat(seat,positionX,positionY,true);
       return this['playerSeat'];
    }
    setTxtSpriteBeforeEffects(seatTxt){
        seatTxt.alpha = 3;
        seatTxt.scaleX = 3;    seatTxt.scaleY = 3;
        seatTxt._layer = 1;
        seatTxt.shadow = true;
        seatTxt.shadowBlur = 3;    seatTxt.shadowColor = "rgba(100, 100, 100, 0.5)";
        seatTxt.shadowOffsetX = 3; seatTxt.shadowOffsetY = 3;
        return seatTxt;
    }
}

export const gameTable = new GameTable();
