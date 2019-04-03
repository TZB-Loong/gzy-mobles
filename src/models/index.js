const context = require.context('./', false, /\.js$/);
export default context
  .keys()
  .filter(item => item !== './index.jxs')
  .map(key => context(key));
