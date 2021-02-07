const path = require('path');
// const fs = require('fs');
// const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Setting development flag via Node JS
const isDev = process.env.NODE_ENV === 'development';

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
};

const MASSAGE_PAGE_TEMPLATES = [
  `anti-cellulite-massage.pug`,
  `back-massage.pug`,
  `body-lymphatic-drainage.pug`,
  `chiromassage.pug`,
  `classic-facial-massage.pug`,
  `facial-lymphatic-drainage.pug`,
  `figure-modeling.pug`,
  `fullbody-massage.pug`,
  `japanese-asahi-massage.pug`,
  `neck-massage.pug`,
  `sculptural-buccal-massage.pug`,
  `sports-massage.pug`
]

const filename = (dir, ext) => isDev ? `${dir}[name].${ext}` : `${dir}[name].[contenthash:8].${ext}`;

/* // Pages const for HTMLWebpackPlugin
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug')); */

const plugins = () => {
  const base = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*'
      ]
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/static`, to: `` }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: filename(``, `css`)
    }),

    new StylelintPlugin({
      context: path.resolve(__dirname, `${PATHS.src}/${PATHS.assets}/scss`),
      syntax: 'scss',
      emitErrors: false
    })

    /* // Automatic creation any html pages (Don't forget to RERUN dev server)
    // see more: https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
    // best way to create pages: https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
    ...PAGES.map(page => new HTMLWebpackPlugin({
      inject: true,
      chunks: injectChunks(page),
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`,
      minify: {
        collapseWhitespace: !isDev
      }
    })) */
  ];

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const cssLoaders = (...extras) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, `../postcss.config.js`)
        },
        sourceMap: true
      }
    }
  ];

  if (extras) {
    for (const loader of extras) {
      loaders.push(loader);
    }
  }

  return loaders;
};

const babelOptions = (preset, plugin) => {
  const opts = {
    presets: [
      [
        '@babel/preset-env',
        {
          'useBuiltIns': 'usage',
          'corejs': 3.6
        }
      ]
    ],
    plugins: ['@babel/plugin-proposal-class-properties']
  };

  if (preset) {
    opts.presets.push(preset);
  }
  if (plugin) {
    opts.plugins.push(plugin);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions()
    }
  ];

  if (isDev) {
    loaders.push({
      loader: 'eslint-loader',
      options: {
        emitWarning: true,
        // Fail only on errors
        failOnWarning: false,
        failOnError: true
      }
    });
  }

  return loaders;
};

const injectChunks = page => {
  const chunksArray = ['app'];

  switch (page) {
    case `index.pug`:
      chunksArray.push(`pages/index`);
      break;
    case `professionalnyj-massazh.pug`:
      chunksArray.push(`pages/professionalnyj-massazh`);
      break;
    case `kontakty.pug`:
      chunksArray.push(`pages/kontakty`);
      break;
    case `ceny.pug`:
      chunksArray.push(`pages/ceny`);
      break;
    case `reviews.pug`:
      chunksArray.push(`pages/reviews`);
      break;
    default:
      if (~MASSAGE_PAGE_TEMPLATES.indexOf(page)) {
        chunksArray.push(`pages/massages`);
      }
  }

  return chunksArray;
};

const optimization = () => {
  const config = {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  };

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          mangle: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true
      })
    ];
  }

  return config;
};

const imageOptimOptions = ext => {
  switch (ext) {
    case 'png':
      return {
        optipng: {
          optimizationLevel: 4
        }
      }
    case 'jpg':
    case 'jpeg':
      return {
        mozjpeg: {
          progressive: true,
          quality: 80
        }
      }
    case 'webp':
      return {
        webp: {
          quality: 70
        }
      }
    case 'svg':
      return {
        svgo: {}
      }
    default:
      break;
  }
}

module.exports = {
  // BASE config
  context: path.resolve(__dirname, '../src'),
  externals: {
    paths: PATHS
  },
  entry: {
    'app': `${PATHS.src}/app.js`,
    'admin': `${PATHS.src}/admin.js`,
    'pages/index': `${PATHS.src}/js/pages/index/index.js`,
    'pages/massages': `${PATHS.src}/js/pages/massages/index.js`,
    'pages/professionalnyj-massazh': `${PATHS.src}/js/pages/service/professionalnyj-massazh/index.js`,
    'pages/kontakty': `${PATHS.src}/js/pages/service/kontakty/index.js`,
    'pages/ceny': `${PATHS.src}/js/pages/service/ceny/index.js`,
    'pages/reviews': `${PATHS.src}/js/pages/service/reviews/index.js`,
    'pages/article': `${PATHS.src}/js/pages/article/index.js`
  },
  output: {
    filename: filename(`js/`, `js`),
    path: PATHS.dist
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [/* {
      test: /\.pug$/,
      use: [
        {
          loader: 'pug-loader',
          options: {
            pretty: isDev
          }
        }
      ]
    }, */{
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }, {
        test: /\.css$/,
        use: cssLoaders()
      }, {
        test: /\.s[ac]ss$/,
        use: cssLoaders({
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        })
      }, {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: filename(`fonts/`, `[ext]`),
          outputPath: PATHS.assets
        }
      }, {
        test: /\.(webp|png|jpe?g|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: filename(``, `[ext]`),
            outputPath: (url, resourcePath, context) => path.relative(context, resourcePath),
            esModule: false
          }
        }/* , {
          loader: 'image-webpack-loader',
          options: imageOptimOptions('[ext]')
        } */]
      }, {
        test: /\.(mp4|ogv|webm)$/,
        loader: 'file-loader',
        options: {
          outputPath: (url, resourcePath, context) => path.relative(context, resourcePath),
          name: filename(``, `[ext]`)
        }
      }, {
        test: /\.xml$/,
        loader: 'xml-loader'
      }]
  }
};
