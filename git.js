const searchbtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const avatar = document.getElementById('avatar');
const fullName = document.getElementById('full-name')
const usernameDisplay = document.getElementById('username');
const bio = document.getElementById('bio');
const userLocation = document.getElementById('location');
const userCompany = document.getElementById('company');
const repoCount = document.getElementById('repos');
const followersCount = document.getElementById('followers');
const followingCount= document.getElementById('following');
const gistsCount = document.getElementById('gists')
const reposContainer = document.getElementById('repos-container');

async function getGitHubProfile(username) {
    try {
        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!profileResponse.ok) {
            throw new Error('User not found');
        }
        const profileData = await profileResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
        const reposData = await reposResponse.json();

        updateUI(profileData, reposData);
    }catch (error) {
        alert(error.message);
    }
}
function updateUI (profile,repos) {
    avatar.src = profile.avatar_url;
    avatar.alt = profile.name || profile.login;

    fullName.textContent = profile.name || profile.login;
    usernameDisplay.textContent = profile.login;
    bio.textContent = profile.bio || "NO bio available";

    userLocation.textContent = profile.location || "Not Available ";
    userCompany.textContent = profile.compay || "Not Available";

    reposCount.textContent = profile.public_repos;
    followersCount.textContent = profile.followers;
    followingCount.textContent = profile.following;
    gistsCount.textContext = profile.public_gists;

    reposContainer.innerHTML = "";
    repos.forEach(repo => {
        const repoHTML = `
        <div class="work1">
        <h3><a href ="${repo.html_url}" target = _blank"  style = "color: #1e2533; text-decoration: none;">${repo.name}</a></h3>"
        <div class= "data">
        <h6>⭐ ${repo.stargazers_count}</h6>
                    <h6>🍴 ${repo.forks_count}</h6>
                    </div>
                    </div>
        
        `;
        reposContainer.innerHTML += repoHTML
    });
    searchbtn.addEventListener('click', ()=>
    {
        const username = searchinput.value.trim();
        if (username !== "")
            getGitHubProfile(username);

    }
)};

searchInput.addEventListener('keydown',(event) => {
    if (event.key === 'enter') {
        const username = searchInput.value.trim();
        if (username !== "") {
            getGitHubProfile(username);
        }
    }
});
