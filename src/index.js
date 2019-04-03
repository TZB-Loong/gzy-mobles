import dva from 'dva';
import './index.less';
import router from './router';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
// 1. Initialize
// const app = dva();
const app = dva({
  history: createHistory(),
});
// 2. Plugins
app.use(createLoading());
// app.use();

// 3. Model
// app.model(example);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
export default app._store; // eslint-disable-line
