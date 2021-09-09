const debounce = function(func, timeout = 800) {
    var timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout);
    }
}

export default debounce;