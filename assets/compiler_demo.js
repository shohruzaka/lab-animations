// assets/compiler_demo.js
const templates = {
    arithmetic: {
        code: 'x = 5 + 3;',
        tokens: ['x', '=', '5', '+', '3', ';'],
        ast: { type: 'Assignment', left: 'x', right: { type: 'BinaryExpression', operator: '+', left: '5', right: '3' } }
    },
    error: {
        code: '5 = x;',
        tokens: ['5', '=', 'x', ';'],
        ast: null,
        error: 'SyntaxError: Invalid left-hand side in assignment'
    }
};

function getTemplate(name) {
    return templates[name];
}

// Export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTemplate };
}
