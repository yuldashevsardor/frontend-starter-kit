module.exports = {
    settings: {
        lockClass: 'lock',
    },
    lock: () => {
        const component = window.app.components.body;
        $('body').addClass(component.settings.lockClass);
    },
    unlock: () => {
        const component = window.app.components.body;
        $('body').removeClass(component.settings.lockClass);
    },
    isLocked: () => {
        const component = window.app.components.body;
        return $('body').hasClass(component.settings.lockClass);
    }
};