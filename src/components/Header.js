import './Header.css';

class Header {
	render() {
		const element = document.createElement('header');
		element.className = 'header';
		element.innerHTML = `
			<div class='header__inner'>
				<div class='header__logo'> TODO 서비스</div>
				<div class='header__menu'>menu</div>
			</div>
		`;

		return element;
	}
}

export default Header;