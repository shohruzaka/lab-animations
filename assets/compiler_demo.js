// assets/compiler_demo.js
const templates = {
    arithmetic: {
        code: 'x = 5 + 3;',
        tokens: ['x', '=', '5', '+', '3', ';'],
        ast: { type: 'Assignment', left: 'x', right: { type: 'BinaryExpression', operator: '+', left: '5', right: '3' } }
    },
    simple: {
        code: 'y = 10;',
        tokens: ['y', '=', '10', ';'],
        ast: { type: 'Assignment', left: 'y', right: '10' }
    },
    complex: {
        code: 'z = (1 + 2) * 3;',
        tokens: ['z', '=', '(', '1', '+', '2', ')', '*', '3', ';'],
        ast: { 
            type: 'Assignment', 
            left: 'z', 
            right: { 
                type: 'BinaryExpression', 
                operator: '*', 
                left: { type: 'BinaryExpression', operator: '+', left: '1', right: '2' }, 
                right: '3' 
            } 
        }
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
        const parserBox = document.getElementById('stage-parser');
        
        // Move tokens to Parser box
        tokenEls.forEach(el => moveElementTo(el, parserBox));
        
        setTimeout(() => {
            // Remove tokens
            tokenEls.forEach(el => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            });
            
            if (!tpl.ast) {
                const errEl = createAnimElement(tpl.error || 'Syntax Error', 'anim-token', parserBox);
                errEl.style.background = '#ef4444';
                errEl.style.color = 'white';
                moveElementTo(errEl, parserBox, 0, 0);
                return;
            }

            const astEls = [];
            
            function buildTree(node, x, y, stepX) {
                if (!node) return;
                
                let label = '';
                let children = [];
                
                if (node.type === 'Assignment') {
                    label = `Assign(${node.left})`;
                    children = [node.right];
                } else if (node.type === 'BinaryExpression') {
                    label = `Op(${node.operator})`;
                    children = [node.left, node.right];
                } else if (typeof node === 'string') {
                    label = `Val(${node})`;
                } else if (typeof node === 'number' || !node.type) {
                    label = `Val(${node})`;
                }

                const el = createAnimElement(label, 'anim-ast-node', parserBox);
                astEls.push(el);
                moveElementTo(el, parserBox, x, y);
                
                if (children.length === 1) {
                    setTimeout(() => buildTree(children[0], x, y + 50, stepX / 2), 300);
                } else if (children.length === 2) {
                    setTimeout(() => {
                        buildTree(children[0], x - stepX, y + 50, stepX / 2);
                        buildTree(children[1], x + stepX, y + 50, stepX / 2);
                    }, 300);
                }
            }

            buildTree(tpl.ast, 0, -50, 50);

            setTimeout(() => {
                if (typeof phase3Target === 'function') {
                    phase3Target(astEls, tpl, target);
                }
            }, 2000);
            
        }, 1200);
    };

    window.phase3Target = function(astEls, tpl, target) {
        const parserBox = document.getElementById('stage-parser');
        const targetBox = document.getElementById('stage-target');
        const outputBox = document.getElementById('stage-output');
        
        // Set target box text based on user selection
        targetBox.innerText = target === 'compiler' ? 'Compiler (0101)' : 'Interpreter (Eval)';
        
        // Move AST nodes to target box
        astEls.forEach(el => moveElementTo(el, targetBox));
        
        setTimeout(() => {
            // Remove AST nodes
            astEls.forEach(el => {
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 500);
            });
            
            if (target === 'compiler') {
                outputBox.innerText = 'File: app.exe';
                outputBox.style.background = '#059669'; // Green success
                outputBox.style.color = 'white';
                
                // Stream of binary tokens moving from Target to Output
                for(let i=0; i<15; i++) {
                    setTimeout(() => {
                        const bin = createAnimElement(Math.random()>0.5?'01':'10', 'anim-binary', targetBox);
                        moveElementTo(bin, outputBox, (i-7)*10, Math.random()*40-20);
                        // Fade out binary bits as they reach the output
                        setTimeout(() => {
                            bin.style.opacity = '0';
                            setTimeout(() => bin.remove(), 500);
                        }, 1000);
                    }, i*150);
                }
            } else {
                outputBox.innerText = 'Memory: x = 8';
                outputBox.style.background = '#7c3aed'; // Purple memory
                outputBox.style.color = 'white';
                
                // Single bytecode / result token moving
                const evalEl = createAnimElement('eval(5+3)', 'anim-token', targetBox);
                evalEl.style.background = '#7c3aed';
                evalEl.style.color = 'white';
                
                setTimeout(() => {
                    moveElementTo(evalEl, outputBox);
                    setTimeout(() => {
                        evalEl.style.opacity = '0';
                        setTimeout(() => evalEl.remove(), 500);
                    }, 1000);
                }, 500);
            }
        }, 1500);
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
