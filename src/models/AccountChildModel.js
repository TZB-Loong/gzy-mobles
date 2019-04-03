import { showCorpMembers, showCorpMemberDetails } from "../services/wechatApi";
import { Toast } from "antd-mobile";

export default {
  namespace: "AccountChildModel",
  state: {
      membersList: [],
      CorpMembersDetails: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *showCorpMembers({ payload }, { call, put }) {
      const response = yield call(showCorpMembers, payload);
      if (response.status === '200') {
        yield put({
          type: 'CorpMembersList',
          payload: response.data,
        });
      } else {
        Toast.offline(response.msg);
      }
    },
    *showCorpMemberDetails({ payload }, { call, put }) {
      const response = yield call(showCorpMemberDetails, payload);
      if (response.status === '200') {
        yield put({
          type: 'CorpMembersDetails',
          payload: response.data,
        });
      } else {
        Toast.offline(response.msg);
      }
    },
  },
  reducers: {
    CorpMembersList(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        membersList: payload,
      };
    },
    CorpMembersDetails(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        CorpMembersDetails: payload,
      };
    },
  }
};
