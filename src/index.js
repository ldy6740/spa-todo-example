import { createAction } from './lib/todox';

import userStore from './store/userStore';
import boardStore from './store/boardStore';
import cardStore from './store/cardStore';


import App from './App';

// NOTE 최초 진입시 화면 랜더
document.addEventListener('DOMContentLoaded', async () => {
	const root = document.getElementById('root');

	await initUser();
	
	if(userStore.getState().user) {
		await initTodos();
	}

	const app = new App();
	root.appendChild(app.render());
});

// NOTE user 정보 초기화 과정 
async function initUser() {
	const uri = '/api/user';

	try {
		const response = await fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		
		const { message, data } = await response.json();
		if(!response.ok) {
			throw new Error(message);
		}
		userStore.dispatch(createAction('ACTION_ADD_USER', { user: data }));
	} catch {
		return;
	}
}

// NOTE todo 정보 초기화 과정
async function initToDos() {
	const uri = '/api/boards';

	try {
		const response = await fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		
		const { message, data } = await response.json();
		if(!response.ok) {
			throw new Error(message);
		}

		boardStore.dispatch(createAction('ACTION_INIT_BOARDS', { boards: data }));
		
		for (const board of data) {
			const uri = `api/boards/${board.id}/cards`;
			try {
				const response = await fetch(uri, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const { message, data } = await response.json();
				if (!response.ok) {
					throw new Error(message);
				}
				cardStore.dispatch(createAction('ACTION_ADD_CARDS', { cards: data}));
			} catch {
				continue;
			}
		} 
	} catch {
		return ;
	}
}