const debounce = function(func, timeout = 500) {
    var timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout);
    }
}

export default debounce;