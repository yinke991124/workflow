const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, './src/plugins/ueditor'),
          to: path.join(__dirname,"./dist/js/"),
          ignore: ['.*']
        },{
          from: path.join(__dirname, './src/core/configdir'),
          to: path.join(__dirname,"./dist/"),
          ignore: ['.*']
        }
      ]),
      // new HardSourceWebpackPlugin()
    ],
    // if prod, add externals
    // externals: isProd ? assetsCDN.externals : {},
    /* externals: isProd ? {//cdn有些不稳定，暂时注释
      'vue-router': 'VueRouter',
    } : {} */
    externals: {},
    
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    config.output.filename('js/[name].[hash].js').end()
    config.output.chunkFilename('js/[name].[hash].js').end()
    // if prod is on
    // assets require on cdn
    /* if (isProd) {//cdn有些不稳定，暂时注释
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    } */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'btn-border-radius-base': '6px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  publicPath: '/workflow/',
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
