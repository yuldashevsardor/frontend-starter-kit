const mobileMenuComponent = {
    settings: {
        selector: '.mobile-menu',
        hamburgerSelector: '.hamburger',
        hamburgerActiveClass: 'is-active',
        openClass: 'open',
        bodyOpenClass: 'header-mobile-menu-opened',
    },
    init: () => {
        const hamburger = mobileMenuComponent.getHamburger();
        if (!hamburger) {
            return false;
        }

        hamburger.on('click', (e) => {
            e.preventDefault();

            if (mobileMenuComponent.hamburgerIsActive()) {
                mobileMenuComponent.inactiveHamburger();
                mobileMenuComponent.closeMenu();
            } else {
                mobileMenuComponent.activeHamburger();
                mobileMenuComponent.openMenu();
            }
        })
    },
    getMenu: () => {
        const header = component.getHeader();
        if (!header) {
            return null;
        }

        const menu = header.find(mobileMenuComponent.settings.selector);
        return menu.length ? menu : null;
    },
    getHamburger: () => {
        const header = component.getHeader();
        if (!header) {
            return null;
        }

        const hamburger = header.find(mobileMenuComponent.settings.hamburgerSelector);
        return hamburger.length ? hamburger : null;
    },
    activeHamburger: () => {
        const hamburger = mobileMenuComponent.getHamburger();
        if (!hamburger) {
            return false;
        }

        hamburger.addClass(mobileMenuComponent.settings.hamburgerActiveClass);

        return true;
    },
    inactiveHamburger: () => {
        const hamburger = mobileMenuComponent.getHamburger();
        if (!hamburger) {
            return false;
        }

        hamburger.removeClass(mobileMenuComponent.settings.hamburgerActiveClass);

        return true;
    },
    hamburgerIsActive: () => {
        const hamburger = mobileMenuComponent.getHamburger();
        if (!hamburger) {
            return false;
        }

        return hamburger.hasClass(mobileMenuComponent.settings.hamburgerActiveClass);
    },
    openMenu: () => {
        const header = component.getHeader();
        if (!header) {
            return false;
        }

        header.addClass(mobileMenuComponent.settings.openClass);
        window.app.components.body.setFixed();
        $('body').addClass(mobileMenuComponent.settings.bodyOpenClass);
        return true;
    },
    closeMenu: (unfixBody = true) => {
        const header = component.getHeader();
        if (!header) {
            return false;
        }

        header.removeClass(mobileMenuComponent.settings.openClass);
        $('body').removeClass(mobileMenuComponent.settings.bodyOpenClass);

        if (unfixBody) {
            window.app.components.body.removeFixed();
        }

        return true;
    },
    menuIsOpen: () => {
        const header = component.getHeader();
        if (header) {
            return false;
        }

        return header.hasClass(mobileMenuComponent.settings.openClass);
    }
};

const component = {
    settings: {
        selector: 'header',
        fixedClass: 'fixed',
        fixedHeight: 150,
        bodyFixedClass: 'header-fixed',
    },
    init: () => {
        $(window).on('scroll', scrollHandler);
        scrollHandler();
        mobileMenuComponent.init();
    },
    mobileMenu: mobileMenuComponent,
    getHeader: () => {
        const component = window.app.components.header;
        const header = $(component.settings.selector);

        return header.length ? header : null;
    },
    getHeight: () => {
        const header = window.app.components.header.getHeader();

        return header ? header.height() : 100;
    },
    setFixed: () => {
        const component = window.app.components.header;
        const header = component.getHeader();

        if (!header) {
            return false;
        }

        if (!component.canFixed()) {
            component.removeFixed();
            return false;
        }

        header.addClass(component.settings.fixedClass);
        $('body').addClass(component.settings.bodyFixedClass);

        return true;
    },
    removeFixed: () => {
        const component = window.app.components.header;
        const settings = component.settings;
        const header = component.getHeader();

        if (!header) {
            return false;
        }

        header.removeClass(settings.fixedClass);
        $('body').removeClass(settings.bodyFixedClass);

        return true;
    },
    isFixed: () => {
        const component = window.app.components.header;
        const settings = component.settings;
        const header = component.getHeader();

        if (!header) {
            return false;
        }

        return header.hasClass(settings.fixedClass);
    },
    canFixed: () => {
        const mediaComponent = window.app.components.media;
        return !mediaComponent.isSM() && !mediaComponent.isMD() && !mediaComponent.isLG();
    }
};

const scrollHandler = () => {
    if ($(window).scrollTop() > component.settings.fixedHeight) {
        component.setFixed();
    } else {
        component.removeFixed();
    }
};

module.exports = component;