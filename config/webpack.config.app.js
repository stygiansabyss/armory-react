import createConfig from './webpackConfigFactory';
import paths from './paths';

const common = {
  name: 'app',
  entryPath: paths.appSrc,
  longTermCache: true,
  htmlWebpackPlugin: {
    filename: 'index.html',
    template: paths.appHtml,
    inject: true,
  },
  entry: {
    vendor: [
      'axios',
      'classnames',
      'fastclick',
      'punycode',
      'symbol-observable',
      'withinviewport',
      'recompose',
      'reselect',
      'url',

      'react',
      'react-dom',
      'react-responsive',
      'react-redux',
      'react-helmet',
      'react-router-dom',
      'i18n-react',

      'redux',
    ],
  },
};

module.exports = {
  development: createConfig(common),

  production: createConfig({
    ...common,
    production: true,
    serviceWorker: true,
  }),
};
