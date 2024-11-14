export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'only-ASCII': [2, 'always', /^[\x00-\x7F]*$/],
    },
    plugins: [
        {
            rules: {
                'only-ASCII': ({ raw }) => {
                    const isValid = /^[\x00-\x7F]*$/.test(raw);
                    return [
                        isValid,
                        'Commit message must be in ASCII characters.'
                    ];
                },
            },
        },
    ],
};