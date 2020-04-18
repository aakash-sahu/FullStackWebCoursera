// split the mgmt of state into different reducers that manage partial state
// import { DISHES} from '../shared/dishes';
import * as ActionTypes from './ActionTypes'

export const Dishes = (state={
        isLoading: true,
        errMess: null,
        dishes: []
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DISHES:
            return {...state,isLoading: false, errMess:null, dishes:action.payload }

        case ActionTypes.DISHES_LOADING:
            return {...state,isLoading:true, errMess:null, dishes:[] } //spread operator returns not modifies..adding others in case in middle of page loading

        case ActionTypes.DISHES_FAILED:
            return {...state,isLoading: false, errMess:action.payload, dishes:[] }
        default:
            return state;
    }
}