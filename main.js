const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || import.meta.env.VITE_NASA_KEY || 'DEMO_KEY';
const FALLBACK_BACKGROUND = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2400&q=85';

function tick(){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    document.getElementById('clock').textContent = `${hh}:${mm}`;
    document.getElementById('date').textContent =
     now.toLocaleDateString(undefined,{weekday: 'long', month:'long', day:'numeric'});
}
tick();
setInterval(tick,1000);

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('search-input').value.trim();
    if(!q) return;
    window.location.href = `https://www.google.com/search?q=` + encodeURIComponent(q);
});

const DEFAULT_LINKS = [
  { name:'GitHub', url:'https://github.com' },
  { name:'YouTube', url:'https://youtube.com' },
  { name:'Reddit', url:'https://reddit.com' },
  { name:'Gmail', url:'https://mail.google.com' },
  { name:'Notion', url:'https://notion.so' },
];

const settingsButton = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const lightModeToggle = document.getElementById('light-mode-toggle');
const savedTheme = localStorage.getItem('real-tab-theme');

function setTheme(theme) {
  document.body.dataset.theme = theme;
  lightModeToggle.checked = theme === 'light';
  localStorage.setItem('real-tab-theme', theme);
}

setTheme(savedTheme === 'light' ? 'light' : 'dark');
settingsButton.addEventListener('click', () => {
  const isOpen = settingsPanel.classList.toggle('show');
  settingsPanel.setAttribute('aria-hidden', String(!isOpen));
  settingsButton.setAttribute('aria-expanded', String(isOpen));
});
lightModeToggle.addEventListener('change', () => {
  setTheme(lightModeToggle.checked ? 'light' : 'dark');
});

function renderQuickLinks(){
  const wrap = document.getElementById('quicklinks');
  wrap.innerHTML = DEFAULT_LINKS.map(l => `
    <a class="quicklink" href="${l.url}" target="_blank" rel="noopener">
      <div class="tile">
        <img src="https://www.google.com/s2/favicons?sz=64&domain=${new URL(l.url).hostname}" width="24" height="24">
      </div>
      <span>${l.name}</span>
    </a>
  `).join('');
}
renderQuickLinks();

document.getElementById('scroll-cue').addEventListener('click' , () => {
    document.getElementById('news').scrollIntoView({behavior:'smooth'});
});

document.getElementById('info-btn').addEventListener('click', () => {
  document.getElementById('apod-caption').classList.toggle('show');
});

async function loadAPOD(){
  try{
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_KEY)}`);
    if (!res.ok) throw new Error('APOD fetch failed');
    const data = await res.json();

    const imgUrl = data.media_type === 'image' ? (data.hdurl || data.url) : data.url;
    const layer = document.getElementById('bg-layer');
    layer.style.backgroundImage = `url("${imgUrl}")`;
    layer.classList.add('loaded');
    document.getElementById('apod-caption').textContent = data.title || '';
    if (NASA_KEY === 'DEMO_KEY') {
      document.getElementById('key-banner').classList.add('show');
    }
  } catch (e) {
    const layer = document.getElementById('bg-layer');
    layer.style.backgroundImage = `url("${FALLBACK_BACKGROUND}")`;
    layer.classList.add('loaded');
    document.getElementById('apod-caption').textContent = 'NASA\'s background is temporarily rate-limited.';
    document.getElementById('key-banner').classList.add('show');
  }
}
loadAPOD();

document.getElementById('key-banner-dismiss').addEventListener('click',()=>{
  document.getElementById('key-banner').classList.remove('show');
});

const FEEDS = {
  all: 'https://feeds.bbci.co.uk/news/rss.xml',
  technology: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
  science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
  sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
  entertainment: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
};
const CATS = [
  { id:'all', label:'All' },
  { id:'technology', label:'Technology' },
  { id:'science', label:'Science' },
  { id:'business', label:'Business' },
  { id:'sports', label:'Sports' },
  { id:'entertainment', label:'Entertainment' },
];
let activeCat = 'all';

function renderTabs(){
  const wrap = document.getElementById('tabs');
  wrap.innerHTML = CATS.map(c =>
    `<button class="tab ${c.id === activeCat ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`
  ).join('');
  wrap.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      renderTabs();
      fetchNews(activeCat);
    });
  });
}
renderTabs();

async function fetchNews(cat){
  const body = document.getElementById('news-body');
  body.innerHTML = '<p class="news-status">Loading headlines…</p>';
  try{
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEEDS[cat])}`);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items.length) throw new Error('empty');
    renderNews(data.items.slice(0, 12));
  } catch(e){
    body.innerHTML = '<p class="news-status">No news available.</p>';
  }
}
/*I told you its not ai coded dude stop searching*/
function renderNews(items){
  document.getElementById('news-body').innerHTML = `
    <div class="news-grid">
      ${items.map(it => `
        <a class="news-card" href="${it.link}" target="_blank" rel="noopener">
          ${it.thumbnail ? `<img class="thumb" src="${it.thumbnail}">` : ''}
          <div class="body">
            <h3>${it.title}</h3>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}
fetchNews(activeCat);