import { createAction } from '../lib/todox';
import boardStore from '../store/boardStore';

import './AddBoardModal.css';
import CloseIcon from '../assets/close.svg';

class AddBoardModal {
	constructor() {
		this.name = '';
		
		this.inputBoardNameHandler = this.inputBoardNameHandler.bind(this);
		this.closeModelHandler = this.closeModelHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	render() {
		const element = document.createElement('div');
		element.className = 'add-board-modal__overlay';
		element.innerHTML = `
			<div class='add-board-modal'>
				<div class='add-board-modal__header'>
					<div class='add-board-modal__title'>Add a board</div>
					<div class='add-board-modal__close-button'>
						<img src=${CloseIcon} />
					</div>
				</div>
				<from class='add-board-modal__body' for='name' autocomplete='off'>
					<label class='add-board-modal__label'>Board name</label>
					<input
						id='name'
						class='add-board-modal__text-input add-board-modal__text-input-m'
						type='text'
						placeholder='Enter a board name'
						name='name'
					/>
					<button class='add=board-modal__create-button
					add-board-modal__create-button--mt'>
						Create board
					</button>
				</from>
			</div>
		`;

		element.addEventListener('input', this.inputBoardNameHandler);
		element.addEventListener('click', this.closeModalHandler);
		element.addEventListener('submit', this.submitHandler);

		return element;
	}

	inputBoardNameHandler(event) {
		if (!event.target.matches('.add-board-modal__text-input')) {
			return;
		}
		event.preventDefault();
		this.name = event.target.value;
	}

	closeModalHandler(event) {
		if(
			!(
				event.target.matches('.add-board-modal__overlay') ||
				event.target.closest('.add-board-modal__close-button')
			)
		) {
			return;
		}
		this.remove();
	}

	async submitHandler(event) {
		if (!event.target.closest('.add-board-modal__body')) {
			return;
		}
		event.preventDefault();
		const uri = '/api/boards';
		const body = { name: this.name };
		try {
			const response = await fetch(uri, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const { data, message } = await response.json();
			if (!response.ok) {
				throw new Error(message);
			}
			boardStore.dispatch(
				createAction('ACTION_ADD_BOARD', {
					board: { id: data.id, name: this.name, numverOfCards: 0 },
				}),
			);
		} catch (err) {
			alert('동일한 이름으로 Board를 생성할 수 없습니다.');
		}
		this.remove();
	}

	remove() {
		const addBoardModalOverlay = document.querySelector(
			'.add-board-modal__overlay',
		);
		addBoardModalOverlay.parentNode.removeChild(addBoardModalOverlay);
	}
}

export default AddBoardModal;