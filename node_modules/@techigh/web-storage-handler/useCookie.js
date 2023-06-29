const useCookie = {}

//---------------------------------------------------------------------------------------------

useCookie.getCookie = (name) => {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(`${name}=`) === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1, cookie.length));
        }
    }
    return null;
}

//---------------------------------------------------------------------------------------------

useCookie.setCookie = (name, value, options = {}) => {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (options.expires) {
        let expires = options.expires;
        if (typeof expires == "number" && expires) {
            let date = new Date();
            date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
            expires = date;
        }
        if (expires instanceof Date) {
            cookie += `; expires=${expires.toUTCString()}`;
        }
    }
    if (options.path) {
        cookie += `; path=${options.path}`;
    }
    if (options.domain) {
        cookie += `; domain=${options.domain}`;
    }
    if (options.secure) {
        cookie += `; secure`;
    }
    document.cookie = cookie;
}

//---------------------------------------------------------------------------------------------

useCookie.deleteCookie = (name) => {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

//---------------------------------------------------------------------------------------------

module.exports = useCookie;