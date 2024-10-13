import SignInForm from '../components/SignInForm';

class SignInPage {
	render() {
		const signInForm = new SignInForm();
		return signInForm.render();
	}
}

export default SignInPage;