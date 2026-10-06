const $ = (id) => document.getElementById(id);

// ---- system requirements gate ----
const REQUIREMENTS = [
    ['Modern JavaScript (async/await)', () => { try { new Function('async () => {}'); return true; } catch { return false; } }],
    ['Fetch API', () => typeof fetch === 'function'],
    ['CSS Grid', () => window.CSS && CSS.supports('display', 'grid')],
    ['Internet connection', () => navigator.onLine],
    ['Screen width of at least 320px', () => window.innerWidth >= 320],
];

function checkRequirements() {
    const failed = REQUIREMENTS.filter(([, test]) => !test()).map(([name]) => name);
    $('req-list').replaceChildren(...failed.map((name) => Object.assign(document.createElement('li'), { textContent: name })));
    $('req-screen').hidden = !failed.length;
    $('app').hidden = failed.length > 0;
}

$('req-retry').addEventListener('click', checkRequirements);
window.addEventListener('online', checkRequirements);
window.addEventListener('offline', checkRequirements);
checkRequirements();

// ---- profile ----
function showError(msg) {
    $('error').textContent = msg;
    $('error').hidden = !msg;
}

async function getGitHubProfile(username) {
    showError('');
    try {
        const profileResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        if (!profileResponse.ok) throw new Error(profileResponse.status === 404 ? 'User not found' : 'GitHub request failed, try again later');
        const profile = await profileResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=3`);
        const repos = reposResponse.ok ? await reposResponse.json() : [];

        updateUI(profile, repos);
    } catch (error) {
        showError(error.message);
    }
}

function updateUI(profile, repos) {
    $('avatar').src = profile.avatar_url;
    $('avatar').alt = profile.name || profile.login;
    $('full-name').textContent = profile.name || profile.login;
    $('username').textContent = profile.login;
    $('bio').textContent = profile.bio || 'No bio available';
    $('location').textContent = profile.location || 'Not Available';
    $('company').textContent = profile.company || 'Not Available';
    $('repos').textContent = profile.public_repos;
    $('followers').textContent = profile.followers;
    $('following').textContent = profile.following;
    $('gists').textContent = profile.public_gists;

    $('repos-container').replaceChildren(...repos.map((repo) => {
        const card = document.createElement('div');
        card.className = 'work1';
        const link = Object.assign(document.createElement('a'), {
            href: repo.html_url, target: '_blank', rel: 'noopener', textContent: repo.name,
        });
        const data = document.createElement('div');
        data.className = 'data';
        data.textContent = `⭐ ${repo.stargazers_count}   🍴 ${repo.forks_count}`;
        card.append(link, data);
        return card;
    }));
}

$('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = $('search-input').value.trim();
    if (username) getGitHubProfile(username);
});
