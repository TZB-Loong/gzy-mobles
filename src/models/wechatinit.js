import {query} from '../services/wechatApi'
export default {
  namespace: 'wechatinit',
  state: {
    list: [],
    data: {},
    message:'123456'
  },

  subscriptions: {
    setup({ dispatch, history }) {
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      console.log(response);
      yield put({type: 'save',payload:response});
    },
    *getMsg({ payload }, { call, put }) {
      const response = '()=>神奇的react...';
      console.log(response);
      yield put({type: 'get',payload:response});
    },
    *clear({ payload }, { call, put }) {
      const response = '';
      yield put({type: 'clearData',payload:response});
    }
  },
  reducers: {
    save(state, action) {
      console.log(action)
      return {...state, ...action.payload};
    },
    get(state, action) {
      return { message:action.payload};
    },
    clearData(state, action){
      return { message:action.payload};
    }
  }

};
