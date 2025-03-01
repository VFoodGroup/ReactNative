module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [] // Ensure this is an array; adjust as needed.
  };
};