import {ADD_CALL} from "../Constants";


export const addCall = (call, ) => async (dispatch) => {

    dispatch({
        type: ADD_CALL,
        payload: call
    })
}

