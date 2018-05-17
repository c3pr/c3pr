module.exports = {
    devServer: {
        proxy: {
            "/api/*": {
                target: "http://localhost:5005",
                secure: false
            }
        }
    }
};