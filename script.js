const STORAGE_KEY = 'hmt_shortcuts_v1';
const defaultIcon = (url) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=64`;

const shortcutList = document.getElementById('shortcut-list');
const addBtn = document.getElementById('add-shortcut');
const tpl = document.getElementById('shortcut-template');

let shortcuts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
}

function renderShortcuts() {
  shortcutList.innerHTML = '';
  shortcuts.forEach((item, index) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.href = item.url;
    node.querySelector('.shortcut-name').textContent = item.name;
    const img = node.querySelector('.shortcut-icon');
    img.src = item.icon || defaultIcon(item.url);
    img.alt = `Icon ${item.name}`;

    node.querySelector('.remove').addEventListener('click', (e) => {
      e.preventDefault();
      shortcuts.splice(index, 1);
      save();
      renderShortcuts();
    });

    node.querySelector('.edit').addEventListener('click', (e) => {
      e.preventDefault();
      const next = prompt('Dán URL icon mới:', item.icon || '');
      if (next === null) return;
      item.icon = next.trim();
      save();
      renderShortcuts();
    });

    shortcutList.appendChild(node);
  });
}

addBtn.addEventListener('click', () => {
  const name = prompt('Tên lối tắt:');
  if (!name) return;
  let url = prompt('Link mở tab mới (https://...):');
  if (!url) return;
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  const icon = prompt('URL icon (để trống để tự lấy):')?.trim() || '';

  shortcuts.push({ name: name.trim(), url, icon });
  save();
  renderShortcuts();
});

const vnTimeEl = document.getElementById('vn-time');
const vnDateEl = document.getElementById('vn-date');

function updateVietnamClock() {
  const now = new Date();
  vnTimeEl.textContent = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now) + ' (Giờ Việt Nam)';

  vnDateEl.textContent = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);
}

const monthLabel = document.getElementById('month-label');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

let calendarDate = new Date();

function toVietnamNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
}

function renderCalendar() {
  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();
  monthLabel.textContent = `Tháng ${m + 1}/${y}`;

  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();

  calendarGrid.innerHTML = '';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((d) => {
    const el = document.createElement('div');
    el.className = 'cell header';
    el.textContent = d;
    calendarGrid.appendChild(el);
  });

  for (let i = 0; i < start; i++) {
    const el = document.createElement('div');
    el.className = 'cell day empty';
    calendarGrid.appendChild(el);
  }

  const vnNow = toVietnamNow();
  for (let d = 1; d <= days; d++) {
    const el = document.createElement('div');
    el.className = 'cell day';
    el.textContent = d;
    if (y === vnNow.getFullYear() && m === vnNow.getMonth() && d === vnNow.getDate()) {
      el.classList.add('today');
    }
    calendarGrid.appendChild(el);
  }
}

prevMonth.addEventListener('click', () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  renderCalendar();
});
nextMonth.addEventListener('click', () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  renderCalendar();
});

renderShortcuts();
renderCalendar();
updateVietnamClock();
setInterval(updateVietnamClock, 1000);
