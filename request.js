import axios from "axios";

const wx = {
    appid: "wx9e61090c0a980245",
    secret: "782235eaaad40aa8bd89ca9c1ec554e1",
}

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