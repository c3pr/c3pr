module.exports = {
  configureWebpack: {
    devServer: {
      proxy: [
        {
          context: ['/api/**'],
          target: 'http://localhost:5000',
          secure: false,
          bypass() {
            console.log('proxy called!');
          },
        },
      ],
    },
  },
};
