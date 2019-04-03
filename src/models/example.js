import {query} from '../services/example'
export default {

  namespace: 'example',

  state: {
    list: [],
    data: {},
    msg:'123456'
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(query, payload);
      console.log(response);
      yield put({type: 'save',payload:response});
    },
    *getMsg({ payload }, { call, put }) {  // eslint-disable-line
      const response = '789456';
      console.log('789456');
      yield put({type: 'get',payload:response});
    }
  },

  reducers: {
    save(state, action) {
      console.log(action)
      return {...state, ...action.payload};
    },
    get(state, action) {
      return { msg:action.payload};
    }
  }

};
