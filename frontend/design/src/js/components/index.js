import * as body from './_body';
import * as header from './_header';
import * as loader from './_loader';
import * as media from './_media';
import * as imgOptimizer from './_imgoptimizer';
import * as analytic from './_analytic';

$(() => {
    const app = window.app;

    app.components = Object.assign(app.components, {
        body: body,
        header: header,
        media: media,
        loader: loader,
        imgOptimizer: imgOptimizer,
        analytic: analytic,
    });

    app.components.header.init();
    app.components.callback.init();
    app.components.imgOptimizer.init();
    app.components.radio.init();
});