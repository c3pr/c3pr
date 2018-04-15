module.exports = {
    configureWebpack: {
        devServer: {
            proxy: [
                {
                    context: ['/api/**'],
                    target: 'http://localhost:5000',
                    secure: false,
                    bypass: function(req, res, proxyOptions) {
                        console.log('proxy called!')
                    }
                }
            ]
        }
    }
};