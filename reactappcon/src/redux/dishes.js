// split the mgmt of state into different reducers that manage partial state
import { DISHES} from '../shared/dishes';

export const Dishes = (state=DISHES, action) => {
    switch (action.type) {
        default:
            return state;
    }
}