import './BoardContainer.css';

import boardStore from '../store/boardStore';
import AddBoardModal from './AddBoardModal';
import Board from './Board';


class BoardContainer {
	constructor() {
		this.element = document.createElement('div');

		this.boards = boardStore.getState().boards;

		this.clickAddBoardButtonHandler = this.clickAddBoardButtonHandler.bind(
			this,
		);
		this.dragOverHandler = this.dragOverHandler.bind(this);
		this.dropHandler = this.dropHandler.bind(this);

		boardStore.subscribe(this.createNewBoard, this);
		boardStore.subscribe(this.deleteBoard, this);
	}

	render() {
		this.element.className = 'board-container';
		
		this.boards.forEach(board => {
			this.element.appendChild(new Board(board).render());
		});

		const button = `<button class='board-container__add-button'>Add Board</button>`;
		this.element.insertAdjacentHTML('beforeend', button);

		this.element.addEventListener('click', this.clickAddBoardButtonHandler);
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('drop', this.dropHandler);

		return this.element;
	}

	clickAddBoardButtonHandler(event) {
		if (!event.target.closest('.board-container__add-button')) {
			return;
		}
		event.preventDefault();
		const boardContainer = document.querySelector('.board-container');
		const AddBoardModal = new AddBoardModal();
		boardContainer.appendChild(AddBoardModal.render());
	}

	createNewBoard() {
		const { boards } = boardStore.getState();
		if (boards.length <= this.boards.length) {
			return;
		}
		this.boards = boards;
		const target = this.element.querySelector('.board-container__add-button');
		const board = this.boards[this.boards.length -1 ];
		target.insertAdjacentElement('beforebegin', new Board(board).render());
	}

	dragOverHandler(event) {
		event.stopPropagation();
		if (
			!(
				event.target.closest('.board') &&
				[...event.dataTransfer.types].includes('board-id')
			)
		) {
			return;
		}
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
		const target = event.target.closest('.board');
		const { draggedBoard } = boardStore.getState();
		if (target.nextSibling === draggedBoard) {
			target.insertAdjacentElement('beforebegin', draggedBoard);
		} else {
			target.insertAdjacentElement('afterend', draggedBoard);
		}
	}

	async dropHandler(event) {
		if (![...event.dataTransfer.types].includes('board-id')) {
			return;
		}

		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		const { draggedBoard } = boardStore.getState();
		const previousBoardId = !!draggedBoard.previousSibling
			? draggedBoard.previousSibling.dataset.boardID
			: null;
		const uri = '/api/boards';
		const body = { previousBoardId, id: draggedBoard.dataset.boardId };
		try {
			const response = await fetch(uri, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const { message } = await response.json();
			if (!response.ok) {
				throw new Error(message);
			}
		} catch {
			alert('보드를 이동하지 못 했습니다.');
		}
	}

	deleteBoard() {
		const {boards } = boardStore.getState();
		if (this.boards <= boards) {
			return ;
		}
		this.boards = boards;
	}

}

export default BoardContainer;