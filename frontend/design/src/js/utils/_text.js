export default {
    getText: (key) => {
        return app.text.items[key] ? app.text.items[key] : '';
    },
    setText: (key, value) => {
        app.text.items[key] = value;
    },
    getErrorText: () => {
        const text = app.text.getText('unexpectedError');
        return text ? text : 'Unexpected Error';
    }
};