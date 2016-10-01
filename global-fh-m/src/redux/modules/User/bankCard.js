const LOAD = 'bankCard/LOAD';
const LOAD_SUCCESS = 'bankCard/LOAD_SUCCESS';
const LOAD_FAIL = 'bankCard/LOAD_FAIL';

const SAVE = 'bankCard/SAVE';
const SAVE_SUCCESS = 'bankCard/SAVE_SUCCESS';
const SAVE_FAIL = 'bankCard/SAVE_FAIL';

const DEL = 'bankCard/DEL';
const DEL_SUCCESS = 'bankCard/DEL_SUCCESS';
const DEL_FAIL = 'bankCard/DEL_FAIL';

const LOCK = 'bankCard/LOCK';
const LOCK_SUCCESS = 'bankCard/LOCK_SUCCESS';
const LOCK_FAIL = 'bankCard/LOCK_FAIL';

const VERIFY = 'bankCard/VERIFY';
const VERIFY_SUCCESS = 'bankCard/VERIFY_SUCCESS';
const VERIFY_FAIL = 'bankCard/VERIFY_FAIL';


const LOADBANK = 'bankCard/LOADBANK';
const LOADBANK_SUCCESS = 'bankCard/LOADBANK_SUCCESS';
const LOADBANK_FAIL = 'bankCard/LOADBANK_FAIL';

const LOADPROVINCE = 'bankCard/LOADPROVINCE';
const LOADPROVINCE_SUCCESS = 'bankCard/LOADPROVINCE_SUCCESS';
const LOADPROVINCE_FAIL = 'bankCard/LOADPROVINCE_FAIL';

const initialState = {
    loaded: false,
    cardList: []
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case LOAD:
            return {
                ...state,
            };
        case LOAD_SUCCESS:
            return {
                ...state,
                locked: action.result.root?action.result.root.locked:true,
                cardList: action.result.root?action.result.root.cardList:[]
            };
        case LOAD_FAIL:
            return {
                ...state,
                loadError: action.error
            };
        case SAVE:
        return {
            ...state,
        };
        case SAVE_SUCCESS:
            return {
                ...state,
                saveCard: action.result,
            };
        case SAVE_FAIL:
            return {
                ...state,
                saveError: action.error
            };

        case LOADBANK:
            return {
                ...state,
            };
        case LOADBANK_SUCCESS:
            return {
                ...state,
                loadBank: action.result,
            };
        case LOADBANK_FAIL:
            return {
                ...state,
                loadBankError: action.error
            };

        case LOADPROVINCE:
            return {
                ...state,
            };
        case LOADPROVINCE_SUCCESS:
            return {
                ...state,
                loadProvince: action.result,
            };
        case LOADPROVINCE_FAIL:
            return {
                ...state,
                loadProvinceError: action.error
            };

        default:
            return state;
    }
}

export function getBankCardList() {
    return {
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: () => ajax({url: '/fund/bankcard/cardlist.json'})
    };

}

//export function saveBankCard (data) {
//    return {
//        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
//        promise: () => ajax({url: '/acct/userinfo/saveuser.json', data: data})
//    };
//
//}
//
//export function delBankCard (data) {
//    return {
//        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
//        promise: () => ajax({url: '/fund/bankcard/delcard.json', data: data})
//    };
//
//}
//
//export function lockBankCard (data) {
//    return {
//        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
//        promise: () => ajax({url: '/fund/bankcard/lockcard.json', data: data})
//    };
//
//}
//
//export function verifyBankCard (data) {
//    return {
//        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
//        promise: () => ajax({url: '/fund/bankcard/verifycard.json', data: data})
//    };
//}


export function getBankList (data) {
    return {
        types: [LOADBANK, LOADBANK_SUCCESS, LOADBANK_FAIL],
        promise: () => ajax({url: '/fund/bankcard/banklist.json', data: data})
    };
}



export function getProvinceList (data) {
    return {
        types: [LOADPROVINCE, LOADPROVINCE_SUCCESS, LOADPROVINCE_FAIL],
        promise: () => ajax({url: '/info/city/provincelist.json', data: data})
    };
}

