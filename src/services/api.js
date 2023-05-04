//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
const WEB_URL = process.env.VUE_APP_API_WEB_URL
module.exports = {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    LOGFRESH: `${BASE_URL}/auth/refresh`,
    ROUTES: `${BASE_URL}/route/tree`,
    ROUTE: `${BASE_URL}/route`,
    ROUTE_SN: `${BASE_URL}/route/sn`,
    ROUTE_SN2: `${BASE_URL}/route/sn2`,
    ROUTE_VISIT: `${BASE_URL}/route/visit`,
    FAVOR: `${BASE_URL}/favor`,
    FAVOR_SN: `${BASE_URL}/favor/sn`,
    FAVOR_SN2: `${BASE_URL}/favor/sn2`,
    SITE: `${BASE_URL}/site`,
    PARA: `${BASE_URL}/para`,
    PARA_SN: `${BASE_URL}/para/sn`,
    PARA_SN2: `${BASE_URL}/para/sn2`,
    PARA_SET: `${BASE_URL}/para/set`,
    PARA_TREE: `${BASE_URL}/para/tree`,
    ROLE: `${BASE_URL}/role`,
    ROLE_ROUTE: `${BASE_URL}/role/route`,
    ROLE_USER: `${BASE_URL}/role/user`,
    USER_MY: `${BASE_URL}/user/my`,
    USER: `${BASE_URL}/user`,

    KANBAN: `${BASE_URL}/para/21`,
    KANBAN_PRODUCT_PLANT: `${BASE_URL}/para/22`,
    KANBAN_PRODUCT_SYS_LINE: `${BASE_URL}/para/26`,

    ERP_HR: `${BASE_URL}/erp/hr`,
    ERP_HR_EMPLOYEE: `${BASE_URL}/erp/hr/employee`,
    ERP_HR_DEPARTMENT: `${BASE_URL}/erp/hr/department`,
    ERP_HR_ONDUTY: `${BASE_URL}/erp/hr/onduty`,
    ERP_MRP: `${BASE_URL}/erp/mrp`,
    IOT_PP_EQUIP: `${BASE_URL}/iot/pp/equip`,
    IOT_PP_DATA: `${BASE_URL}/iot/pp/data`,

    SFCS_RSBU: `${BASE_URL}/sfcs/rsbu`,
    SFCS_RSBU_IO: `${BASE_URL}/sfcs/rsbu/io`,
    SFCS_RSBU_FPY: `${BASE_URL}/sfcs/rsbu/fpy`,
    SFCS_RSBU_FPYDATA: `${BASE_URL}/sfcs/rsbu/fpydata`,
    SFCS_RSBU_SITE: `${BASE_URL}/sfcs/rsbu/site`,
    SFCS_RSBU_DEFECT: `${BASE_URL}/sfcs/rsbu/defect`,
    SFCS_RSBU_CONST: `${BASE_URL}/sfcs/rsbu/constset`,
    SFCS_G5: `${BASE_URL}/sfcs/g5`,
    SFCS_G3: `${BASE_URL}/sfcs/g3`,
    SFCS_LCM: `${BASE_URL}/sfcs/lcm`,
    SFCS_PP: `${BASE_URL}/sfcs/pp`,
    SFCS_POWER: `${BASE_URL}/sfcs/power`,
    SFCS_SMT: `${BASE_URL}/sfcs/smt`,

    EF_MAIL:`${BASE_URL}/ef/mail`,
    EF_CH: `${BASE_URL}/ef/ch`,
    EF_CH_SITE: `${BASE_URL}/ef/ch/site`,
    EF_CH_ITEM: `${BASE_URL}/ef/ch/item`,
    EF_CH_IO: `${BASE_URL}/ef/ch/io`,
    EF_IOT: `${BASE_URL}/ef/iot`,
    EF_PC: `${BASE_URL}/ef/pc`,
    EF_FILE: `${BASE_URL}/ef/file`,
    EF_PC_INSERTETD: `${BASE_URL}/ef/pc/insertEtd`,
    EF_SAFTY: `${BASE_URL}/ef/safty`,
    EF_SAFTY_RECORD: `${BASE_URL}/ef/safty/record`,

    FILE_UPLOAD: `${BASE_URL}/file/upload`,
    FILE_ACTION: `${BASE_URL}/file/action`,
    FILE: `${BASE_URL}/file`,

    FILE_WEB: `${WEB_URL}/file`,
    EFCH: `${WEB_URL}/ef/ch`,

    WORKER: `${BASE_URL}/worker`,
    TRAINING: `${BASE_URL}/training`,
    APS: `${BASE_URL}/apswo`,
    STREAM: `${BASE_URL}/stream`,
    VBOARD: `${BASE_URL}/vboard`,

    APIDATE: `${BASE_URL}/smtdata`,
    IQCDATA: `${BASE_URL}/iqcdata`,
    RSBUDATA: `${BASE_URL}/rsbudata`,

    KAN_BAN: `${BASE_URL}/kbentrance`,
}
