import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import * as voximplant from 'voximplant-websdk'
import {composeWithDevTools} from "redux-devtools-extension";
import {callReducer} from "./reducers/callReducers";

const reducer = combineReducers({

    call: callReducer,
})

const initialState = {
    call: {},
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store
