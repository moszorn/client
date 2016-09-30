// var competition = document.querySelector('#competition');
// competition.addEventListener('click',auctionBridge,false);
export function onAuctionBridge(e){
    let emt = e.target,bid;
    if(emt.nodeType == Node.ELEMENT_NODE && emt.nodeName.indexOf('BUTTON') == 0)
    {   let i_d = emt.id.split(''),lvl = new Number(i_d[1]),selSuit=i_d[2].charCodeAt();
        bid = i_d[1]+i_d[2];
        let tr = document.querySelector('#l'+lvl.toString()),
            buttons = tr.parentElement.querySelectorAll('BUTTON'),
            split,l,action = false;
        buttons.forEach(btn=>{
            split = btn.id.split('');
            l = Number.parseInt(split[1],10);
            if(  l <= lvl ) {
                if( l < lvl){
                    action = true;
                }
                else {
                    if(split[2].charCodeAt() <= selSuit )
                        action = true;
                }
            }

            if(action){
                btn.setAttribute('disabled', true);
                btn.setAttribute('class','bid disabled');
                btn.style.color = 'hsla(239, 0%, 74%, 0.85)';
            }
            action = false;
        });
    }
    /*
     *  送回Server的資訊包含　suit , level , player (s,e,n,w)
     * */
    e.preventDefault();
    e.stopPropagation();
}
