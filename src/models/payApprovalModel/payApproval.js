import { savePay, queryPaymentDetails, sendApproval, sendApprovalNo, withdrawPayment } from "../../services/payApproval";
import { Toast } from "antd-mobile";

export default {
  namespace: "payApproval",
  state: {
      savePay: {},
      payDetails: {},
      sendStatus: false
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *addPay({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(savePay, payload);
      if (response.status == "200") {
        yield put({
          type: "savePay",
          payload: response
        });
        if (callback) callback();
      } else {
        Toast.offline(response.msg);
      }
    },
    *queryPayment({ payload }, { call, put }) {
      const response = yield call(queryPaymentDetails, payload);
      if (response.status === '200') {
        yield put({
          type: 'payDetails',
          payload: response.data,
        });
      } else {
          Toast.offline(response.msg);
      }
    },
    *sendApproval({ payload }, { call, put }) {
      const response = yield call(sendApproval, payload);
      if (response.status === '200') {
        yield put({
          type: 'sendStatus',
          payload: true,
        });
      } else {
          Toast.offline(response.msg);
      }
    },
    *sendApprovalNo({ payload }, { call, put }) {
      const response = yield call(sendApprovalNo, payload);
      if (response.status === '200') {
        yield put({
          type: 'sendStatus',
          payload: true,
        });
      } else {
          Toast.offline(response.msg);
      }
    },
    *withdrawPayment({ payload }, { call, put }) {
      const response = yield call(withdrawPayment, payload);
      if (response.status === '200') {
        yield put({
          type: 'sendStatus',
          payload: true,
        });
      } else {
          Toast.offline(response.msg);
      }
    },
  },
  reducers: {
    savePay(state, { payload }) {
      return {
        ...state,
        savePay: payload
      };
    },
    payDetails(state, { payload }) {
      return {
        ...state,
        payDetails: payload,
      };
    },
    sendStatus(state, { payload }) {
      return {
        sendStatus: true,
      };
    },
  }
};
