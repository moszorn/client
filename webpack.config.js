/**
 * Created by zorn on 2016/7/4.
 */
let path = require("path");

function config(){
    return {
        entry:{
            main:["./src/main"]
        }
        ,
        output:{
            path: path.join(__dirname, "build/scripts"),
            filename: "[name].js"
        }
        ,
        module:{
            loaders:[

                {test: /\.js/,   loader: "babel", exclude:"/node_modules/"},

                {test: /\.less/, loader:"style!css!less"},

                {test: /\.css/,  loader:"style!css"},

                {test: /\.(png|gif|ttf|woff)/, loader:"url-loader?limit=400"}
            ]
        }
        ,
        plugins:[],
        getRuntimeSetting( stage, files){
            let o = {},ary = [];
            files.forEach(f=> {
               o[f.split('.')[0]] = '"'+stage.concat(f)+'"';
                ary.push(o[f.split('.')[0]]);
            });
            o.assets = '[' + ary.join(',') +']';
            return o;
        }
        ,
        copies:[
            { from:  path.resolve(__dirname, 'src','assets') , to:path.resolve(__dirname, 'build','assets')},
            { from: path.resolve(__dirname, 'src','index.html'), to: path.resolve(__dirname, 'build','index.html') }
            ]
    };
}

module.exports = config();
module.exports.clone = config;