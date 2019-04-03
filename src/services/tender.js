import { stringify } from 'qs';
import request from '../utils/request';
import { purchaseUrl } from '../confingPath'

export async function queryMaterialTenderList(params) {
  return request(purchaseUrl+`/wechat/materialtender/getMaterialTenderList?${stringify(params)}`);
}
export async function queryLabourTenderList(params) {
  return request(purchaseUrl+`/wechat/labourtender/getLabourTenderList?${stringify(params)}`);
}

