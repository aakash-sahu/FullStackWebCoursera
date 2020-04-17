//convienent method to configure store.. not needed necessarily
import { createStore, combineReducers } from 'redux';
// import { Reducer, initialState } from './reducer';
// To combine multiple reducers
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Leaders } from './leaders';
import { Promotions } from './promotions';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders
        })
    );

    return store;
}