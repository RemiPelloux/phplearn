// Turbopack loader: replaces PHP extension binaries we never load (intl.so) with an empty module.
module.exports = function emptyLoader() {
  return 'export default "";';
};
