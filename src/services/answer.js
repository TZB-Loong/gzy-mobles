import { stringify } from "qs";
import request from "../utils/request";
import {purchaseUrl} from '../confingPath'

//答疑列表
export async function queryTenderQuestionByPage(params) {
  return request(purchaseUrl + `/wechat/question/queryTenderQuestionByPage?${stringify(params)}`);
}
//回复答疑
export async function saveReply(params) {
  return request(purchaseUrl + '/wechat/question/saveReply', {
    method: 'POST',
    body: params,
  });
}