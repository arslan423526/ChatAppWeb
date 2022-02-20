import {ADD_CALL, CLEAR_CALL} from "../Constants";


export const callReducer = (state = {call: {}}, action) => {

    switch (action.type) {
        case ADD_CALL:
            return action.payload

        case
        CLEAR_CALL:
            return {
                ...state,
                call: {},
            }

        default:
            return state
    }
}
