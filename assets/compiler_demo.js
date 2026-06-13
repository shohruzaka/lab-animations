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

let currentTemplate = null;

window.startPipeline = function(name) {
    currentTemplate = templates[name];
    if (!currentTemplate) return;

    // Reset styles
    document.querySelectorAll('.block').forEach(b => b.style.opacity = '0.5');
    
    // Animation sequence
    const sequence = ['sourceBlock', 'lexerBlock', 'parserBlock', 'interpreterBlock', 'compilerBlock'];
    sequence.forEach((id, i) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'scale(1.1)';
                setTimeout(() => el.style.transform = 'scale(1)', 200);
            }
        }, i * 500);
    });
};

window.showDetails = function(type) {
    if (!currentTemplate) {
        alert('Avval "Boshlash" tugmasini bosing!');
        return;
    }

    const modal = document.getElementById('detailsModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    modal.classList.remove('hidden');

    if (type === 'lexer') {
        title.innerText = 'Lexer Natijasi (Tokens)';
        body.innerText = JSON.stringify(currentTemplate.tokens, null, 2);
    } else if (type === 'parser') {
        title.innerText = 'Parser Natijasi (AST)';
        body.innerText = currentTemplate.ast 
            ? JSON.stringify(currentTemplate.ast, null, 2) 
            : currentTemplate.error;
    }
};

// Export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTemplate };
}
