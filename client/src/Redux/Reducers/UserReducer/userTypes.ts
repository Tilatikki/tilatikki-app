export enum ActionType {
    CREATE_USER_BEGINS = "CREATE_USER_BEGINS",
    CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS",
    CREATE_USER_FAILURE = "CREATE_USER_FAILURE",

    DELETE_USER_BEGINS = "DELETE_USER_BEGINS",
    DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS",
    DELETE_USER_FAILURE = "DELETE_USER_FAILURE",

    UPDATE_USER_BEGINS= "UPDATE_USER_BEGINS",
    UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS",
    UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE",

    FORGOT_PASSWORD_BEGINS = "FORGOT_PASSWORD_BEGINS",
    FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS",
    FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE",

    RESET_PASSWORD_BEGINS = "RESET_PASSWORD_BEGINS",
    RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
    RESET_PASSWORD_FAILURE = "RESET_PASSWORD_FAILURE",

    GET_ALL_USERS_BEGINS = "GET_ALL_USERS_BEGINS",
    GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS",
    GET_ALL_USERS_FAILURE = "GET_ALL_USERS_FAILURE",

    GET_USER_BY_ID_BEGINS = "GET_USER_BY_ID_BEGINS",
    GET_USER_BY_ID_SUCCESS = "GET_USER_BY_ID_SUCCESS",
    GET_USER_BY_ID_FAILURE = "GET_USER_BY_ID_FAILURE",

    LOGIN_USER_BEGINS = "LOGIN_USER_BEGINS",
    LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS",
    LOGIN_USER_FAILURE = "LOGIN_USER_FAILURE",

    LOGOUT_USER_BEGINS = "LOGOUT_USER_BEGINS",
    LOGOUT_USER_SUCCESS = "LOGOUT_USER_SUCCESS",
    LOGOUT_USER_FAILURE = "LOGOUT_USER_FAILURE",

    GET_ME_BEGINS = "GET_ME_BEGINS",
    GET_ME_SUCCESS = "GET_ME_SUCCESS",
    GET_ME_FAILURE = "GET_ME_FAILURE",
    
}