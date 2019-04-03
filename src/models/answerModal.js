import { queryTenderQuestionByPage, saveReply } from "../services/answer";
import { Toast } from "antd-mobile";

export default {
  namespace: "answerModal",
  state: {
    questionByPage: {},
    saveAnswer: false,
    questionByPageList: []
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  },
  effects: {
    *queryTenderQuestionByPage({ payload }, { call, put }) {
      const response = yield call(queryTenderQuestionByPage, payload);
      if (response.status === "200") {
        yield put({
          type: "questionByPage",
          payload: {
            questionByPage: response.data,
            questionByPageList: response.data ? response.data.records : [],
            current: payload.current
          }
        });
      } else {
        Toast.offline(response.msg);
      }
    },

    *saveReply({ payload }, { call, put }) {
      const response = yield call(saveReply, payload);
      if (response.status == "200") {
        yield put({
          type: "saveAnswer",
          payload: true
        });
      } else {
        yield put({
          type: "saveAnswer",
          payload: false
        });
        Toast.offline(response.msg);
      }
    }
  },
  reducers: {
    questionByPage(
      state,
      { payload: { questionByPage, questionByPageList, current } }
    ) {
      return {
        ...state,
        questionByPage: questionByPage,
        questionByPageList:
          current == 1
            ? questionByPageList
            : state.questionByPageList.concat(questionByPageList)
      };
    },
    saveAnswer(state, { payload }) {
      return {
        ...state,
        saveAnswer: payload
      };
    }
  }
};
