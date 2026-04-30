const isDev = import.meta.env.DEV;

const logger = {
  debug: (message, meta = {}) => {
    if (isDev) {
      console.debug(message, meta);
    }
  },
  info: (message, meta = {}) => {
    if (isDev) {
      console.info(message, meta);
    }
  },
  warn: (message, meta = {}) => {
    if (isDev) {
      console.warn(message, meta);
    }
  },
  error: (message, meta = {}) => {
    if (isDev) {
      console.error(message, meta);
    }
  },
};

export default logger;
