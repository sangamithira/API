const styleSelect = document.getElementById('styleSelect');
const seedInput = document.getElementById('seedInput');
const generateBtn = document.getElementById('generateBtn');
const randomBtn = document.getElementById('randomBtn');
const avatarPreview = document.getElementById('avatarPreview');
const endpointText = document.getElementById('endpointText');
const styleLabel = document.getElementById('styleLabel');
const seedLabel = document.getElementById('seedLabel');

const styleOptions = [
  'adventurer',
  'avataaars',
  'bottts',
  'initials',
  'lorelei',
  'micah',
  'miniavs',
  'notionists',
  'open-peeps',
  'pixel-art'
];

function randomSeed() {
  const words = ['moon', 'nova', 'atlas', 'pixel', 'echo', 'orbit', 'cloud', 'ember', 'forest', 'spark'];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomNumber = Math.floor(Math.random() * 900 + 100);
  return `${randomWord}-${randomNumber}`;
}

function buildEndpoint(style, seed) {
  const safeStyle = style.trim();
  const safeSeed = encodeURIComponent(seed.trim() || 'demo-user');
  return `https://api.dicebear.com/10.x/${safeStyle}/svg?seed=${safeSeed}`;
}

function updateEndpointPreview(style, seed) {
  const endpoint = buildEndpoint(style, seed);
  endpointText.textContent = endpoint;
  styleLabel.textContent = style;
  seedLabel.textContent = seed;
}

async function renderAvatar() {
  const style = styleSelect.value;
  const seed = seedInput.value.trim() || 'demo-user';

  updateEndpointPreview(style, seed);

  const url = buildEndpoint(style, seed);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const svgText = await response.text();
    avatarPreview.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    avatarPreview.alt = `Avatar generated with style ${style} and seed ${seed}`;
  } catch (error) {
    console.error(error);
    avatarPreview.alt = 'Unable to load avatar';
    avatarPreview.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
        <rect width="180" height="180" fill="#111827"/>
        <text x="50%" y="52%" text-anchor="middle" fill="#f8fafc" font-size="20" font-family="sans-serif">Avatar Error</text>
      </svg>
    `);
  }
}

generateBtn.addEventListener('click', renderAvatar);
randomBtn.addEventListener('click', () => {
  seedInput.value = randomSeed();
  renderAvatar();
});

styleSelect.addEventListener('change', renderAvatar);
seedInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    renderAvatar();
  }
});

styleSelect.value = 'bottts';
seedInput.value = 'demo-user';
renderAvatar();
