export const LoginStart = (useCredentials) => ({
    type: "LOGIN_START"
});

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    load: user
});
export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    load: error
});
export const Logout = () => ({
    type: "LOGOUT"
});
