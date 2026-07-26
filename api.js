/**
 * YCYL MathCAPTCHA API
 * Hak Cipta (c) 2026 Jasonpw & YCYL STUDIO
 * 
 * Menggunakan ES6 Private Fields (#) agar state, jawaban, 
 * dan counter tidak bisa dimanipulasi melalui browser console.
 */

class MathCAPTCHA {
    // --- PRIVATE FIELDS (Tidak bisa diakses dari luar class) ---
    #settings;
    #container;
    #failCount = 0;
    #isVerified = false;
    #isBlocked = false;
    #currentLevel = 1;
    #currentReqCount = 4;
    #selected = new Set();
    #answerValues = [];
    #dom = {};
    #i18n;
    #t;
    #isDark = false;

    constructor(options) {
        // Default Settings
        this.#settings = Object.assign({
            containerId: null,
            mode: 'light', // 'light', 'dark', 'auto'
            level: 'random', // 1-7, 'random'
            language: 'auto-web', // 'id', 'en', 'auto-user', 'auto-web'
            maxAttempts: 5,
            onSuccess: (data) => console.log('Success:', data),
            onFail: (data) => console.warn('Failed attempt:', data),
            onBlocked: (data) => console.error('Blocked:', data)
        }, options);

        this.#container = document.getElementById(this.#settings.containerId);
        if (!this.#container) throw new Error(`[MathCAPTCHA] Container #${this.#settings.containerId} tidak ditemukan.`);

        // Dictionary Bahasa
        this.#i18n = {
            en: { robot: "I'm not a robot", priv: "Privacy", term: "Terms", inst: "Select {count} boxes that represent the values of the variables below:", maxSel: "Maximum {count} selections.", exactSel: "Please select exactly {count} boxes!", verAcc: "Access Verified", incorr: "Incorrect! Attempts left: {left}", blck: "You failed {max} times. Access blocked.", verFailed: "Verification Failed", verified: "Verified", verify: "Verify", failedTxt: "Failed:" },
            id: { robot: "Saya bukan robot", priv: "Privasi", term: "Ketentuan", inst: "Pilih {count} kotak yang merupakan nilai dari variabel di bawah ini:", maxSel: "Maksimal {count} pilihan.", exactSel: "Harap pilih tepat {count} kotak!", verAcc: "Akses Terverifikasi", incorr: "Salah! Sisa percobaan: {left}", blck: "Anda gagal {max} kali. Akses diblokir.", verFailed: "Verifikasi Gagal", verified: "Terverifikasi", verify: "Verifikasi", failedTxt: "Gagal:" }
        };

        this.#initLanguage();
        this.#initTheme();
        this.#renderWidget();
        this.#renderModal();
    }

    // --- PRIVATE METHODS ---

    #initLanguage() {
        let langCode = this.#settings.language;
        if (langCode === 'auto-web') {
            langCode = document.documentElement.lang.startsWith('id') ? 'id' : 'en';
        } else if (langCode === 'auto-user') {
            langCode = navigator.language.startsWith('id') ? 'id' : 'en';
        }
        this.#t = this.#i18n[langCode] || this.#i18n['en'];
    }

    #initTheme() {
        if (this.#settings.mode === 'dark' || (this.#settings.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.#isDark = true;
        }
    }

    #renderWidget() {
        const darkClass = this.#isDark ? 'dark' : '';
        this.#container.innerHTML = `
            <div class="${darkClass}">
                <div id="cw-main" class="bg-slate-50 dark:bg-slate-800 w-[300px] h-[74px] shadow-sm rounded border border-slate-300 dark:border-slate-600 flex items-center p-3 cursor-pointer select-none hover:shadow-md transition-shadow">
                    <div id="cw-check" class="rc-anchor-checkbox flex items-center justify-center shrink-0"></div>
                    <span id="cw-label" class="ml-3 font-medium text-slate-700 dark:text-slate-200 text-[14px]">${this.#t.robot}</span>
                    <div class="ml-auto flex flex-col items-center justify-center shrink-0 relative z-10">
                        <a href="https://github.com/JPROJECT-1/captcha-math" target="_blank" onclick="event.stopPropagation()" class="flex flex-col items-center justify-center hover:opacity-70 transition-opacity" title="GitHub">
                            <i class="fas fa-shield-halved text-[28px] text-blue-500 mb-0.5"></i>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-1 leading-none">MathCAPTCHA</span>
                        </a>
                        <span class="text-[8px] text-slate-400 mt-0.5">
                            <a href="https://jproject-1.github.io/captcha-math/privacy/" target="_blank" onclick="event.stopPropagation()" class="hover:underline hover:text-blue-500">${this.#t.priv}</a> - 
                            <a href="https://jproject-1.github.io/captcha-math/term/" target="_blank" onclick="event.stopPropagation()" class="hover:underline hover:text-blue-500">${this.#t.term}</a>
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        this.#container.querySelector('#cw-main').addEventListener('click', (e) => {
            if(e.target.tagName !== 'A') this.#openModal();
        });
    }

    #renderModal() {
        const darkClass = this.#isDark ? 'dark' : '';
        const modalHTML = `
            <div id="cm-overlay" class="${darkClass} fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
                <div id="cm-box" class="bg-white dark:bg-slate-800 w-full max-w-[400px] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden scale-95 transition-transform duration-300 relative">
                    <button id="cm-close" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 dark:text-slate-300 z-20 transition-colors">
                        <i class="fas fa-xmark"></i>
                    </button>
                    <div class="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center pr-12">
                        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                            <i class="fas fa-shield-halved"></i> MathCAPTCHA
                        </div>
                    </div>
                    <div class="bg-blue-600 text-white p-5 relative overflow-hidden">
                        <div class="text-sm text-blue-100 font-medium mb-3" id="cm-instruction"></div>
                        <div id="cm-eq-container" class="bg-blue-700/60 p-4 rounded-xl shadow-inner relative z-10 grid gap-y-4 gap-x-2 text-lg font-bold min-h-[90px]"></div>
                        <i class="fas fa-square-root-variable absolute -bottom-4 -right-2 text-8xl text-white opacity-10"></i>
                    </div>
                    <div id="cm-alert" class="hidden px-4 py-2 text-sm font-semibold text-center transition-all duration-300"></div>
                    <div class="p-4 bg-white dark:bg-slate-800">
                        <div id="cm-grid" class="grid grid-cols-3 gap-2 w-full"></div>
                    </div>
                    <div class="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-b-2xl">
                        <div class="flex gap-2 items-center">
                            <button id="cm-reload" class="w-10 h-10 rounded-full flex justify-center items-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors">
                                <i class="fas fa-rotate-right text-lg"></i>
                            </button>
                            <div class="text-xs font-semibold text-slate-400 ml-2">
                                ${this.#t.failedTxt} <span id="cm-fail-count" class="text-red-500 ml-1">0</span>/${this.#settings.maxAttempts}
                            </div>
                        </div>
                        <button id="cm-verify" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md shadow-blue-500/30 transition-transform active:scale-95 flex items-center gap-2">
                            ${this.#t.verify}
                        </button>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900 pb-3 text-center text-[10px] text-slate-400 font-medium tracking-wide border-t border-slate-100/50 dark:border-slate-800/50">
                        &copy; 2026 <a href="https://jasonpw.web.id/" target="_blank" class="hover:text-blue-500">Jasonpw</a> &bull; <a href="https://ycylstudio.web.id/" target="_blank" class="text-blue-500 hover:text-blue-400">YCYL STUDIO</a>
                    </div>
                </div>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHTML;
        document.body.appendChild(wrapper.firstElementChild);

        this.#dom = {
            overlay: document.getElementById('cm-overlay'),
            box: document.getElementById('cm-box'),
            closeBtn: document.getElementById('cm-close'),
            instruction: document.getElementById('cm-instruction'),
            eqContainer: document.getElementById('cm-eq-container'),
            alertBox: document.getElementById('cm-alert'),
            grid: document.getElementById('cm-grid'),
            reloadBtn: document.getElementById('cm-reload'),
            failCountEl: document.getElementById('cm-fail-count'),
            verifyBtn: document.getElementById('cm-verify'),
            widgetCheck: document.getElementById('cw-check'),
            widgetLabel: document.getElementById('cw-label'),
            widgetMain: document.getElementById('cw-main')
        };

        this.#dom.closeBtn.onclick = () => this.#triggerFail('closed_by_user');
        this.#dom.reloadBtn.onclick = () => this.#generateChallenge();
        this.#dom.verifyBtn.onclick = () => this.#verifyResponse();
    }

    #openModal() {
        if (this.#isVerified || this.#isBlocked) return;
        this.#dom.widgetCheck.innerHTML = '<i class="fas fa-spinner animate-spin-slow text-blue-500 text-xl"></i>';
        this.#dom.widgetCheck.style.borderColor = 'transparent';
        
        setTimeout(() => {
            this.#dom.overlay.classList.remove("opacity-0", "pointer-events-none");
            this.#dom.box.classList.remove("scale-95");
            this.#dom.box.classList.add("scale-100");
            this.#generateChallenge();
        }, 400);
    }

    #closeModal(status) {
        this.#dom.overlay.classList.add("opacity-0", "pointer-events-none");
        this.#dom.box.classList.remove("scale-100");
        this.#dom.box.classList.add("scale-95");

        if (status === 'success') {
            this.#isVerified = true;
            this.#dom.widgetCheck.style.borderColor = 'transparent';
            this.#dom.widgetCheck.innerHTML = '<i class="fas fa-check text-[#0f9d58] text-[26px]"></i>';
            this.#dom.widgetLabel.textContent = this.#t.verified;
            this.#dom.widgetMain.classList.remove("cursor-pointer", "hover:shadow-md");
        } else if (status === 'blocked' || status === 'failed') {
            this.#isBlocked = true;
            this.#dom.widgetCheck.style.borderColor = '#ef4444';
            this.#dom.widgetCheck.innerHTML = '<i class="fas fa-xmark text-red-500 text-xl"></i>';
            this.#dom.widgetLabel.textContent = this.#t.verFailed;
            this.#dom.widgetLabel.classList.add("text-red-600");
            this.#dom.widgetMain.classList.remove("cursor-pointer", "hover:shadow-md");
        }
    }

    #getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    #shuffle(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    #getEquation(level, varName) {
        let eq = ''; let V = 0;
        if (level === 1) {
            const ops = ['+', '-', '*', '/']; const op = ops[this.#getRandomInt(0, 3)];
            if (op === '+') { V = this.#getRandomInt(2, 30); let a = this.#getRandomInt(1, V - 1); eq = `${a} + ${V - a} = ${varName}`; } 
            else if (op === '-') { V = this.#getRandomInt(1, 30); let a = this.#getRandomInt(1, 20); eq = `${V + a} - ${a} = ${varName}`; } 
            else if (op === '*') { let a = this.#getRandomInt(2, 9); let b = this.#getRandomInt(2, 9); V = a * b; eq = `${a} \\times ${b} = ${varName}`; } 
            else { V = this.#getRandomInt(2, 12); let b = this.#getRandomInt(2, 9); eq = `${V * b} \\div ${b} = ${varName}`; }
        } else if (level === 2) {
            const type = this.#getRandomInt(1, 2);
            if (type === 1) { V = this.#getRandomInt(2, 10); eq = `\\sqrt{${V * V}} = ${varName}`; } 
            else { let base = this.#getRandomInt(2, 5); let pow = this.#getRandomInt(2, 3); V = Math.pow(base, pow); eq = `${base}^${pow} = ${varName}`; }
        } else if (level === 3) {
            const type = this.#getRandomInt(1, 2);
            if (type === 1) { V = this.#getRandomInt(2, 15); let a = this.#getRandomInt(2, 5); let b = this.#getRandomInt(1, 10); eq = `${a}${varName} - ${b} = ${a * V - b}`; } 
            else { V = this.#getRandomInt(2, 8); let r2 = this.#getRandomInt(1, 5); if (V === r2) V++; let sum = V + r2; let prod = V * r2; eq = `${varName}^2 - ${sum}${varName} + ${prod} = 0 \\; (${varName} > ${Math.min(V, r2)})`; }
        } else if (level === 4) {
            const type = this.#getRandomInt(1, 3);
            if (type === 1) { V = this.#getRandomInt(2, 20); eq = `${V * 2} \\sin(30^\\circ) = ${varName}`; } 
            else if (type === 2) { V = this.#getRandomInt(2, 20); eq = `${V * 2} \\cos(60^\\circ) = ${varName}`; } 
            else { V = this.#getRandomInt(2, 30); eq = `${V} \\tan(45^\\circ) = ${varName}`; }
        } else if (level === 5) {
            const type = this.#getRandomInt(1, 2);
            if (type === 1) { const combs = [{n:4, r:2, a:6}, {n:5, r:2, a:10}, {n:6, r:2, a:15}]; let c = combs[this.#getRandomInt(0, combs.length - 1)]; V = c.a; eq = `C(${c.n}, ${c.r}) = ${varName}`; } 
            else { V = this.#getRandomInt(2, 20); eq = `${V * 2} \\times P(\\text{Heads}) = ${varName}`; }
        } else if (level === 6) {
            let x1 = this.#getRandomInt(1, 4), y1 = this.#getRandomInt(1, 4), x2 = this.#getRandomInt(1, 4), y2 = this.#getRandomInt(1, 4); V = (x1 * x2) + (y1 * y2); eq = `[${x1}, ${y1}] \\cdot [${x2}, ${y2}] = ${varName}`;
        } else {
            const type = this.#getRandomInt(1, 2);
            if (type === 1) { let a = this.#getRandomInt(1, 5); let b = this.#getRandomInt(1, 10); V = (2 * a) + b; eq = `\\frac{d}{dx}(${a}x^2 + ${b}x) \\big|_{x=1} = ${varName}`; } 
            else { let a = this.#getRandomInt(1, 10); V = 2 * a; eq = `\\int_0^2 ${a}x \\, dx = ${varName}`; }
        }
        return { equationLatex: eq, answer: V };
    }

    #generateChallenge() {
        this.#dom.grid.innerHTML = "";
        this.#dom.eqContainer.innerHTML = "";
        this.#selected.clear();
        this.#dom.alertBox.classList.add("hidden");
        this.#dom.box.classList.remove("animate-shake");
        this.#dom.verifyBtn.innerHTML = this.#t.verify;
        this.#dom.grid.style.pointerEvents = "auto";
        this.#dom.failCountEl.textContent = this.#failCount;

        this.#currentReqCount = Math.random() > 0.5 ? 3 : 4;
        this.#dom.instruction.innerHTML = this.#t.inst.replace('{count}', `<b class="text-white bg-blue-800 px-1.5 py-0.5 rounded">${this.#currentReqCount}</b>`);
        
        this.#currentLevel = this.#settings.level === 'random' ? this.#getRandomInt(1, 7) : parseInt(this.#settings.level);
        const variables = this.#currentReqCount === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
        this.#answerValues = [];
        
        variables.forEach((v, index) => {
            let prob;
            do { prob = this.#getEquation(this.#currentLevel, v); } while (this.#answerValues.includes(prob.answer)); 
            this.#answerValues.push(prob.answer);
            
            let eqDiv = document.createElement("div");
            eqDiv.className = (this.#currentReqCount === 3 && index === 2) ? "flex justify-center items-center col-span-2" : "flex justify-center items-center";
            this.#dom.eqContainer.appendChild(eqDiv);
            katex.render(prob.equationLatex, eqDiv, { throwOnError: false, displayMode: false });
        });

        this.#dom.eqContainer.className = `bg-blue-700/60 p-4 rounded-xl shadow-inner relative z-10 grid gap-y-4 gap-x-2 text-lg font-bold min-h-[90px] ${this.#currentReqCount === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2'}`;

        let gridItems = [...this.#answerValues];
        while (gridItems.length < 9) {
            let fakeAnswer = this.#getRandomInt(1, 60); 
            if (!gridItems.includes(fakeAnswer)) gridItems.push(fakeAnswer);
        }
        gridItems = this.#shuffle(gridItems); 

        gridItems.forEach((numberValue) => {
            const cell = document.createElement("div");
            cell.className = "h-20 bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700 cursor-pointer transition-all duration-200 relative select-none hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-transparent overflow-hidden shadow-sm";
            const spanText = document.createElement("span"); spanText.textContent = numberValue;
            const checkIcon = document.createElement("div");
            checkIcon.className = "checkmark absolute top-1 right-1 w-6 h-6 bg-blue-600 rounded-full items-center justify-center text-white text-xs shadow-sm";
            checkIcon.innerHTML = '<i class="fas fa-check"></i>';
            cell.appendChild(spanText); cell.appendChild(checkIcon);
            cell.onclick = () => this.#toggleCell(cell, numberValue);
            this.#dom.grid.appendChild(cell);
        });
    }

    #toggleCell(cell, numberValue) {
        if (this.#selected.has(numberValue)) {
            this.#selected.delete(numberValue);
            cell.classList.remove("tile-selected");
        } else {
            if (this.#selected.size >= this.#currentReqCount) {
                this.#showAlert(this.#t.maxSel.replace('{count}', this.#currentReqCount), "error");
                return;
            }
            this.#selected.add(numberValue);
            cell.classList.add("tile-selected");
        }
        this.#dom.alertBox.classList.add("hidden");
    }

    #triggerFail(reason) {
        this.#failCount++;
        this.#dom.failCountEl.textContent = this.#failCount;
        
        // Membekukan Object Output agar tidak diubah-ubah setelah dikeluarkan
        const outputJSON = Object.freeze({
            status: "failed",
            reason: reason,
            attemptsUsed: this.#failCount,
            maxAttempts: this.#settings.maxAttempts,
            levelPlayed: this.#currentLevel,
            timestamp: new Date().toISOString()
        });

        if (this.#failCount >= this.#settings.maxAttempts) {
            this.#showAlert(this.#t.blck.replace('{max}', this.#settings.maxAttempts), "error");
            this.#shakeBox();
            this.#dom.grid.style.pointerEvents = "none";
            this.#dom.verifyBtn.disabled = true;
            setTimeout(() => this.#closeModal('blocked'), 1200);
            
            this.#settings.onBlocked(Object.freeze({ ...outputJSON, status: "blocked" }));
        } else {
            this.#showAlert(this.#t.incorr.replace('{left}', this.#settings.maxAttempts - this.#failCount), "error");
            this.#shakeBox();
            if(reason !== 'closed_by_user') setTimeout(() => this.#generateChallenge(), 1500);
            else this.#closeModal('failed');
            
            this.#settings.onFail(outputJSON);
        }
    }

    #verifyResponse() {
        if (this.#selected.size !== this.#currentReqCount) {
            this.#showAlert(this.#t.exactSel.replace('{count}', this.#currentReqCount), "error");
            this.#shakeBox();
            return;
        }

        let isCorrect = true;
        this.#answerValues.forEach(ans => { if (!this.#selected.has(ans)) isCorrect = false; });
        
        if (isCorrect) {
            this.#showAlert(`<i class="fas fa-shield-check text-lg mr-2"></i> ${this.#t.verAcc}`, "success");
            this.#dom.grid.style.pointerEvents = "none";
            setTimeout(() => this.#closeModal('success'), 800);
            
            // Generate Simulated Secure Token (Kombinasikan dengan validasi Backend untuk keamanan nyata)
            const simulatedToken = btoa(JSON.stringify({
                valid: true, 
                timestamp: Date.now(), 
                level: this.#currentLevel
            }));

            this.#settings.onSuccess(Object.freeze({
                status: "success",
                data: {
                    levelPlayed: this.#currentLevel,
                    attemptsUsed: this.#failCount + 1,
                    timestamp: new Date().toISOString(),
                    token: simulatedToken
                }
            }));
        } else {
            this.#triggerFail('wrong_answer');
        }
    }

    #shakeBox() {
        this.#dom.box.classList.remove("animate-shake");
        void this.#dom.box.offsetWidth; 
        this.#dom.box.classList.add("animate-shake");
    }

    #showAlert(msg, type) {
        this.#dom.alertBox.innerHTML = msg;
        this.#dom.alertBox.className = "px-4 py-2 text-sm font-semibold text-center transition-all duration-300 rounded mx-4 mb-2";
        if (type === "error") this.#dom.alertBox.classList.add("bg-red-100", "text-red-700", "dark:bg-red-900", "dark:text-red-100");
        else this.#dom.alertBox.classList.add("bg-green-100", "text-green-700", "dark:bg-green-900", "dark:text-green-100");
    }
}
