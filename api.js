<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MathCAPTCHA - Interactive Playground</title>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    
    <!-- KaTeX untuk Render Matematika -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class', // Mengaktifkan toggle dark mode manual
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    animation: { 'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both', 'spin-slow': 'spin 1.5s linear infinite' },
                    keyframes: {
                        shake: {
                            '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                            '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                            '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                            '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                        }
                    }
                }
            }
        }
    </script>
    
    <!-- Custom CSS untuk MathCAPTCHA -->
    <style>
        ::selection { background: #3b82f6; color: white; }
        .tile-selected { transform: scale(0.92); box-shadow: 0 0 0 4px #3b82f6; background-color: #eff6ff !important; color: #1d4ed8 !important; }
        .dark .tile-selected { background-color: #1e3a8a !important; color: #bfdbfe !important; }
        .checkmark { display: none; }
        .tile-selected .checkmark { display: flex; }
        .katex { font-size: 1.15em !important; }
        .rc-anchor-checkbox { width: 28px; height: 28px; background: #fff; border: 2px solid #c1c1c1; border-radius: 2px; transition: all 0.2s ease; }
        .rc-anchor-checkbox:hover { border-color: #b2b2b2; }
        .dark .rc-anchor-checkbox { background: #1e293b; border-color: #475569; }

        /* Toggle Switch CSS */
        .toggle-checkbox:checked { right: 0; border-color: #3b82f6; }
        .toggle-checkbox:checked + .toggle-label { background-color: #3b82f6; }
        .toggle-checkbox:checked + .toggle-label:after { transform: translateX(100%); border-color: white; }
    </style>
</head>
<body class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 antialiased font-sans transition-colors duration-300 min-h-screen flex flex-col">

    <!-- Navbar / Header -->
    <header class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <i class="fas fa-shield-halved text-2xl text-blue-600 dark:text-blue-400"></i>
                <h1 class="text-xl font-bold tracking-tight">MathCAPTCHA <span class="text-sm font-medium text-slate-400 ml-2 hidden sm:inline">Playground & Test</span></h1>
            </div>
            
            <!-- Dark Mode Toggle -->
            <div class="flex items-center gap-2">
                <i class="fas fa-sun text-yellow-500 text-sm"></i>
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="theme-toggle" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out border-slate-300 top-0 left-0" onclick="toggleTheme()"/>
                    <label for="theme-toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer transition-colors duration-200 ease-in-out"></label>
                </div>
                <i class="fas fa-moon text-slate-400 dark:text-blue-300 text-sm"></i>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- KIRI: Control Panel (Settings) -->
        <div class="md:col-span-5 space-y-6">
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div class="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 class="font-semibold text-lg"><i class="fas fa-sliders mr-2 text-blue-500"></i> Konfigurasi API</h2>
                </div>
                
                <div class="p-5 space-y-5">
                    <!-- Set Level -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tingkat Kesulitan (Level)</label>
                        <select id="setting-level" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors">
                            <option value="1">Level 1: Aritmatika Dasar</option>
                            <option value="2">Level 2: Akar & Pangkat</option>
                            <option value="3">Level 3: Aljabar Dasar</option>
                            <option value="4">Level 4: Trigonometri</option>
                            <option value="5">Level 5: Peluang & Harapan</option>
                            <option value="6">Level 6: Vektor (Dot Product)</option>
                            <option value="7">Level 7: Kalkulus (Turunan & Integral)</option>
                            <option value="random" selected>Acak Semua Level (Random)</option>
                        </select>
                    </div>

                    <!-- Set Bahasa -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bahasa UI (Language)</label>
                        <select id="setting-lang" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors">
                            <option value="id" selected>🇮🇩 Indonesia (ID)</option>
                            <option value="en">🇺🇸 English (EN)</option>
                            <option value="es">🇪🇸 Español (ES)</option>
                            <option value="fr">🇫🇷 Français (FR)</option>
                            <option value="de">🇩🇪 Deutsch (DE)</option>
                            <option value="ru">🇷🇺 Русский (RU)</option>
                            <option value="ar">🇸🇦 العربية (AR - RTL)</option>
                            <option value="zh">🇨🇳 中文 (ZH)</option>
                            <option value="ja">🇯🇵 日本語 (JA)</option>
                            <option value="hi">🇮🇳 हिन्दी (HI)</option>
                        </select>
                    </div>

                    <!-- Set Batas Percobaan -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Batas Gagal (Max Attempts)</label>
                        <input type="number" id="setting-attempts" value="5" min="1" max="10" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-colors">
                    </div>

                    <button onclick="applySettings()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <i class="fas fa-rotate"></i> Terapkan & Generate Ulang
                    </button>
                </div>
            </div>
            
            <!-- Dokumentasi Mini -->
            <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm border border-blue-200 dark:border-blue-800/50">
                <p><i class="fas fa-info-circle mr-1"></i> <b>Dokumentasi:</b> Ubah pengaturan di atas, lalu klik <b>Terapkan</b>. Widget di sebelah kanan akan dimuat ulang sesuai parameter yang Anda berikan. Output hasil verifikasi akan muncul di kotak Terminal hitam.</p>
            </div>
        </div>

        <!-- KANAN: Output Playground (Widget & Log) -->
        <div class="md:col-span-7 space-y-6 flex flex-col">
            
            <!-- Container Widget -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                <div class="absolute top-4 left-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <i class="fas fa-eye mr-1"></i> Live Preview
                </div>
                
                <!-- TEMPAT WIDGET DI-INJECT -->
                <div id="captcha-playground" class="mt-4"></div>
            </div>

            <!-- Container JSON Log (Terminal) -->
            <div class="bg-slate-900 rounded-2xl shadow-inner border border-slate-800 flex-grow flex flex-col overflow-hidden">
                <div class="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="text-slate-400 text-xs font-mono ml-2">Backend JSON Output Log</span>
                </div>
                <div id="playground-log" class="p-4 font-mono text-[11px] sm:text-xs text-green-400 overflow-y-auto h-48 sm:h-auto flex-grow break-words">
                    <span class="text-slate-500">// Log akan muncul di sini saat Anda berinteraksi dengan CAPTCHA...</span>
                </div>
            </div>

        </div>
    </main>

    <!-- Panggil File API.js -->
    <script src="https://jproject-1.github.io/captcha-math/api.js"></script>

    <!-- Logic Playground -->
    <script>
        // --- 1. Fungsi Ganti Tema (Dark/Light) ---
        function toggleTheme() {
            const htmlEl = document.documentElement;
            const isDark = document.getElementById('theme-toggle').checked;
            
            if (isDark) {
                htmlEl.classList.add('dark');
            } else {
                htmlEl.classList.remove('dark');
            }
            
            // Re-render widget agar tema CAPTCHA mengikuti tema halaman
            applySettings();
        }

        // Cek preferensi user saat pertama kali load
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.getElementById('theme-toggle').checked = true;
            document.documentElement.classList.add('dark');
        }

        // --- 2. Fungsi Cetak Log ke Terminal ---
        function updateLog(title, colorClass, data) {
            const logEl = document.getElementById('playground-log');
            const time = new Date().toLocaleTimeString();
            
            logEl.innerHTML = `<span class="text-slate-500">[${time}]</span> <span class="font-bold ${colorClass}">${title}</span><br>` + 
                              JSON.stringify(data, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
            logEl.scrollTop = logEl.scrollHeight; // Auto scroll ke bawah
        }

        // --- 3. Fungsi Apply Settings & Inisialisasi MathCAPTCHA ---
        function applySettings() {
            // Bersihkan Modal Overlay Lama (jika ada sisa di body)
            document.querySelectorAll('[id^="cm-overlay-"]').forEach(el => el.remove());

            // Ambil nilai dari input form
            const levelVal = document.getElementById('setting-level').value;
            const langVal = document.getElementById('setting-lang').value;
            const attemptVal = parseInt(document.getElementById('setting-attempts').value) || 5;
            
            // Tentukan mode berdasarkan toggle yang aktif
            const isDark = document.documentElement.classList.contains('dark');
            const modeVal = isDark ? 'dark' : 'light';

            // Reset Log Output
            document.getElementById('playground-log').innerHTML = '<span class="text-slate-500">// Parameter berhasil diperbarui. Menunggu interaksi...</span>';

            // PANGGIL API MathCAPTCHA
            new MathCAPTCHA({
                containerId: 'captcha-playground',
                mode: modeVal,
                level: levelVal === 'random' ? 'random' : parseInt(levelVal),
                language: langVal,
                maxAttempts: attemptVal,
                
                // CALLBACK EVENTS
                onSuccess: (res) => updateLog('[200 OK - VERIFIED]', 'text-blue-400', res),
                onFail: (res) => updateLog('[403 FORBIDDEN - WRONG ANSWER]', 'text-yellow-400', res),
                onBlocked: (res) => updateLog('[429 TOO MANY REQUESTS - BLOCKED]', 'text-red-500', res)
            });
        }

        // Render pertama kali saat halaman dimuat
        document.addEventListener('DOMContentLoaded', applySettings);
    </script>
</body>
</html>
