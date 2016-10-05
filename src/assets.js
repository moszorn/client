
const assets = {
    loaded : 0,
    toLoad : 0,
    imgExts:['png','jpg','gif'],
    fontExts:["ttf","otf","ttc","woff"],
    jsonExts:['json'],
    load(sources){

        this.toLoad = sources.length;
        return new Promise((res)=>{
            let handler = ()=>{
                ++this.loaded;
                if(this.loaded == this.toLoad){
                    this.loaded = 0;
                    this.toLoad = 0;
                    res();
                }
            };

            sources.forEach(src=>{
                let ext = src.split('.').pop();
                if(this.imgExts.indexOf(ext) !== -1){this.loadImage(src,handler);}
                else if(this.fontExts.indexOf(ext) !== -1){this.loadFont(src,handler);}
                else if(this.jsonExts.indexOf(ext)!== -1){this.loadJson(src,handler);}
            });
        });
    }
    ,
    loadImage(src,handler){
        let img = new Image();
        img.addEventListener('load',handler,false);
        this[src] = img;
        img.src = src;
    }
    ,
    loadFont(src,handler){
        let style = document.createElement("style"),
            fontFace = `@font-face{font-family:${src.split('/').pop().split('.')[0]};src:url(${src});}`;
        style.innerText = fontFace;
        document.head.appendChild(style);
        handler();
    }
    ,
    loadJson(src,handler){

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open('GET',src,true);
        xhr.onload = e=>{

            if(xhr.status === 200)
            {
                let file = JSON.parse(xhr.responseText);
                this[src] = file;

                file.name = src;
                this[file.name] = file;

                if(file.frames)  this.createTilesetFrames(file,handler);
                else handler();
            }
        };
        xhr.send();
    }
    ,
    createTilesetFrames(file,handler){
        let url = file.name.replace(/[^\/]*$/,'');
        let tilesetUrl = url + file.meta.image;
        let tileset = new Image();

        this[tilesetUrl] = tileset;

        Object.keys(file.frames).forEach(frame=>{
            this[frame] = file.frames[frame];
            this[frame].source = tileset;
        });
        tileset.src = tilesetUrl;
        tileset.addEventListener('load',handler,false);
    }
};

export {assets};
