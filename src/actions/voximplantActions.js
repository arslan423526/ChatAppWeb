import {CONNECT} from "../Constants";


export const connect = (sdk, ) => async (dispatch) => {

    dispatch({
        type: CONNECT,
        payload: sdk
    })
}


