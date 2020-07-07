const component = {
    settings: {
        selector: '#loader',
        showClass: 'show',
        bodyShowClass: 'loader-show',
    },
    getLoader: () => {
        const loader = $(component.settings.selector);

        return loader.length ? loader : null;
    },
    show: () => {
        const settings = component.settings;
        const loader = component.getLoader();

        if (!loader) {
            return false;
        }

        loader.addClass(settings.showClass);
        $('body').addClass(settings.bodyShowClass);
        app.components.body.lock();

        return true;
    },
    hide: (unlock = true) => {
        const settings = component.settings;
        const loader = component.getLoader();

        if (!loader) {
            return false;
        }

        loader.removeClass(settings.showClass);
        $('body').removeClass(settings.bodyShowClass);

        if (unlock) {
            app.components.body.unlock();
        }

        return true;
    },
    isShow: () => {
        const loader = component.getLoader();

        if (!loader) {
            return false;
        }

        return loader.hasClass(component.settings.fixedClass);
    }
};

module.exports = component;