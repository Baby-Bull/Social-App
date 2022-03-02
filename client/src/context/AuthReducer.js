const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.load,
                isFetching: false,
                error: false
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.load
            }
        case "LOGOUT":
            return {
                user: null,
                isFetching: false,
                error: false
            }
        default:
            return state;
    }
};
export default AuthReducer;