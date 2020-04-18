//convienent method to configure store.. not needed necessarily
import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { Reducer, initialState } from './reducer';
// To combine multiple reducers
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Leaders } from './leaders';
import { Promotions } from './promotions';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders
        }), 
        applyMiddleware(thunk, logger) //applied as enhancer
    );

    return store;
}