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

    window.phase2Parser = function(tokenEls, tpl, target) {
        const lexerBox = document.getElementById('stage-lexer');
        const parserBox = document.getElementById('stage-parser');
        
        // Move tokens to Parser box
        tokenEls.forEach(el => moveElementTo(el, parserBox));
        
        setTimeout(() => {
            // Remove tokens, create AST node representations
            tokenEls.forEach(el => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            });
            
            const rootEl = createAnimElement('Assign(x)', 'anim-ast-node', parserBox);
            const opEl = createAnimElement('Add(+)', 'anim-ast-node', parserBox);
            const lEl = createAnimElement('Num(5)', 'anim-ast-node', parserBox);
            const rEl = createAnimElement('Num(3)', 'anim-ast-node', parserBox);
            
            // Form tree visually in Parser
            // Center-top
            moveElementTo(rootEl, parserBox, 0, -40);
            // Below root
            setTimeout(() => moveElementTo(opEl, parserBox, 0, 0), 300);
            // Bottom branches
            setTimeout(() => {
                moveElementTo(lEl, parserBox, -40, 40);
                moveElementTo(rEl, parserBox, 40, 40);
            }, 600);
            
            const astEls = [rootEl, opEl, lEl, rEl];
            
            setTimeout(() => {
                if (typeof phase3Target === 'function') {
                    phase3Target(astEls, tpl, target);
                }
            }, 2000);
            
        }, 1200);
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
