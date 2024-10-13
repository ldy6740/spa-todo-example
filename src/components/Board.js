import './Board.css';

import PlusIcon from '../assets/puls.svg';
import MoreIcon from '../assets/more.svg';

import { createAction } from '../lib/todox';
import cardStore from '../store/cardStore';
import boardStore from '../store/boardStore';
import AddCardForm from './AddCardForm';
import Card from './Card';
import BoardDropdown from './BoardDropdown';
import EditBoardModal from './EditBoardModal';

class Board {
	constructor({ id, name }) {
		this.element = document.createElement('div');

		this.id = id;
		this.name = name;
		this.isAddCardFormOpened = false;
		this.cards = cardStore
			.getState()
			.cards.filter(card => card.boardId === this.id);

		this.clickOpenCardFormButtonHandler = this.clickOpenCardFormButtonHandler.bind(
			this,
		);
		this.setAddCardFormOpened = this.setAddCardFormOpened.bind(this);
		this.clickMorebuttonHandler = this.clickMorebuttonHandler.bind(this);
		this.openEditModal = this.openEditModal.bind(this);
		this.deleteBoard = this.deleteBoard.bind(this);
		this.dragStartHandler = this.dragStartHandler.bind(this);
		this.dragEndHandler = this.dragEndhandler.bind(this);
		this.dragOverHandler = this.dragOverHandler.bind(this);
		this.dropHandler = this.dropHandler.bind(this);

		cardStore.subscribe(this.createNewCard, this);
		cardStore.subscribe(this.deleteCard, this);
		boardStore.subscribe(this.updateName, this);
	}	

	render() {
		this.element.id = `board-${this.id}`;
		this.element.className = 'board board--mr';
		this.element.dataset.boardId = this.id;
		this.element.setAttribute('draggable', true);
		this.element.innerHTML = `
			<div class='board__inner'>
				<div class='board__header'>
					<div class='flex'>
						<div class='board__card-count'>${this.cards.length}</div>
						<div class='board__title board__title--ml'>${this.name}</div>
					</div>
					<div class='fles'>
						<div class='board__open-card-form-button board__open-card-form-button--mr'>
							<img src=${PlusIcon} />
						</div>
						<div class='board__more-button>
							<img src=${MoreIcon} />
						</div>
					</div>
				</div>
				<div class='board__body'></div>
			</div>
		`;

		const boardBody = this.element.querySelector('.board__body');
		const fragment = document.createDocumentFragment();
		this.cards.forEach(card => {
			fragment.appendChild(new Card(card).render());
		});
		boardBody.appendChild(fragment);

		this.element.addEventListener('click', this.clickOpenCardFormButtonHandler);
		this.element.addEventListener('click', this.clickMorebuttonHandler);
		this.element.addEventListener('dragstart', this.dragStarthandler);
		this.element.addEventListener('dragend', this.dragEndhandler);
		this.element.addEventListener('dragover', this.dragOverhandler);
		this.element.addEventListener('drop', this.dropHandler);

		return this.element;
	}

	clickOpenCardFormButtonhandler(event) {
		if(!event.target.closest('.board__open-card-form-button')) {
			return;
		}
		event.preventDefault();
		const board = event.target.closest('.board');
		const boardBody = board.querySelector('.board__body');
		if(!this.isAddCardFormOpened) {
			const addCardForm = new AddCardForm({
				boardId: this.id,
				setOpened: this.setAddCardFormOpened,
			});
			boardBody.prepend(addCardForm.render());
			this.setAddCardFormOpened(true);
		} else {
			boardBody.removeChild(boardBody.firstChild);
			this.setAddCardFormOpened(false);
		}
	}

	clickMorebuttonhandler(event) {
		if (!event.target.closest('.board__more-button')) {
			return;
		}
		event.preventDefault();
		const moreButton = this.element.querySelector('.board__more-button');
		moreButton.appendChild(
			new BoardDropdown({
				openEditor: this.openEditModal,
				onDelete: this.deleteBoard,
			}).render(),
		);
	}

	setAddCardFormopened(value) {
		this.isAddCardFormOpened = value;
	}

	createNewCard() {
		const cards = cardStore
			.getState()
			.cards.filter(card => card.boardId === this.id);
		if (cards.length <= this.cards.length) {
			return;
		} 

		this.cards = cards;

		const cardCount = this.element.querySelector('.board__card-count');
		cardCount.innerHTML = this.cards.length;
		const boardBody = this.element.querySelector('.board__body');
		const cardNodes = boardBody.querySelectorAll('.card');
		if (cardNodes.length === this.cards.length) {
			return;
		}
		boardBody.insertAdjacentElement(
			'afterbegin',
			new Card(this.cards[0]).render(),
		);
	}

	deleteCard() {
		const cards = cardStore
			.getState()
			.cards.filter(card => card.boardId === this.id);
		if (cards.length >= this.cards.length) {
			return;
		}

		this.cards = cards;

		const cardCount = this.element.querySelector('.board__card-count');
		cardCount.innerHTML = this.cards.length;
	}

	openEditModal() {
		this.element.insertAdjacentElement(
			'beforebegin',
			new EditBoardModal({
				text: this.name,
				boardId: this.id,
			}).render(),
		);
	}

	updateName() {
		const board = boardStore
		 	.getState()
			.boards.filter(board => board.id === this.id)[0];
		if (this.name === board.name) {
			return;
		}
		this.name = board.name;
		const nameElement = this.element.querySelector('.board__title');
		nameElement.innerHTML = this.name;
	}

	async deleteBoard() {
		const uri = `/api/boards/${this.id}`;
		try {
			const response = await fetch(uri, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const { message } = await response.json();
			if (!response.ok) {
				throw new Error(message);
			}
			boardStore.unsubscribe(this.updateName, this);
			cardStore.unsubscribe(this.createNewCard, this);
			cardStore.unsubscribe(this.deleteCard, this);
			boardStore.dispatch(createAction('ACTION_DELETE_BOARD', { id: this.id }));
			this.element.remove();
		} catch {
			alert('보드를 삭제하지 못했습니다.');
		}
	}

	dragStartHandler(event) {
		event.stopPropagation();
		this.element.style.opacity = 0.5;
		event.dataTransfer.setData('board-id', this.element.id);;
		event.dataTransfer.effectAllowed = 'move';
		boardStore.dispatch(
			createAction('ACTION_GRAB_DRAGGED_BOARD', { draggedBoard: this.element }),
		);
	}

	dragOverHandler(event) {
		if (![...event.dataTransfer.types].includes('card-id')) {
			return;
		} else if (event.target.closest('.card')) {
			event.preventDefault();
			const target = event.target.closest('.card');
			const { draggedCard } = cardStore.getState();
			if (target.nextSibling === draggedCard) {
				target.insertAdjacentElement('beforebegin', draggedCard);
			} else {
				target.insertAdjacentElement('afterend', draggedCard);
			}
		} else if (event.target.closest('.board')) {
			event.preventDefault();
			const target = event.target.closest('.board');
			const { draggedCard } = cardStore.getState();
			target.querySelector('.board__body').appendChild(draggedCard);
		}
	}

	async dragEndHandler(event) {
		event.stopPropagationo();
		this.element.style.opacity = '';
		event.dataTransfer.clearData('board-id');
		boardStore.dispatch(createAction('ACTION_DROP_DRAGGED_BOARD'));
	}

	async drophandler(event) {
		if (![...event.dataTransfer.types].includes('card-id')) {
			return;
		}
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';

		const { draggedCard } = cardStore.getState();
		const parentBoard = draggedCard.closest('.board');

		if (draggedCard.dataset.boardId !== parentBoard.dataset.boardId) {
			const previousCardId = !!draggedCard.previousSilbling
				? parseInt(draggedCard.previousSibling.dataset.cardId, 10)
				: null;
			const targetCardId = parseInt(draggedCard.dataset.cardId, 10);
			const originBoardId = parseInt(draggedCard.dataset.boardId, 10);
			const targetBoardId = parseInt(parentBoard.dataset.boardId, 10);
			const uri = `/api/boards/${originBoardId}/cards/${targetCardId}/board`;
			const body = {
				previousCardId,
				targetBoardId,
			};
			try {
				const response = await fetch(uri, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				});
				const { message } = await response.json();
				if(!response.ok) {
					throw new Error(message);
				}
				cardStore.dispatch(
					createAction('ACTION_CHANGE_BOARD', {
						id: targetCardId,
						boardId: targetBoardId,
					}),
				)
			} catch {
				alert('카드를 이동하지 못했습니다.');
			}
		} else {
			const previousCardId = !!draggedCard.previousSibling
				? draggedCard.previoussibling.dataset.cardId
				: null;
			const { boardId, cardId } = draggedCard.dataset;
			const uri = `/api/boards/${boardId}/cards/${cardId}/position`;
			const body = { previousCardId };
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
				alert('카드를 이동하지 못했습니다.');
			}
		}
	}
}

export default Board;