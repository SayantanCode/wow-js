export const debounce = (func, wait = 300, options = {}) => {
    let timeout, lastCallTime, result;
    const { immediate = false, maxWait = null } = options;
  
    const debounced = (...args) => {
      const now = Date.now();
      const callNow = immediate && !timeout;
  
      if (maxWait && lastCallTime && now - lastCallTime >= maxWait) {
        if (timeout) clearTimeout(timeout);
        result = func(...args);
        lastCallTime = now;
        return result;
      }
  
      lastCallTime = now;
  
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) result = func(...args);
      }, wait);
  
      if (callNow) {
        result = func(...args);
      }
  
      return result;
    };
  
    debounced.cancel = () => {
      clearTimeout(timeout);
      timeout = null;
    };
  
    debounced.flush = () => {
      if (timeout) {
        clearTimeout(timeout);
        result = func();
        timeout = null;
      }
      return result;
    };
  
    return debounced;
  };
  