import {
  queryMessagesByPage,
  showMessageDetails,
  queryMessagePreview
} from "../services/infoCenter";
import { Toast } from "antd-mobile";

export default {
  namespace: "infoCenterModel",
  state: {
    loading: false,
    messageList: {},
    messageDetails: {},
    messagePreview: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *queryMessagePreview({ payload }, { call, put }) {
      const response = yield call(queryMessagePreview, payload);
      if (response.status === "200") {
        yield put({
          type: "messagePreview",
          payload: response.data
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    *messageList({ payload }, { call, put }) {
      const response = yield call(queryMessagesByPage, payload);
      if (response.status === "200") {
        yield put({
          type: "messagesByPage",
          payload: response.data
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    *messageDetails({ payload }, { call, put }) {
      const response = yield call(showMessageDetails, payload);
      if (response.status === "200") {
        yield put({
          type: "showMessageDetails",
          payload: response.data
        });
      } else {
        Toast.offline(response.msg);
      }
    }
  },
  reducers: {
    messagePreview(state, { payload }) {
      return {
        ...state,
        messagePreview: payload
      };
    },
    messagesByPage(state, { payload }) {
      return {
        ...state,
        messageList: payload
      };
    },
    showMessageDetails(state, { payload }) {
      return {
        ...state,
        messageDetails: payload
      };
    }
  }
};
