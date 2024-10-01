import { createStore } from '../lib/todox';

const ACTION_ADD_USER = 'ACTION_ADD_USER';

function reducer(state = {}, { type, payload }) {
	switch (type) {
		case ACTION_ADD_USER:
			return {
				...state,
				user: payload.user,
			};
		default: 
			return {
				...state,
			};
	}
}

const userStore = createStore({initialState: { user: null }, reducer});

export default userStore;