module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'no-chinese': [2, 'always', /^[\x00-\x7F]*$/],
    },
    plugins: [
      {
        rules: {
          'no-chinese': ({ raw }) => {
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