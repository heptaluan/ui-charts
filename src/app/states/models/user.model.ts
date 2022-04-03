/*
 * @Description: 个人设置Modal
 */

export interface SetUserInfo {
    avatar?: any;
    nickname: string;
    intro: string;
    site: string;
}

export interface UserInfo {
    id: number;
    loginname: string;
    email: string;
    phoneno: string;
    sex: number;
    avatar: string;
    nickname: string;
    intro: string;
    site: string;
    is_vip: boolean;
    ver?: number;
}

export interface UserBillItem {
    pro_name: string;
    invate_code: string;
    pay_type?: string;
    time: string;
    price: number | string;
    total_time?: string;
    type?: string;
    discount?: string;
}

export interface UserBill {
    duration: string;
    count: number;
    order: UserBillItem[];
}
