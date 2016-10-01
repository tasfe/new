const LOAD = 'profile/LOAD';
const LOAD_SUCCESS = 'profile/LOAD_SUCCESS';
const LOAD_FAIL = 'profile/LOAD_FAIL';

const SAVE = 'profile/SAVE';
const SAVE_SUCCESS = 'profile/SAVE_SUCCESS';
const SAVE_FAIL = 'profile/SAVE_FAIL';

const initialState = {
    loaded: false,
    loadUser: {}
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case LOAD:
            return {
                ...state,
                loading: true
            };
        case LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                loadUser: action.result.root
            };
        case LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                loadError: action.error
            };
        case SAVE:
            return {
                ...state,
                loading: true
            };
        case SAVE_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                saveUser: action.result,
            };
        case SAVE_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                saveError: action.error
            };

        default:
            return state;
    }
}

export function getUserDetail(data) {
    return {
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: () => ajax({url: '/acct/userinfo/userdetail.json', data: data})
    };

}

export function saveUserDetail (data) {
    return {
        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
        promise: () => ajax({url: '/acct/userinfo/saveuser.json', data: data})
    };

}

