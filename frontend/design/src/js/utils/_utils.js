export default {
    isJson: (data) => {
        try {
            JSON.parse(data);
            return true;
        } catch (e) {
            return false;
        }
    },
    isUndefined: (value) => {
        return "undefined" === typeof value;
    },
    randomString: (c) => {
        const length = c || 10;
        const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lettersLower = lettersUpper.toLowerCase();
        const numbers = "012345678910";
        const symbols = '!@#$%^&*()_+-=~,./<>?;:|[]{}';
        const strings = lettersUpper + lettersLower + numbers + symbols;
        let result = '';

        for (let i = 0; i < length; i++) {
            result += strings.charAt(Math.floor(Math.random() * strings.length));
        }

        return result;
    },
    stringToRegexp: (regexp) => {
        regexp = regexp.replace(/^\//, '');
        regexp = regexp.replace(/(\/i|\/)$/, '');
        return new RegExp(regexp, 'i');
    },
    base64MimeType: (base64) => {
        let result = null;

        if (typeof base64 !== 'string') {
            return result;
        }

        const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

        if (mime && mime.length) {
            result = mime[1];
        }

        return result;
    },
    getErrorText: () => {
        return app.text.getText('')
    },
    supportGrid: () => {
        return CSS.supports('display', 'grid');
    },
    shuffleArray: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    timeout: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};