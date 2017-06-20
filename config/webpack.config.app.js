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
};

module.exports = {
  development: createConfig(common),

  production: createConfig({
    ...common,
    production: true,
    serviceWorker: true,

    entry: {
      vendor: [
        'react',
        'react-dom',
        'redux',
        'react-router-dom',

        'punycode',
        'symbol-observable',
        'url',
      ],
    },
  }),
};
