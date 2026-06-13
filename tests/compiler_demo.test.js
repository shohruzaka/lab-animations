// tests/compiler_demo.test.js
const assert = require('assert');
const { getTemplate } = require('../assets/compiler_demo.js');

try {
    const tpl = getTemplate('arithmetic');
    assert.strictEqual(tpl.code, 'x = 5 + 3;');
    assert.deepStrictEqual(tpl.tokens, ['x', '=', '5', '+', '3', ';']);
    console.log('PASS: getTemplate returns correct data');
} catch (e) {
    console.error('FAIL:', e.message);
    process.exit(1);
}
