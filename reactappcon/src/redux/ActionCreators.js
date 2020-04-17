//Goal is to define redux actions and implement action creators
//and dispatch actions from the action creators to update system state in redux store

import * as ActionTypes from './ActionTypes';

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