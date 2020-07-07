module.exports = {
    settings: {
        init: false,
        key: 'analyticScripts'
    },
    init: () => {
        const component = app.components.analytic;
        const settings = component.settings;

        if (settings.init) {
            return false;
        }

        const scripts = app.property.getProperty(settings.key);
        if (!scripts) {
            return false;
        }

        $('body').append(scripts);
        settings.init = true;

        return true;
    }
};