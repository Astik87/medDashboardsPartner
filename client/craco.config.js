const path = require("path");
module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, "src"),
            '@components': path.resolve(__dirname, "src", 'components'),
            '@utils': path.resolve(__dirname, 'src', 'utils'),
            '@pages': path.resolve(__dirname, 'src', 'pages'),
            '@adminPages': path.resolve(__dirname, 'src', 'adminPages'),
            '@api': path.resolve(__dirname, 'src', 'api'),
            '@styles': path.resolve(__dirname, 'src', 'styles'),
            '@images': path.resolve(__dirname, 'src', 'images'),
            '@globals': path.resolve(__dirname, 'src', 'globals')
        }
    }
}
