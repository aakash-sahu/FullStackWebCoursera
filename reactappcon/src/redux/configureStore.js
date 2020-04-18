//convienent method to configure store.. not needed necessarily
import { createStore, combineReducers, applyMiddleware } from 'redux';
// import { Reducer, initialState } from './reducer';
import { createForms } from 'react-redux-form';
// To combine multiple reducers
import { Dishes } from './dishes';
import { Comments } from './comments';
import { Leaders } from './leaders';
import { Promotions } from './promotions';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { InitialFeedback } from './forms';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dishes: Dishes,
            comments: Comments,
            promotions: Promotions,
            leaders: Leaders,
            ...createForms({
                feedback: InitialFeedback
            })
        }), 
        applyMiddleware(thunk, logger) //applied as enhancer
    );

    return store;
}