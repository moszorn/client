
const path = require('path'),
      fs = require('fs'),
    webpack   = require('webpack'),
    dir_js    = path.resolve(__dirname, 'es6'),
    dir_html  = path.resolve(__dirname, 'html'),
    dir_build = path.resolve(__dirname, 'build'),
    CopyWebpackPlugin = require('copy-webpack-plugin');




const es6Files = fs.readdirSync(dir_js);
const entriesFiles = es6Files.map((filename)=> path.resolve(dir_js,filename));
console.log(entriesFiles);

module.exports = {
    entry:entriesFiles,
    output:{
        path:dir_build,
        filename:'bundle.js'
    },
    module:{
        loaders:[
            {
                loader:'babel-loader',
                test:dir_js
            }
        ]
    },
    plugins:[
        new CopyWebpackPlugin([
            { from: dir_html }
        ]),
        new webpack.NoErrorsPlugin()
    ],
    stats:{ colors: true},
    devtool:'source-map',
    devServer:{ contentBase:dir_build},
    resolve:{
        extensions:['','.js','.es6']
    }
};
