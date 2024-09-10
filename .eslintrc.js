module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	plugin: ['prettier'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/revommend'
	],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {},
};