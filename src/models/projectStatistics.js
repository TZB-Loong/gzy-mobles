import {query, getThisYearProjectStatistics} from '../services/wechatApi'
import { Toast } from "antd-mobile";
export default {
  namespace: 'projectStatisticsModel',
  state: {
    thisYearProjectStatistics: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    }
  },
  effects: {
    *getThisYearProjectStatistics({ payload }, { call, put }) {
      const response = yield call(getThisYearProjectStatistics, payload);
      if (response.status === '200') {
        yield put({
          type: 'thisYearProjectStatistics',
          payload: response.data,
        });
      } else {
        Toast.offline(response.msg);
      }
    },
  },
  reducers: {
    thisYearProjectStatistics(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        thisYearProjectStatistics: payload,
      };
    },
  }

};
