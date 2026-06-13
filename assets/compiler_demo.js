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

if (typeof window !== 'undefined') {
    // Replace old animation logic
    const animLayer = document.getElementById('animationLayer');

    function createAnimElement(text, className, startEl) {
        const el = document.createElement('div');
        el.className = className;
        el.innerText = text;
        
        const rect = startEl.getBoundingClientRect();
        const parentRect = document.getElementById('animationLayer').parentElement.getBoundingClientRect();
        
        // Set initial position center of startEl
        el.style.left = (rect.left - parentRect.left + rect.width/2 - 20) + 'px';
        el.style.top = (rect.top - parentRect.top + rect.height/2 - 10) + 'px';
        
        document.getElementById('animationLayer').appendChild(el);
        return el;
    }

    function moveElementTo(el, targetEl, offsetX = 0, offsetY = 0) {
        const rect = targetEl.getBoundingClientRect();
        const parentRect = document.getElementById('animationLayer').parentElement.getBoundingClientRect();
        el.style.left = (rect.left - parentRect.left + rect.width/2 + offsetX) + 'px';
        el.style.top = (rect.top - parentRect.top + rect.height/2 + offsetY) + 'px';
    }

    window.startPipeline = async function() {
        const animLayer = document.getElementById('animationLayer'); // Re-grab to be sure
        animLayer.innerHTML = ''; // Clear
        const tplName = document.getElementById('templateSelect').value;
        const target = document.getElementById('targetSelect').value;
        const tpl = templates[tplName];
        if (!tpl) return;

        const sourceBox = document.getElementById('stage-source');
        const lexerBox = document.getElementById('stage-lexer');
        
        // 1. Lexer: Source string explodes to tokens
        sourceBox.innerText = tpl.code;
        
        const tokenEls = [];
        for (let i = 0; i < tpl.tokens.length; i++) {
            const token = tpl.tokens[i];
            const el = createAnimElement(`[${token}]`, 'anim-token', sourceBox);
            tokenEls.push(el);
            
            // Wait a bit, then move to Lexer
            setTimeout(() => {
                moveElementTo(el, lexerBox, (i - tpl.tokens.length/2) * 30, (i%2==0?-20:20));
            }, 500 + i * 200);
        }

        // Call phase 2 after phase 1 finishes
        setTimeout(() => {
            if (typeof phase2Parser === 'function') {
                phase2Parser(tokenEls, tpl, target);
            }
        }, 1000 + tpl.tokens.length * 200);
    };

    window.showDetails = function(type) {
        const tplName = document.getElementById('templateSelect').value;
        const currentTemplate = templates[tplName];
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
}

// Export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTemplate };
}
