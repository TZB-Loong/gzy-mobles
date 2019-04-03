/*eslint-disable*/
import { queryMyProcessByPage } from "../../services/wechatApi";
import { Toast } from "antd-mobile";

export default {
  namespace: "myProcessModel",

  state: {
    data: "审批管理-我发起的",
    loading: false,
    TodoTaskList: {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      Toast.loading("Loading...");
      const response = yield call(queryMyProcessByPage, payload);
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
