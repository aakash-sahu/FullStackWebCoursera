//moved all data object imports from main component --move to individual reducers
// Now this file can be deleted..

// export const initialState = {
//     dishes: DISHES,
//     promotions: PROMOTIONS,
//     leaders: LEADERS,
//     comments: COMMENTS
// };

// //reducer function-- as a pure function so can't modify state as it's immutable..
// //it returns a new state based on action send by dispatcher
// //set initialState as default to be used first time reducer is called i.e when state is undefined
// export const Reducer = (state = initialState, action) => {
//     return state;

// }