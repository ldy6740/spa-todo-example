export function createStore({ initialState = {}, reducer }) {
	let state = initialState;
	const listeners = [];

	const getState = () => ({ ...state });

	const subscribe = (subscriber, context = null) => {
		listeners.push({ subscriber, context });
	};

	const unsubscribe = (subscriber, context = null) => {
		const newListeners = listeners.filter(
			listener => 
				!(listener.subscriber === subscriber  && listener.context === context),
		);
		listeners.splice(0, listeners.length, ...newListeners);
	};
	
	const publish = () => {
		listeners.forEach(({ subscriber, context }) => {
			subscriber.call(context);
		}) 
	}


	const dispatch = action => {
		state = reducer(state, action);
		publish();
	}

	return {
		getState,
		dispatch,
		subscribe,
		unsubscribe,
	};
	
}

export const createAction = (type, payload = {}) => ({
	type,
	payload,
});