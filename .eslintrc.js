module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	rules: {
		'import/order': [
			'error',
			{
				'groups': ['builtin', 'external', 'internal'],
				'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
				'newlines-between': 'always',
				'pathGroups': [
					{
						'pattern': '@emotion/**',
						'group': 'external',
						'position': 'before'
					},
					{
						'pattern': '@mui/**',
						'group': 'external',
						'position': 'after'
					}
				],
				'pathGroupsExcludedImportTypes': ['builtin']
			}
		]
	}
};
