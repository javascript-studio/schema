'use strict';

module.exports = {
  '*.js': 'eslint --fix',
  '*.{js,json,md,yml}': 'prettier --write'
};
