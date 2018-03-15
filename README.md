# protractor-babel-plugin-istanbul-plugin

## How to use

1. Install: `npm install protractor-babel-plugin-istanbul-plugin@git+ssh://git@github.com/ofk/protractor-babel-plugin-istanbul-plugin.git --save-dev`
1. Setup [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul)
1. Update `conf.js`:

``` js
exports.config = {
    :
  plugins: [
      :
    {
      package: 'protractor-babel-plugin-istanbul-plugin',
      includeDir: './src',
      reportDir: './coverage',
      reporter: ['text', 'html'],
    },
  ],
    :
};
```
