// ================= ELEMENT =================
const menuBtn = document.getElementById("menuBtn");
const menuBox = document.getElementById("menuBox");
const loader = document.getElementById("loading-screen");
const content = document.getElementById("content");
const gallery = document.getElementById("gallery");
const detailView = document.getElementById("detail-view");

// search elements
const searchBtn = document.getElementById("searchBtn");
const closeSearch = document.getElementById("closeSearch");
const searchBox = document.querySelector(".header-search");
const headerTitle = document.getElementById("headerTitle");
const searchInput = document.getElementById("searchInput");

let apiData = null;

// ================= FETCH & ROUTING =================
document.addEventListener("DOMContentLoaded", () => {
    fetch("Episode.json")
        .then(res => {
            if (!res.ok) throw new Error("Episode.json not Found");
            return res.json();
        })
        .then(data => {
            apiData = data;
            
            // SPA Routing: Check if there is an ?id= parameter in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const epsId = urlParams.get('id');

            if (epsId) {
                // Show Detail Page
                gallery.style.display = 'none';
                detailView.style.display = 'block';
                renderDetailView(epsId, apiData.gallery);
            } else {
                // Show Gallery
                gallery.style.display = 'grid';
                detailView.style.display = 'none';
                renderGallery(apiData.gallery);
            }
        })
        .catch(err => {
            console.error(err);
            gallery.innerHTML = `<p class="center-text">Failed to load Episode.json</p>`;
        });
});

// ================= RENDER GALLERY =================
function renderGallery(data) {
    if (!data || data.length === 0) {
        gallery.innerHTML = `<p class="center-text">Tidak ada episode</p>`;
        return;
    }

    let html = "";
    data.forEach(item => {
        html += `
        <div class="photo-card">
            <!-- Clicking the card adds ?id= to the URL and reloads the page -->
            <a href="?id=${item.id}" style="text-decoration:none; color:inherit;">
                <img src="${item.image}" alt="Episodes ${item.episode}">
                <h3>Eps: ${item.episode} || ${item.title}</h3>
                <p>${item.series} ~ ${item.date}</p>
            </a>
        </div>
        `;
    });

    gallery.innerHTML = html;
}

// ================= RENDER DETAIL VIEW =================
function renderDetailView(id, data) {
    const ep = data.find(item => String(item.id) === String(id));
    
    if (!ep) {
        detailView.innerHTML = `<a href="?" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to gallery</a><p class="center-text">Episode not found.</p>`;
        return;
    }

    // Convert Drive Links to Direct Downloads
    const vidId = getDriveId(ep.drive_url);
    const subId = getDriveId(ep.sub_url);

    let buttonsHtml = '';
    let warningHtml = '';

    // If Video exists, build video button
    if (vidId) {
        buttonsHtml += `<a href="download.html?id=${vidId}" class="alt-btn"><i class="fa-solid fa-download"></i> Download Video</a>`;
    }
    
    // If Subtitle exists, build subtitle button AND show warning
    if (subId) {
        warningHtml = `<div class="warning">⚠️ Download link for video and subtitles are provided separately, so it is expected to download everything!</div>`;
        buttonsHtml += `<a href="download.html?id=${subId}" class="alt-btn btn-sub"><i class="fa-solid fa-download"></i> Download Subtitle</a>`;
    }

    detailView.innerHTML = `
        <a href="?" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to gallery</a>

        <img src="${ep.image}" alt="Foto" class="detail-photo">
        <h2 class="detail-title">${ep.title}</h2>
        <p class="detail-upload"> Release on: <b>${ep.date}</b></p>

        <h3>Episode Description</h3>
        <p class="detail-desc">${ep.description}</p>

        <h3>Video Information</h3>
        <ul class="detail-info">
            <li><b>Duration:</b> ${ep.duration}</li>
            <li><b>Resolution:</b> ${ep.resolution}</li>
            <li><b>Size file:</b> ${ep.size}</li>
            <li><b>Format:</b> ${ep.format}</li>
        </ul>

        ${warningHtml}

        <div class="alt-buttons">
            ${buttonsHtml}
        </div>
    `;
}

// Helper: Extract ID from Google Drive URL
function getDriveId(url) {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

// ================= SEARCH & MENU TOGGLES =================
menuBtn.addEventListener("click", () => menuBox.classList.toggle("active"));

searchBtn.addEventListener("click", () => {
    searchBox.classList.add("active");
    headerTitle.classList.add("hide");
    searchInput.focus();
});

closeSearch.addEventListener("click", () => {
    searchBox.classList.remove("active");
    headerTitle.classList.remove("hide");
    searchInput.value = "";
    if (gallery.style.display !== 'none') {
        renderGallery(apiData?.gallery ||[]);
    }
});

searchInput.addEventListener("input", () => {
    if (gallery.style.display === 'none') return; // Don't search if on detail page
    const keyword = searchInput.value.toLowerCase();
    const filtered = apiData.gallery.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        String(item.episode).includes(keyword) ||
        item.date.toLowerCase().includes(keyword)
    );
    renderGallery(filtered);
});

// ================= LOADING SCREEN =================
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hide");
        setTimeout(() => {
            loader.style.display = "none";
            content.style.display = "block";
        }, 800);
    }, 2000);
});
