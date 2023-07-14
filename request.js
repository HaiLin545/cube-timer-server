import axios from "axios";
import wx from "data/wx.js";

export function getOpenid(code) {
    return axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
        params: {
            appid: wx.appid,
            secret: wx.secret,
            js_code: code,
            grant_type: "authorization_code",
        }
    })
}