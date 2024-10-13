import { createAction } from '../lib/todox';
import boardStore from '../store/boardStore';

import Header from '../components/Header';
import BoardContainer from '../components/BoardContainer';

class MainPage {
	render() {
		const fragment = document.createDocumentFragment();
		const header = new Header();
		const boardContainer = new Boardcontainer();
		fragment.appendChild(header.render());
		fragment.appendChild(boardContainer.render());

		return fragment;
	}
}

export default MainPage;