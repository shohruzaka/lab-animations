// tests/compiler_demo.test.js
const assert = require('assert');
const { getTemplate } = require('../assets/compiler_demo.js');

try {
    const tpl = getTemplate('arithmetic');
    assert.strictEqual(tpl.code, 'x = 5 + 3;');
    assert.deepStrictEqual(tpl.tokens, ['x', '=', '5', '+', '3', ';']);
    
    const simple = getTemplate('simple');
    assert.strictEqual(simple.code, 'y = 10;');
    assert.deepStrictEqual(simple.tokens, ['y', '=', '10', ';']);
    assert.strictEqual(simple.ast.type, 'Assignment');

    const complex = getTemplate('complex');
    assert.strictEqual(complex.code, 'z = (1 + 2) * 3;');
    assert.strictEqual(complex.ast.right.operator, '*');

    console.log('PASS: getTemplate returns correct data for all templates');
} catch (e) {
    console.error('FAIL:', e.message);
    process.exit(1);
}
