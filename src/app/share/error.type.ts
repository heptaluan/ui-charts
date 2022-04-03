export const REQUEST_SUCCESS = 1000;
export const REQUEST_SYS_ERROR = 1001;
export const REQUEST_TOO_FAST = 1002;
export const REQUEST_PARAM_ERROR = 1003;
export const REQUEST_PAGE_EXPIRE = 1004;

export const REQUEST_USER_NOT_EXIT = 2001;
export const REQUEST_PASSWORD_ERROR = 2002;
export const REQUEST_IMAGE_VALIDATE_ERROR = 2003;
export const REQUEST_SMS_ERROR = 2004;
export const REQUEST_SMS_EXPIRE = 2005;
export const REQUEST_PWD_FORMAT_ERROR = 2006;
export const REQUEST_USER_NOT_LOGIN = 2007;
export const REQUEST_FLOOD_SMS = 2008;

export const REQUEST_PHONE_FORMAT_ERROR = 2009;
export const REQUEST_PHONE_NOT_EXIST = 2010;
export const REQUEST_PHONE_EXIST = 2011;
export const REQUEST_PHONE_ERROR = 2015;

export const REQUEST_EMAIL_FORMAT_ERROR = 2012;
export const REQUEST_EMAIL_NOT_EXIST = 2013;
export const REQUEST_EMAIL_EXIST = 2014;
export const REQUEST_EMAIL_CODE_ERROR = 2016;

const ERROR_TIP = {
    1000: false,
    1001: '系统错误',
    1002: '请求频率太快，请稍后再试',
    1003: '请求参数错误，请联系工作人员',
    1004: '页面状态过期，请刷新页面',
    2001: '用户不存在',
    2002: '密码错误',
    2003: '图片验证码错误',
    2004: '短信验证码不正确',
    2005: '短信验证码过期',
    2006: '密码长度6-16位，只包含数字、字母和下划线',
    2007: '请先登录',
    2008: '获取验证码太频繁，请稍后再试',
    2009: '手机号格式错误',
    2010: '手机号不存在',
    2011: '手机号已存在',
    2015: '手机号错误',
    2012: '请输入正确的邮箱地址',
    2013: '邮箱不存在',
    2014: '该邮箱已被绑定，请重新输入',
    2016: '邮箱验证码错误',
};

export function getError(code) {
    console.log(ERROR_TIP[code]);
    const tip = code !== null ? (ERROR_TIP[code] !== null ? ERROR_TIP[code] : '未知错误') : '未知错误';
    return tip;
}
