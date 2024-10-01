import userStore from './store/userStore';

import MainPage from './pages/MainPage';
import SignInPage from './pages/SignInPage';

class App {
	render() {
		// NOTE userStore에 저장된 user 정보를 가져온다. 
		const { user } = userStore.getState();
		// NOTE user가 있으면 main page 를 화면에 뿌려준다.
		if (user) {
			const mainPage = new MainPage();
			return mainPage.render();
		}

		// NOTE user정보가 없으면 로그인 페이지를 화면에 뿌려준다.
		const signInPage = new SignInPage();
		return signInPage.render();
	}
}

export default App;