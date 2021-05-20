const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        publicPath: 'virtual',
        // path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        port: 8080,
        contentBase: 'www'
    }
};