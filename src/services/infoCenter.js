import { stringify } from "qs";
import request from "../utils/request";
import {purchaseUrl} from '../confingPath'
//微信端专用查询消息最新两条消息
export async function queryMessagePreview(params) {
  return request(purchaseUrl + `/wechat/base/message/queryMessagePreview?${stringify(params)}`);
}
//消息中心
export async function queryMessagesByPage(params) {
  return request(purchaseUrl + `/wechat/base/message/queryMessagesByPage?${stringify(params)}`);
}
//消息详情
export async function showMessageDetails(params) {
  return request(purchaseUrl + `/wechat/base/message/showMessageDetails?${stringify(params)}`);
}