module.exports = {
    isSM: () => {
        return checkMedia(null, 576);
    },
    isMD: () => {
        return checkMedia(576, 768);
    },
    isLG: () => {
        return checkMedia(768, 992);
    },
    isXL: () => {
        return checkMedia(992, 1200);
    },
    isXXL: () => {
        return checkMedia(1200, 1500);
    },
    isXXXL: () => {
        return checkMedia(1500);
    }
};

const checkMedia = (min, max) => {
    let query = '';

    if (min) {
        query += `(min-width: ${min}px)`;
    }

    if (max) {
        if (min) {
            query += ' and ';
        }

        query += `(max-width: ${max}px)`;
    }

    return window.matchMedia(query).matches;
};