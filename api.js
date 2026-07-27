/**
 * YCYL MathCAPTCHA API v1.0.0
 * Hak Cipta (c) 2026 Jasonpw & YCYL STUDIO
 */

class MathCAPTCHA {
    #settings; #container; #failCount = 0; #isVerified = false; #isBlocked = false;
    #currentLevel = 1; #currentReqCount = 4; #selected = new Set(); #answerValues = [];
    #dom = {}; #i18n; #t; #isDark = false; #uid;

    constructor(options) {
        this.#uid = 'mc_' + Math.random().toString(36).substr(2, 9);

        this.#settings = Object.assign({
            containerId: null, mode: 'light', level: 'random', language: 'auto-web', maxAttempts: 5,
            onSuccess: () => {}, onFail: () => {}, onBlocked: () => {}
        }, options);

        this.#container = document.getElementById(this.#settings.containerId);
        if (!this.#container) throw new Error(`[MathCAPTCHA] Container #${this.#settings.containerId} tidak ditemukan.`);

        this.#i18n = {
            en: { robot: "I'm not a robot", priv: "Privacy", term: "Terms", inst: "Select {count} boxes that represent the values of the variables below:", maxSel: "Maximum {count} selections.", exactSel: "Please select exactly {count} boxes!", verAcc: "Access Verified", incorr: "Incorrect! Attempts left: {left}", blck: "You failed {max} times. Access blocked.", verFailed: "Verification Failed", verified: "Verified", verify: "Verify", failedTxt: "Failed:" },
            id: { robot: "Saya bukan robot", priv: "Privasi", term: "Ketentuan", inst: "Pilih {count} kotak yang merupakan nilai dari variabel di bawah ini:", maxSel: "Maksimal {count} pilihan.", exactSel: "Harap pilih tepat {count} kotak!", verAcc: "Akses Terverifikasi", incorr: "Salah! Sisa percobaan: {left}", blck: "Anda gagal {max} kali. Akses diblokir.", verFailed: "Verifikasi Gagal", verified: "Terverifikasi", verify: "Verifikasi", failedTxt: "Gagal:" },
            es: { robot: "No soy un robot", priv: "Privacidad", term: "Términos", inst: "Selecciona {count} casillas que representen los valores de las variables siguientes:", maxSel: "Máximo {count} selecciones.", exactSel: "¡Por favor, selecciona exactamente {count} casillas!", verAcc: "Acceso Verificado", incorr: "¡Incorrecto! Intentos restantes: {left}", blck: "Has fallado {max} veces. Acceso bloqueado.", verFailed: "Verificación Fallida", verified: "Verificado", verify: "Verificar", failedTxt: "Fallido:" },
            zh: { robot: "我不是机器人", priv: "隐私", term: "条款", inst: "请选择 {count} 个代表以下变量值的框：", maxSel: "最多选择 {count} 个。", exactSel: "请准确选择 {count} 个框！", verAcc: "访问已验证", incorr: "错误！剩余尝试次数：{left}", blck: "您已失败 {max} 次。访问被拒绝。", verFailed: "验证失败", verified: "已验证", verify: "验证", failedTxt: "失败：" },
            ar: { robot: "أنا لست برنامج روبوت", priv: "الخصوصية", term: "البنود", inst: "حدد {count} مربعات تمثل قيم المتغيرات أدناه:", maxSel: "الحد الأقصى {count} اختيارات.", exactSel: "الرجاء تحديد {count} مربعات بالضبط!", verAcc: "تم التحقق من الوصول", incorr: "غير صحيح! المحاولات المتبقية: {left}", blck: "لقد فشلت {max} مرات. تم حظر الوصول.", verFailed: "فشل التحقق", verified: "تم التحقق", verify: "تحقق", failedTxt: "فشل:" },
            fr: { robot: "Je ne suis pas un robot", priv: "Confidentialité", term: "Conditions", inst: "Sélectionnez {count} cases qui représentent les valeurs des variables ci-dessous :", maxSel: "Maximum {count} sélections.", exactSel: "Veuillez sélectionner exactement {count} cases !", verAcc: "Accès Vérifié", incorr: "Incorrect ! Tentatives restantes : {left}", blck: "Vous avez échoué {max} fois. Accès bloqué.", verFailed: "Échec de la vérification", verified: "Vérifié", verify: "Vérifier", failedTxt: "Échoué :" },
            de: { robot: "Ich bin kein Roboter", priv: "Datenschutz", term: "Nutzungsbedingungen", inst: "Wählen Sie {count} Felder aus, die die Werte der folgenden Variablen darstellen:", maxSel: "Maximal {count} Auswahlen.", exactSel: "Bitte wählen Sie genau {count} Felder aus!", verAcc: "Zugriff Verifiziert", incorr: "Falsch! Verbleibende Versuche: {left}", blck: "Sie haben {max} Mal versagt. Zugriff blockiert.", verFailed: "Überprüfung fehlgeschlagen", verified: "Verifiziert", verify: "Überprüfen", failedTxt: "Fehlgeschlagen:" },
            ja: { robot: "私はロボットではありません", priv: "プライバシー", term: "利用規約", inst: "以下の変数の値を表すボックスを {count} 個選択してください：", maxSel: "最大 {count} 個まで選択可能です。", exactSel: "ちょうど {count} 個のボックスを選択してください！", verAcc: "アクセスが確認されました", incorr: "不正解です！残りの試行回数：{left}", blck: "{max} 回失敗しました。アクセスがブロックされました。", verFailed: "確認に失敗しました", verified: "確認済み", verify: "確認", failedTxt: "失敗：" },
            ru: { robot: "Я не робот", priv: "Конфиденциальность", term: "Условия", inst: "Выберите {count} поля, которые представляют значения следующих переменных:", maxSel: "Максимум {count} выбора.", exactSel: "Пожалуйста, выберите ровно {count} поля!", verAcc: "Доступ подтвержден", incorr: "Неверно! Осталось попыток: {left}", blck: "Вы ошиблись {max} раз. Доступ заблокирован.", verFailed: "Проверка не пройдена", verified: "Подтверждено", verify: "Подтвердить", failedTxt: "Неудачно:" },
            hi: { robot: "मैं रोबोट नहीं हूँ", priv: "गोपनीयता", term: "शर्तें", inst: "नीचे दिए गए चरों के मानों को दर्शाने वाले {count} बॉक्स चुनें:", maxSel: "अधिकतम {count} चयन।", exactSel: "कृपया ठीक {count} बॉक्स चुनें!", verAcc: "एक्सेस सत्यापित", incorr: "गलत! शेष प्रयास: {left}", blck: "आप {max} बार विफल रहे। एक्सेस ब्लॉक कर दिया गया है।", verFailed: "सत्यापन विफल", verified: "सत्यापित", verify: "सत्यापित करें", failedTxt: "विफल:" }
        };

        this.#injectDependencies().then(() => {
            this.#initLanguage(); 
            this.#initTheme(); 
            this.#renderWidget(); 
            this.#renderModal();
        });
    }

    #injectDependencies() {
        return new Promise((resolve) => {
            let loaded = 0; const required = 3;
            const checkDone = () => { loaded++; if (loaded === required) resolve(); };

            if (!document.querySelector('script[src*="tailwindcss"]')) {
                const tw = document.createElement('script'); tw.src = "https://cdn.tailwindcss.com";
                tw.onload = () => {
                    tailwind.config = { darkMode: 'class', theme: { extend: { animation: { 'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both', 'spin-slow': 'spin 1.5s linear infinite' }, keyframes: { shake: { '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' }, '20%, 80%': { transform: 'translate3d(2px, 0, 0)' }, '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' }, '40%, 60%': { transform: 'translate3d(4px, 0, 0)' } } } } } };
                    checkDone();
                };
                document.head.appendChild(tw);
            } else checkDone();

            if (!document.querySelector('link[href*="katex.min.css"]')) {
                const ktCss = document.createElement('link'); ktCss.rel = "stylesheet"; ktCss.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
                ktCss.onload = checkDone; document.head.appendChild(ktCss);
            } else checkDone();

            if (typeof katex === 'undefined') {
                const ktJs = document.createElement('script'); ktJs.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
                ktJs.onload = checkDone; document.head.appendChild(ktJs);
            } else checkDone();

            if (!document.getElementById('mathcaptcha-core-style')) {
                const style = document.createElement('style'); style.id = 'mathcaptcha-core-style';
                style.innerHTML = `
                    .mc-tile-selected { transform: scale(0.92); box-shadow: 0 0 0 4px #3b82f6; background-color: #eff6ff !important; color: #1d4ed8 !important; }
                    .dark .mc-tile-selected { background-color: #1e3a8a !important; color: #bfdbfe !important; box-shadow: 0 0 0 4px #60a5fa; }
                    .mc-checkmark { display: none; } .mc-tile-selected .mc-checkmark { display: flex; }
                    .mc-checkbox { width: 28px; height: 28px; background: #fff; border: 2px solid #c1c1c1; border-radius: 2px; transition: all 0.2s ease; }
                    .mc-checkbox:hover { border-color: #b2b2b2; } .dark .mc-checkbox { background: #0f172a; border-color: #334155; }
                    .katex { font-size: 1.15em !important; }
                `;
                document.head.appendChild(style);
            }
        });
    }

    #getShieldSVG(className) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="${className}"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 00-7.877 3.08.75.75 0 00-.222.58A12.97 12.97 0 005.88 17.5a11.2 11.2 0 006.12 4.41c.18.06.38.06.56 0 2.45-.81 4.6-2.3 6.12-4.41a12.97 12.97 0 002.495-11.668.75.75 0 00-.222-.58 11.209 11.209 0 00-7.877-3.08zM12 4.3v16.14c-2-.66-3.8-1.92-5.12-3.66A11.47 11.47 0 014.88 6.55 9.71 9.71 0 0112 4.3z" clip-rule="evenodd" /></svg>`;
    }

    #initLanguage() {
        let langCode = this.#settings.language;
        if (langCode === 'auto-web') {
            const htmlLang = document.documentElement.lang ? document.documentElement.lang.split('-')[0].toLowerCase() : 'en';
            langCode = this.#i18n[htmlLang] ? htmlLang : 'en';
        } else if (langCode === 'auto-user') {
            const userLang = navigator.language.split('-')[0].toLowerCase();
            langCode = this.#i18n[userLang] ? userLang : 'en';
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
            <div class="${darkClass} max-w-full">
                <div id="cw-main-${this.#uid}" class="bg-slate-50 dark:bg-slate-800 w-[300px] max-w-full h-[74px] shadow-sm rounded border border-slate-300 dark:border-slate-600 flex items-center p-3 cursor-pointer select-none hover:shadow-md transition-shadow box-border">
                    <div id="cw-check-${this.#uid}" class="mc-checkbox flex items-center justify-center shrink-0"></div>
                    <span id="cw-label-${this.#uid}" class="ml-3 font-medium text-slate-700 dark:text-slate-200 text-[14px] truncate">${this.#t.robot}</span>
                    <div class="ml-auto flex flex-col items-center justify-center shrink-0 relative z-10 pl-2">
                        <a href="https://github.com/JPROJECT-1/captcha-math" target="_blank" onclick="event.stopPropagation()" class="flex flex-col items-center justify-center hover:opacity-70 transition-opacity" title="GitHub">
                            ${this.#getShieldSVG('w-7 h-7 text-blue-500 mb-0.5')}
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-1 leading-none">MathCAPTCHA</span>
                        </a>
                        <span class="text-[8px] text-slate-400 mt-0.5 flex gap-1">
                            <a href="https://jproject-1.github.io/captcha-math/privacy/" target="_blank" onclick="event.stopPropagation()" class="hover:underline hover:text-blue-500">${this.#t.priv}</a> - 
                            <a href="https://jproject-1.github.io/captcha-math/term/" target="_blank" onclick="event.stopPropagation()" class="hover:underline hover:text-blue-500">${this.#t.term}</a>
                        </span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById(`cw-main-${this.#uid}`).addEventListener('click', (e) => {
            if(e.target.tagName !== 'A' && !e.target.closest('a')) this.#openModal();
        });
    }

    #renderModal() {
        const darkClass = this.#isDark ? 'dark' : '';
        const modalHTML = `
            <div id="cm-overlay-${this.#uid}" class="${darkClass} fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 p-4" dir="${['ar'].includes(this.#settings.language) ? 'rtl' : 'ltr'}">
                <div id="cm-box-${this.#uid}" class="bg-white dark:bg-slate-800 w-full max-w-[400px] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden scale-95 transition-transform duration-300 relative flex flex-col max-h-full">
                    <button id="cm-close-${this.#uid}" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 dark:text-slate-300 z-20 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    <div class="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center pr-12 shrink-0">
                        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">${this.#getShieldSVG('w-5 h-5')} MathCAPTCHA</div>
                    </div>
                    <div class="bg-blue-600 text-white p-5 relative overflow-hidden shrink-0">
                        <div class="text-[13px] text-blue-100 font-medium mb-3 leading-tight" id="cm-instruction-${this.#uid}"></div>
                        <div id="cm-eq-container-${this.#uid}" class="bg-blue-700/60 p-4 rounded-xl shadow-inner relative z-10 grid gap-y-4 gap-x-2 text-lg font-bold min-h-[90px] grid-cols-2" dir="ltr"></div>
                        ${this.#getShieldSVG('absolute -bottom-10 -right-6 w-40 h-40 text-white opacity-10')}
                    </div>
                    <div id="cm-alert-${this.#uid}" class="hidden px-4 py-2 text-sm font-semibold text-center transition-all duration-300 shrink-0"></div>
                    <div class="p-4 bg-white dark:bg-slate-800 overflow-y-auto"><div id="cm-grid-${this.#uid}" class="grid grid-cols-3 gap-2 w-full" dir="ltr"></div></div>
                    <div class="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-b-2xl shrink-0">
                        <div class="flex gap-2 items-center">
                            <button id="cm-reload-${this.#uid}" class="w-10 h-10 rounded-full flex justify-center items-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></button>
                            <div class="text-[11px] sm:text-xs font-semibold text-slate-400 ml-1">${this.#t.failedTxt} <span id="cm-fail-count-${this.#uid}" class="text-red-500 mx-1">0</span>/${this.#settings.maxAttempts}</div>
                        </div>
                        <button id="cm-verify-${this.#uid}" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-blue-500/30 transition-transform active:scale-95 flex items-center gap-2 text-sm">${this.#t.verify}</button>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900 pb-3 text-center text-[10px] text-slate-400 font-medium tracking-wide border-t border-slate-100/50 dark:border-slate-800/50 shrink-0" dir="ltr">
                        &copy; 2026 <a href="https://jasonpw.web.id/" target="_blank" class="hover:text-blue-500">Jasonpw</a> &bull; <a href="https://ycylstudio.web.id/" target="_blank" class="text-blue-500 hover:text-blue-400">YCYL STUDIO</a>
                    </div>
                </div>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHTML;
        document.body.appendChild(wrapper.firstElementChild);

        this.#dom = {
            overlay: document.getElementById(`cm-overlay-${this.#uid}`),
            box: document.getElementById(`cm-box-${this.#uid}`),
            closeBtn: document.getElementById(`cm-close-${this.#uid}`),
            instruction: document.getElementById(`cm-instruction-${this.#uid}`),
            eqContainer: document.getElementById(`cm-eq-container-${this.#uid}`),
            alertBox: document.getElementById(`cm-alert-${this.#uid}`),
            grid: document.getElementById(`cm-grid-${this.#uid}`),
            reloadBtn: document.getElementById(`cm-reload-${this.#uid}`),
            failCountEl: document.getElementById(`cm-fail-count-${this.#uid}`),
            verifyBtn: document.getElementById(`cm-verify-${this.#uid}`),
            widgetCheck: document.getElementById(`cw-check-${this.#uid}`),
            widgetLabel: document.getElementById(`cw-label-${this.#uid}`),
            widgetMain: document.getElementById(`cw-main-${this.#uid}`)
        };

        this.#dom.closeBtn.onclick = () => this.#triggerFail('closed_by_user');
        this.#dom.reloadBtn.onclick = () => this.#generateChallenge();
        this.#dom.verifyBtn.onclick = () => this.#verifyResponse();
    }

    #openModal() {
        if (this.#isVerified || this.#isBlocked) return;
        this.#dom.widgetCheck.innerHTML = `<svg class="animate-spin-slow w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
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
            this.#dom.widgetCheck.innerHTML = `<svg class="w-7 h-7 text-[#0f9d58]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
            this.#dom.widgetLabel.textContent = this.#t.verified;
            this.#dom.widgetMain.classList.remove("cursor-pointer", "hover:shadow-md");
        } else if (status === 'blocked' || status === 'failed') {
            this.#isBlocked = true;
            this.#dom.widgetCheck.style.borderColor = '#ef4444';
            this.#dom.widgetCheck.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            this.#dom.widgetLabel.textContent = this.#t.verFailed;
            this.#dom.widgetLabel.classList.add("text-red-600");
            this.#dom.widgetMain.classList.remove("cursor-pointer", "hover:shadow-md");
        } else {
            this.#dom.widgetCheck.style.borderColor = '#c1c1c1';
            this.#dom.widgetCheck.innerHTML = '';
        }
    }

    #getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    #shuffle(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
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
        this.#dom.grid.innerHTML = ""; this.#dom.eqContainer.innerHTML = ""; this.#selected.clear();
        this.#dom.alertBox.classList.add("hidden"); this.#dom.box.classList.remove("animate-shake");
        this.#dom.verifyBtn.innerHTML = this.#t.verify; this.#dom.grid.style.pointerEvents = "auto";
        this.#dom.failCountEl.textContent = this.#failCount;

        this.#currentReqCount = Math.random() > 0.5 ? 3 : 4;
        this.#dom.instruction.innerHTML = this.#t.inst.replace('{count}', `<b class="text-white bg-blue-800 px-2 py-0.5 rounded mx-1">${this.#currentReqCount}</b>`);
        
        this.#currentLevel = this.#settings.level === 'random' ? this.#getRandomInt(1, 7) : parseInt(this.#settings.level);
        const variables = this.#currentReqCount === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
        this.#answerValues = [];
        
        variables.forEach((v, index) => {
            let prob; do { prob = this.#getEquation(this.#currentLevel, v); } while (this.#answerValues.includes(prob.answer)); 
            this.#answerValues.push(prob.answer);
            
            let wrapperDiv = document.createElement("div");
            wrapperDiv.className = "flex justify-center items-center w-full overflow-hidden min-w-0";
            if (this.#currentReqCount === 3 && index === 2) wrapperDiv.classList.add("col-span-2");
            
            let eqDiv = document.createElement("div");
            eqDiv.style.whiteSpace = "nowrap"; eqDiv.style.transition = "transform 0.15s ease-out"; eqDiv.style.transformOrigin = "center"; 
            wrapperDiv.appendChild(eqDiv); this.#dom.eqContainer.appendChild(wrapperDiv);
            
            // PENGAMANAN KATEX Quirks Mode
            try {
                katex.render(prob.equationLatex, eqDiv, { throwOnError: false, displayMode: false });
            } catch (err) {
                // Fallback rendering aman tanpa merusak tampilan
                const fallbackMath = prob.equationLatex.replace(/\\/g, '').replace(/frac{([^}]+)}{([^}]+)}/g, '$1/$2');
                eqDiv.innerHTML = `<span style="font-size:1.1rem; font-family:monospace; font-weight:bold;">${fallbackMath}</span>`;
            }

            const fitEquation = () => {
                if(wrapperDiv.clientWidth === 0) return;
                const availWidth = wrapperDiv.clientWidth;
                const eqWidth = eqDiv.scrollWidth;
                if (eqWidth > availWidth) eqDiv.style.transform = `scale(${(availWidth - 10) / eqWidth})`;
                else eqDiv.style.transform = `scale(1)`;
            };
            requestAnimationFrame(fitEquation); setTimeout(fitEquation, 350); 
        });

        let gridItems = [...this.#answerValues];
        while (gridItems.length < 9) {
            let fakeAnswer = this.#getRandomInt(1, 60); 
            if (!gridItems.includes(fakeAnswer)) gridItems.push(fakeAnswer);
        }
        gridItems = this.#shuffle(gridItems); 

        gridItems.forEach((numberValue) => {
            const cell = document.createElement("div");
            cell.className = "h-16 sm:h-20 bg-slate-100 dark:bg-slate-700 dark:text-slate-100 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-slate-700 cursor-pointer transition-all duration-200 relative select-none hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-transparent overflow-hidden shadow-sm";
            const spanText = document.createElement("span"); spanText.textContent = numberValue;
            const checkIcon = document.createElement("div");
            checkIcon.className = "mc-checkmark absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full items-center justify-center text-white text-[10px] sm:text-xs shadow-sm";
            checkIcon.innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
            cell.appendChild(spanText); cell.appendChild(checkIcon);
            cell.onclick = () => this.#toggleCell(cell, numberValue);
            this.#dom.grid.appendChild(cell);
        });
    }

    #toggleCell(cell, numberValue) {
        if (this.#selected.has(numberValue)) {
            this.#selected.delete(numberValue); cell.classList.remove("mc-tile-selected");
        } else {
            if (this.#selected.size >= this.#currentReqCount) { this.#showAlert(this.#t.maxSel.replace('{count}', this.#currentReqCount), "error"); return; }
            this.#selected.add(numberValue); cell.classList.add("mc-tile-selected");
        }
        this.#dom.alertBox.classList.add("hidden");
    }

    #triggerFail(reason) {
        this.#failCount++; this.#dom.failCountEl.textContent = this.#failCount;
        const outputJSON = Object.freeze({
            status: "failed", reason: reason, attemptsUsed: this.#failCount,
            maxAttempts: this.#settings.maxAttempts, levelPlayed: this.#currentLevel, timestamp: new Date().toISOString()
        });

        if (this.#failCount >= this.#settings.maxAttempts) {
            this.#showAlert(this.#t.blck.replace('{max}', this.#settings.maxAttempts), "error");
            this.#shakeBox(); this.#dom.grid.style.pointerEvents = "none"; this.#dom.verifyBtn.disabled = true;
            setTimeout(() => this.#closeModal('blocked'), 1200);
            this.#settings.onBlocked(Object.freeze({ ...outputJSON, status: "blocked" }));
        } else {
            if(reason !== 'closed_by_user') {
                this.#showAlert(this.#t.incorr.replace('{left}', this.#settings.maxAttempts - this.#failCount), "error");
                this.#shakeBox();
                setTimeout(() => this.#generateChallenge(), 1500);
            } else this.#closeModal('cancel'); 
            this.#settings.onFail(outputJSON);
        }
    }

    #verifyResponse() {
        if (this.#selected.size !== this.#currentReqCount) {
            this.#showAlert(this.#t.exactSel.replace('{count}', this.#currentReqCount), "error");
            this.#shakeBox(); return;
        }

        let isCorrect = true;
        this.#answerValues.forEach(ans => { if (!this.#selected.has(ans)) isCorrect = false; });
        
        if (isCorrect) {
            this.#showAlert(`<svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${this.#t.verAcc}`, "success");
            this.#dom.grid.style.pointerEvents = "none";
            setTimeout(() => this.#closeModal('success'), 800);
            const simulatedToken = btoa(JSON.stringify({ valid: true, timestamp: Date.now(), level: this.#currentLevel }));
            this.#settings.onSuccess(Object.freeze({
                status: "success", data: { levelPlayed: this.#currentLevel, attemptsUsed: this.#failCount + 1, timestamp: new Date().toISOString(), token: simulatedToken }
            }));
        } else { this.#triggerFail('wrong_answer'); }
    }

    #shakeBox() {
        this.#dom.box.classList.remove("animate-shake");
        void this.#dom.box.offsetWidth; this.#dom.box.classList.add("animate-shake");
    }

    #showAlert(msg, type) {
        this.#dom.alertBox.innerHTML = msg;
        this.#dom.alertBox.className = "px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center transition-all duration-300 rounded mx-4 mb-2 flex justify-center items-center";
        if (type === "error") this.#dom.alertBox.classList.add("bg-red-100", "text-red-700", "dark:bg-red-900", "dark:text-red-100");
        else this.#dom.alertBox.classList.add("bg-green-100", "text-green-700", "dark:bg-green-900", "dark:text-green-100");
    }
}
