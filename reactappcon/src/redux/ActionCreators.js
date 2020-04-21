//Goal is to define redux actions and implement action creators
//and dispatch actions from the action creators to update system state in redux store

import * as ActionTypes from './ActionTypes';
import { DISHES} from '../shared/dishes';
import { baseUrl } from '../shared/baseUrl';

export const addComment = (dishId, rating, author, comment) => {
    return (
        {
            type: ActionTypes.ADD_COMMENT,
            payload: {
                dishId: dishId,
                rating:rating,
                author:author,
                comment: comment
            }
        }
    );
}

//middleware(thunk) returns as function so with innner func to enable aync calls
export const fetchDishes = () => (dispatch) => {

    dispatch(dishesLoading(true));

    return fetch(baseUrl + 'dishes')
        .then(response => {
            if (response.ok) {
              return response;  
            } else {
                var error = new Error('Error ' + response.status + ': ' + 
                    response.statusText); //when able to reach server but error response
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess; //when react can't even reach server
        })
        .then(response => response.json())
        .then(dishes => dispatch(addDishes(dishes)))
        .catch(error => dispatch(dishesFailed(error.message)));
};

//other action creators
export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
});

export const dishesFailed = (errmess) => ({
    type: ActionTypes.DISHES_FAILED,
    payload: errmess
});

export const addDishes = (dishes) => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes
});

//fetch comments
export const fetchComments = () => (dispatch) => {
   
    return fetch(baseUrl + 'comments')
        .then(response => {
            if (response.ok) {
            return response;  
            } else {
                var error = new Error('Error ' + response.status + ': ' + 
                    response.statusText); //when able to reach server but error response
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess; //when react can't even reach server
        })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)));

};

export const commentsFailed = (errmess) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

export const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});

//promos
export const fetchPromos = () => (dispatch) => {
    dispatch(promosLoading(true));

    return fetch(baseUrl + 'promotions')
        .then(response => {
            if (response.ok) {
            return response;  
            } else {
                var error = new Error('Error ' + response.status + ': ' + 
                    response.statusText); //when able to reach server but error response
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess; //when react can't even reach server
        })
        .then(response => response.json())
        .then(promos => dispatch(addPromos(promos)))
        .catch(error => dispatch(promosFailed(error.message)));

};

export const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmess
});

export const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});
