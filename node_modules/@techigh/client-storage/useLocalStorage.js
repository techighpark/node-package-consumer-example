const useLocalStorage = {}

/**
 * Sets an item in localStorage with the specified keyName and keyValue, and an optional expiration date.
 * If the keyName already exists in localStorage, the existing item with matching keyValue will be removed before adding the new item.
 *
 * @param {String} keyName - The key name for the item to be stored in localStorage.
 * @param {*} value - The value to be stored in localStorage for the given keyName.
 * @param {Number} [expireDays] - Optional. The number of days until the stored item should expire.
 */
useLocalStorage.setLocalItem = (keyName, value, expireDays) => {
    const expiredAt = expireDays ? Date.now() + (expireDays * 24 * 60 * 60 * 1000) : null;
    const itemObj = { value, expiredAt };
    localStorage.setItem(keyName, JSON.stringify(itemObj))
}



/**
 * @param {String} keyName - The key name for the item to be stored in localStorage.
 * @param {*} value - The value to be stored in localStorage for the given keyName.
 * @param {Number} [expireDays] - Optional. The number of days until the stored item should expire.
 */
useLocalStorage.setLocalItems = (keyName, value, expireDays) => {
    const defaultItems = getLocalItems(keyName) ?? [];
    const expiredAt = calculateExpiration(expireDays);
    const newItem = { value, expiredAt };
    let existingItemIndex;

    if (value?.id) {
        existingItemIndex = defaultItems.findIndex(item => item.value.id === value.id);
    } else {
        existingItemIndex = defaultItems.findIndex(item => item.value === value);
    }
    let newItems;

    if (existingItemIndex !== -1) {
        // If the value already exists, remove the existing item before adding the new item
        newItems = [
            ...defaultItems.slice(0, existingItemIndex),
            ...defaultItems.slice(existingItemIndex + 1),
            newItem
        ];

    } else {
        newItems = [newItem, ...defaultItems];
    }

    localStorage.setItem(keyName, JSON.stringify(newItems));
};

const calculateExpiration = (expireDays) => {
    if (expireDays) {
        const expireMs = expireDays * 24 * 60 * 60 * 1000;
        return Date.now() + expireMs;
    } else {
        return null;
    }
};

/**
 * Sets an item in localStorage with the specified keyName and keyValue, and an optional expiration date.
 * If the keyName already exists in localStorage, the existing item with matching keyValue will be removed before adding the new item.
 *
 * @param {Object} options - An object containing the following properties:
 * @param {String} options.keyName - The key name for the item to be stored in localStorage.
 * @param {Object} options.keyValue - The value to be stored in localStorage for the given keyName, must be an object.
 * @param {Number} [options.expireDays] - Optional. The number of days until the stored item should expire.
 */
useLocalStorage.setLocalItemId = ({ keyName, keyValue, expireDays }) => {
    let array = [];
    const localArray = JSON.parse(localStorage.getItem(keyName));

    if (localArray) {
        array = localArray;
    }

    array = array?.filter(o => {
        const savedItem = JSON.stringify(o.value);
        const newItem = JSON.stringify(keyValue);
        return savedItem !== newItem;
    });

    let expireDate = expireDays ? Date.now() + expireDays * 1000 * 60 * 60 * 24 : null;
    const obj = {
        value: keyValue,
        expire: expireDate
    };

    array?.push(obj);

    if (array?.length > 10) {
        array = array.slice(1);
    }

    const jsonArray = JSON.stringify(array);
    window.localStorage.setItem(keyName, jsonArray);
};

/**
 * @param {String} keyName - The key name for the item to be stored in localStorage.
 * @returns {*}
 * */
useLocalStorage.getLocalItem = (keyName) => {
    const item = JSON.parse(localStorage.getItem(keyName));
    if (!item) {
        return null;
    }
    if (item.expiredAt && Date.now() > item.expiredAt) {
        localStorage.removeItem(keyName);
        return null;
    }
    return item.value;
}

/**
 * @description Get Localstorage Items
 * @param {String} keyName
 * @return {Array} array
 *  */
useLocalStorage.getLocalItems = (keyName) => {
    const array = JSON.parse(localStorage.getItem(keyName) ?? '[]');
    const validArray = array.filter((item) => {
        return !item.expiredAt || item.expiredAt > Date.now();
    });
    localStorage.setItem(keyName, JSON.stringify(validArray));

    return validArray;
};

useLocalStorage.removeLocalItem = (keyName, value) => {
    const defaultItems = getLocalItems(keyName) ?? [];
    let remainItems;

    if (value?.id) {
        remainItems = defaultItems.filter(item => item.value.id !== value.id);
    } else {
        remainItems = defaultItems.filter(item => item.value !== value);
    }
    localStorage.setItem(keyName, JSON.stringify(remainItems));
}

useLocalStorage.clearLocalItem = (keyName) => {
    localStorage.setItem(keyName, JSON.stringify([]));
};

useLocalStorage.deleteLocalItem = (keyName) => {
    localStorage.removeItem(keyName)
}

module.exports = useLocalStorage;