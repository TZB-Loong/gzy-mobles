/*eslint-disable*/
import { queryProcessByPage } from "../../services/wechatApi";
import { Toast } from "antd-mobile";

export default {
  namespace: "waitProcessModel",

  state: {
    data: "审批管理-待我审批",
    loading: false,
    TodoTaskList: {},
    response: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      Toast.loading("Loading...");
      const response = yield call(queryProcessByPage, payload);
      Toast.hide();
      if (response.status === "200") {
        yield put({
          type: "TodoTaskList",
          payload: response
        });
      } else {
        Toast.offline(response.msg);
      }
    }
  },

  reducers: {
    TodoTaskList(state, { payload }) {
      return {
        ...state,
        response: payload,
        TodoTaskList: payload.data,
        total: payload.data ? payload.data.total : 0
      };
    }
  }
};
