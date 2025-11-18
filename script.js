const grid = document.getElementById("grid");
const result = document.getElementById("result");
const verifyBtn = document.getElementById("verifyBtn");
const reloadBtn = document.getElementById("reloadBtn");
const questionEl = document.getElementById("question");

let selected = new Set();
let answerIndices = [];
let currentData = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function loadData() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    currentData = data;
    buildCaptcha();
  } catch (err) {
    console.error("Gagal memuat data JSON", err);
    questionEl.textContent = "Gagal memuat soal";
  }
}

function buildCaptcha() {
  grid.innerHTML = "";
  selected.clear();
  result.textContent = "";

  // Pilih soal acak
  const soal = currentData[Math.floor(Math.random() * currentData.length)];
  questionEl.innerHTML = soal.soal;

  // Ambil jawaban benar
  let answers = [...soal.jawaban];
  let benar = soal.benar;

  // Pastikan 9 kotak
  let gridItems = [];

  // Ambil jawaban benar dulu
  shuffle(benar).forEach((ans) => gridItems.push(ans));

  // Tambahkan jawaban lain sampai 9 kotak
  answers = answers.filter((a) => !gridItems.includes(a));
  shuffle(answers)
    .slice(0, 9 - gridItems.length)
    .forEach((ans) => gridItems.push(ans));

  // Acak urutan grid
  gridItems = shuffle(gridItems);

  // Simpan index jawaban benar
  answerIndices = [];
  gridItems.forEach((text, i) => {
    if (benar.includes(text)) answerIndices.push(i);
  });

  // Bangun kotak
  gridItems.forEach((text, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = index;
    cell.textContent = text;
    cell.onclick = () => toggle(index, cell);
    grid.appendChild(cell);
  });
}

function toggle(index, cell) {
  if (selected.has(index)) {
    selected.delete(index);
    cell.classList.remove("selected");
  } else {
    selected.add(index);
    cell.classList.add("selected");
  }
  result.textContent = "";
}

function verify() {
  const ok =
    selected.size === answerIndices.length &&
    answerIndices.every((i) => selected.has(i));
  if (ok) {
    result.style.color = "#16a34a";
    result.textContent = "Benar! CAPTCHA lolos.";
  } else {
    result.style.color = "#dc2626";
    result.textContent = "Jawaban salah. Silakan coba lagi.";
  }
}

verifyBtn.onclick = verify;
reloadBtn.onclick = () => location.reload();

// Load JSON saat pertama kali
loadData();
