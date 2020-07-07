import * as property from './_property';
import * as text from './_text';
import * as utils from './_utils';

$(() => {
    window.app = window.app || {};
    app.components = app.components || {};
    app.property = app.property || {};
    app.property.items = app.property.items || {};

    app.text = app.text || {};
    app.text.items = app.text.items || {};

    app.property = Object.assign(app.property, property.default);

    app.text = Object.assign(app.text, text.default);

    app.utils = utils.default;
});