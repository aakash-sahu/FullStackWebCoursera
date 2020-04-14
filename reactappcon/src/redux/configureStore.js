//convienent method to configure store.. not needed necessarily
import { createStore } from 'redux';
import { Reducer, initialState } from './reducer';

export const ConfigureStore = () => {
    const store = createStore(
        Reducer, 
        initialState
    );

    return store;
}