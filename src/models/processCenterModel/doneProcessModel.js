/*eslint-disable*/
import { queryDoneProcessByPage } from "../../services/wechatApi";
import { Toast } from "antd-mobile";

export default {
  namespace: "doneProcessModel",

  state: {
    data: "审批管理-待我审批",
    loading: false,
    TodoTaskList: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      Toast.loading("Loading...");
      const response = yield call(queryDoneProcessByPage, payload);
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
        TodoTaskList: payload.data,
        total: payload.data ? payload.data.total : 0
      };
    }
  }
};
