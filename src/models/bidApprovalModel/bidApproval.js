import {
  queryBidList,
  reportCalibration,
  sendCalibration,
  backCalibration,
  withdrawCalibration,
  getBidList,
  getAgreements,
  batchUploadAgreement,
  getTenderCaseList
} from "../../services/bidApproval";
import { Toast } from "antd-mobile";

export default {
  namespace: "bidApproval",
  state: {
    examineList: [],
    sendStatus: false,
    saveBid: {},
    BidList: [],
    Agreements: [],
    saveStatus: false,
    tenderCaseList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    //查询投标列表
    *queryBidList({ payload }, { call, put }) {
      const response = yield call(queryBidList, payload);
      if (response.status == 200) {
        yield put({
          type: "queryBidListSave",
          payload: response
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    //提交审批
    *reportCalibration({ payload }, { call, put }) {
      const response = yield call(reportCalibration, payload);
      if (response.status != 200) {
        if (response.status == 2100) {
          yield put({
            type: "visibleChange"
          });
          Toast.offline(response.msg);
        } else {
          yield put({
            type: "initSave",
            payload: response.data
          });
          Toast.offline(response.msg);
        }
      } else {
        yield put({
          type: "saveBid",
          payload: response
        });
      }
    },
    //批准定标审批
    *sendCalibration({ payload }, { call, put }) {
      const response = yield call(sendCalibration, payload);
      if (response.status != 200) {
        Toast.offline(response.msg);
        yield put({
          type: "initSave",
          payload: response.data
        });
      } else {
        yield put({
          type: "sendCalibrationSuccess",
          payload: response.data
        });
        yield put({
          type: "sendStatus",
          payload: true
        });
      }
    },
    *backCalibration({ payload }, { call, put }) {
      const response = yield call(backCalibration, payload);
      if (response.status != 200) {
        Toast.fail(response.msg);
      } else {
        yield put({
          type: "sendStatus",
          payload: true
        });
      }
    },
    *withdrawCalibration({ payload }, { call, put }) {
      const response = yield call(withdrawCalibration, payload);
      if (response.status === "200") {
        yield put({
          type: "sendStatus",
          payload: true
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    // 合同
    *getBidList({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(getBidList, payload);
      if (response.status == "200") {
        yield put({
          type: "BidList",
          payload: response.data
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    *getAgreements({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(getAgreements, payload);
      if (response.status == "200") {
        yield put({
          type: "Agreements",
          payload: response.data
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    *batchUploadAgreement({ payload }, { call, put }) {
      const response = yield call(batchUploadAgreement, payload);
      if (response.status == "200") {
        yield put({
          type: "saveStatus",
          payload: true
        });
      } else {
        yield put({
          type: "saveStatus",
          payload: false
        });
        Toast.offline(response.msg);
      }
    },
    //中标方案链接
    *getTenderCaseList({ payload }, { call, put }) {
      const response = yield call(getTenderCaseList, payload);
      if (response.status == 200) {
        yield put({
          type: 'getTenderCaseListSave',
          payload: response.data,
        });
      } else {
        Toast.offline(response.msg);
      }
    },
  },
  reducers: {
    queryBidListSave(state, { payload }) {
      return {
        ...state,
        examineList: payload.data
      };
    },
    sendStatus(state, { payload }) {
      return {
        sendStatus: true
      };
    },
    saveBid(state, { payload }) {
      return {
        ...state,
        saveBid: payload
      };
    },
    BidList(state, { payload }) {
      return {
        ...state,
        BidList: payload
      };
    },
    Agreements(state, { payload }) {
      return {
        ...state,
        Agreements: payload
      };
    },
    saveStatus(state, { payload }) {
      return {
        ...state,
        saveStatus: payload
      };
    },
    getTenderCaseListSave(state, { payload }) {
      return {
        ...state,
        tenderCaseList: payload,
      };
    },
  }
};
