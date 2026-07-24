// Dummy empty module for Node.js built-ins in React Native
module.exports = new Proxy(
  {},
  {
    get() {
      return () => {};
    },
  },
);
