import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config';

import routes from './routes';

const port = process.env.PORT || 8080;
const app = express();
const compiler = webpack(webpackConfig);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../static')));
app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true }
    }));
}

app.listen(port, () => {
    console.log(`Server listening on port ${ port }`);
});