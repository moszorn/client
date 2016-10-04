/**
 * Created by zorn on 2016/7/4.
 */
const path = require('path'),
    fs = require('fs'),
    assetsPath  = path.resolve(__dirname, 'src','assets');
let gulp = require("gulp"), $ = require("gulp-load-plugins")();
let webpack 	  = require("webpack"),
    webpackConfig = require("./webpack.config"),
    WebpackDevServer  = require("webpack-dev-server"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CopyWebpackPlugin = require('copy-webpack-plugin');

const IGNORE_STATS = {colors:true,exclude:["node_modules"]};
const HOT_PORT = 8081;
const assetsFiles = fs.readdirSync(assetsPath);



function createConfig(stage){
    const config = webpackConfig.clone();
    config.devtool = 'source-map';
    config.plugins.push(new webpack.DefinePlugin({runtime:config.getRuntimeSetting(stage,assetsFiles)}));
    config.plugins.push(new CopyWebpackPlugin(config.copies));
    config.plugins.push(new webpack.NoErrorsPlugin());
    config.publicPath.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    return config;
}


gulp.task("build",callback=> {
    webpack(createConfig('\/assets\/'))
        .run((err,stats)=>{
            if(err){
                console.error(err);return;
            }
            console.log(stats.toString(IGNORE_STATS));
            callback();
        });
});


gulp.task("watch",()=>{
    const config = createConfig("http://localhost:"+HOT_PORT.toString()+'/build/assets/'),
        compiler = webpack(config),
        devServer = new WebpackDevServer(compiler, {
            hot: true,
            inline: true,
            stats: IGNORE_STATS
        });


    /* new CopyWebpackPlugin([ { from:  path.resolve(__dirname, 'src','assets') , to:path.resolve(__dirname, 'build','assets')} ]),
     new webpack.NoErrorsPlugin()
    * */

    config.output.publicPath = "http://localhost:"+HOT_PORT.toString();
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.main.splice(0, 0, "webpack-dev-server/client","webpack/hot/only-dev-server");

    devServer.listen(HOT_PORT,"localhost",()=>{
        console.log(".......HMR Server started ......")
    });
});