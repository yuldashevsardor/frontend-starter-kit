let settings = {
    eventName: 'optimizeImg',
    threshold: 300,
    classes: {
        done: 'optimize--done',
        wait: 'optimize--wait',
        processing: 'optimize--processing',
        error: 'optimize--error'
    },
    types: {
        img: 'img',
        link: 'link',
        background: 'background'
    },
    sizeFrom: {
        parent: 'parent',
        client: 'client'
    },
    attributes: {
        sizeFrom: 'data-size-from',
        sizeSide: 'data-size-side',
        src: 'data-src',
        type: 'data-type',
    }
};

const inViewPort = (element, withThreshold = true) => {
    element = $(element);

    if (element.length === 0) {
        return false;
    }

    const $window = $(window);
    const viewportTop = Math.max($window.scrollTop() - settings.threshold, 0);
    const viewportHeight = $window.height();
    const viewportBottom = $window.scrollTop() + viewportHeight + settings.threshold;

    const elementTop = element.offset().top;
    const elementHeight = element.height();
    const elementBottom = elementTop + elementHeight;

    return (elementTop >= viewportTop && elementTop < viewportBottom) ||
            (elementBottom > viewportTop && elementBottom <= viewportBottom) ||
            (elementHeight > viewportHeight && elementTop <= viewportTop && elementBottom >= viewportBottom)
};

const initEvents = () => {
    const $windows = $(window);

    $windows.on(settings.eventName, handler);
    $windows.on('scroll', () => {
        fireEvent()
    });
};

const fireEvent = (container) => {
    let params = [];

    if (container) {
        params.push($(container));
    }

    $(window).trigger(settings.eventName, params);
};

const handler = (e, container) => {
    const classes = settings.classes;
    const selector = `.${classes.wait}:not(.${classes.done}):not(.${classes.processing}):not(.${classes.error})`;
    const items = [];

    if (container && container.length) {
        if (container.is(selector)) {
            items.push(container);
        }

        items.push(...container.find(selector));
    } else {
        items.push(...$(selector));
    }

    if (!items.length) {
        return;
    }

    items.forEach(item => {
        optimize($(item));
    })
};

const optimize = element => {
    const types = settings.types;

    if (!element.length) {
        return;
    }

    const type = getType(element);
    if (!types) {
        setError(element);
        return;
    }

    if (!typeIsLink(type) && !inViewPort(element)) {
        return;
    }

    setProcessing(element);

    const sizes = getSizes(element, type);
    if (!sizes) {
        setError(element);
        return;
    }

    const baseUrl = getUrl(element);
    if (!baseUrl) {
        setError(element);
        return;
    }

    let url;
    try {
        url = new URL(baseUrl);
    } catch (e) {
    }

    if (!url) {
        setError(element);
        return;
    }

    if (sideByHeight(element)) {
        url.searchParams.set('h', sizes.height);
    } else {
        url.searchParams.set('w', sizes.width);
    }

    setUrl(element, url, type);

    if (typeIsLink(type)) {
        setDone(element);
        return;
    }

    element.on('load', () => {
        setDone(element);
    });

    element.on('error', () => {
        setError(element);
    });
};

const getType = element => {
    const types = settings.types;
    const attributes = settings.attributes;

    if (element.prop("tagName").toLowerCase() === 'img') {
        return types.img;
    }

    if (element.attr(attributes.type) === types.link) {
        return types.link;
    }

    if (element.data(attributes.type) === types.background) {
        return types.background;
    }

    return null;
};

const typeIsImg = type => {
    return type === settings.types.img;
};

const typeIsLink = type => {
    return type === settings.types.link;
};

const typeIsBackground = type => {
    return type === settings.types.background;
};

const sideByWidth = element => {
    const sizeSide = element.attr(settings.attributes.sizeSide);

    return !sizeSide || sizeSide === 'width';
};

const sideByHeight = element => {
    return element.attr(settings.attributes.sizeSide) === 'height';
};

const getUrl = element => {
    const url = element.attr(settings.attributes.src);

    return url ? url : null;
};

const getSizes = (element, type) => {
    const sizeFrom = settings.sizeFrom;
    const elementSizeFrom = element.attr(settings.attributes.sizeFrom);

    let elementForSizes = element;

    if (elementSizeFrom === sizeFrom.client || typeIsLink(type)) {
        elementForSizes = $(window);
    } else if (elementSizeFrom === sizeFrom.parent) {
        elementForSizes = element.parent();
    }

    return {
        width: elementForSizes.width(),
        height: elementForSizes.height()
    };
};

const setUrl = (element, url, type) => {
    if (typeIsImg(type)) {
        element.attr('src', url);
        return true;
    }

    if (typeIsLink(type)) {
        element.attr('href', url);
        return true;
    }

    if (typeIsBackground(type)) {
        const imgElement = new Image();
        imgElement.src = url;
        imgElement.alt = 'Loading';
        imgElement.title = 'Loading';
        imgElement.width = 1;
        imgElement.height = 1;
        imgElement.style.width = '1px';
        imgElement.style.height = '1px';
        imgElement.style.position = 'fixed';
        imgElement.style.top = '-5000px';
        imgElement.style.left = '-5000px';
        document.body.appendChild(imgElement);

        const $imgElement = $(imgElement);
        $imgElement.on('load', () => {
            element.trigger('load');
            $imgElement.remove()
        });

        $imgElement.on('error', () => {
            element.trigger('error');
            $imgElement.remove()
        });
    }
};

const setProcessing = element => {
    removeClasses(element);
    element.addClass(settings.classes.processing);
};

const setError = element => {
    removeClasses(element);
    removeAttributes(element);
    element.addClass(settings.classes.error);
};

const setDone = element => {
    removeClasses(element);
    removeAttributes(element);
    element.addClass(settings.classes.done);
};

const removeClasses = element => {
    for (const className of Object.values(settings.classes)) {
        element.removeClass(className);
    }
};

const removeAttributes = (element) => {
    if (window?.app?.property?.getProperty('debug')) {
        return;
    }

    for (const attribute of Object.values(settings.attributes)) {
        element.removeAttr(attribute);
    }
};

module.exports = {
    settings: settings,
    init: (options) => {
        if (typeof options === 'object') {
            settings = Object.assign(settings, options);
        }
        initEvents();
        fireEvent();
    },
    fireEvent: fireEvent
};