import request from '../utils/request';
import { stringify } from 'qs';
export async function query() {
  return request('/api/wechat/banner/bannerInfo?uniqueName=wechat_inquiry');
}

