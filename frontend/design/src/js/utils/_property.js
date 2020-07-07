export default {
    getProperty: (key) => {
        return app.property.items[key] ? app.property.items[key] : '';
    },
    setProperty: (key, value) => {
        app.text.property[key] = value;
    },
    getCurrentController() {
        return app.property.getProperty('currentController');
    },
    getCurrentAction() {
        return app.property.getProperty('currentAction');
    }
};