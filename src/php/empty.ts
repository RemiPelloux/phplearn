// Stand-in for Node-only modules (worker_threads) and PHP builds we don't ship (PHP 5.2).
const empty = {};
export default empty;
export const getPHPLoaderModule = () => {
  throw new Error("This PHP version is not included.");
};
