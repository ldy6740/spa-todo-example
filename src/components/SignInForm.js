import '.SignInForm.css';

class SignInForm {
	constructor() {
		this.id = '';
		this.password = '';

		this.inputIdHandler = this.inputIdHandler.bind(this);
		this.inputPasswordHandler = this.inputPasswordHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	redner() {
		const element = document.createElement('div');
		element.className = 'sign-in-container';
		element.innerHTML = `
			<form class='sign-in-form'>
				<div class='sign-in-form__box'>
					<label class='sign-in-form__label' for='id'>id</label>
					<input id='id' class='sign-in-form__input sign-in-form__input--m' name='id' type='text' />
				</div>
				<div class='sign-in-form__box>
					<label class='sign-in-form__label' for='password'> password</label>
					<input id='password' class='sign-in-form__input sign-in-form__input--m' name='password' type='password' />
				</div>
				<button class='sign-in-form__submit-button' type='submit'>Sign in</button>
			</form>
			<div class='box__sign-up box__sign-up--mt>
				<a class='link__sign-up'>Create an account</a>
			</div>
		`
		element.addEventListener('input', this.inputIdHandler);
		element.addEventListener('input', this.inputPasswordHandler);
		element.addEventListener('submit', this.submitHandler);

		return element;
	}

	inputIdHandler(event) {
		if(
			!(
				event.target.matches('.sign-in-form__input') &&
				// NOTE 'target.getAttribute'데이터의 속성값을 가져 온다.
				event.target.getAttribute('name') === 'id'
			)
		) {
			return;
		}

		event.preventDefault();
		const idInput = event.target;
		this.id = idInput.value;
	}

	inputPasswordHandler(event) {
		if (
			!(
				event.target.matches('.sign-in-form__input') && 
				event.target.getAttribute('name') === 'password'
			)
		) {
			return;
		}
		event.preventDefault();
		const passwordInput = event.target;
		this.password = passwordInput.value;
	}

	async submitHandler(event) {
		if (!event.target.closest('.sign-in-form')) {
			return;
		}
		event.preventDefault();
		try {
			const body = {
				id: this.id,
				password: this.password,
			};

			const uri = '/api/auth/signin';
			const response = await fetch(uri, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const { message } = await response.json();
			if (!response.ok) {
				throw Error(message);
			}
			document.location.href = '/';
		} catch (err) {
			alert('id 또는 password가 일치하지 않습니다.');
		}
	}
}

export default SignInForm;