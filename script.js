// ================= ELEMENT =================
const menuBtn = document.getElementById("menuBtn");
const menuBox = document.getElementById("menuBox");
const loader = document.getElementById("loading-screen");
const content = document.getElementById("content");
const gallery = document.getElementById("gallery");

// search elements
const searchBtn = document.getElementById("searchBtn");
const closeSearch = document.getElementById("closeSearch");
const searchBox = document.querySelector(".header-search");
const headerTitle = document.getElementById("headerTitle");
const searchInput = document.getElementById("searchInput");

let apiData = null;

// ================= MENU TOGGLE =================
menuBtn.addEventListener("click", () => {
    menuBox.classList.toggle("active");
});

// ================= SEARCH TOGGLE =================
searchBtn.addEventListener("click", () => {
    searchBox.classList.add("active");
    headerTitle.classList.add("hide");
    searchInput.focus();
});

closeSearch.addEventListener("click", () => {
    searchBox.classList.remove("active");
    headerTitle.classList.remove("hide");
    searchInput.value = "";
    renderGallery(apiData?.gallery || []);
});

// ================= RENDER GALLERY (UPDATED) =================
function renderGallery(data) {
    if (!data || data.length === 0) {
        gallery.innerHTML = `<p class="center-text">Tidak ada episode</p>`;
        return;
    }

    let html = "";
    data.forEach(item => {
        html += `
        <a href="https://eng.teeniesubs.xyz${item.url}" class="photo-card">
            <img src="${item.image}" alt="Episode ${item.episode}">
            <h3>Eps: ${item.episode} || ${item.title}</h3>
            <p>${item.series} ~ ${item.date}</p>
        </a>
        `;
    });

    gallery.innerHTML = html;
}

// Helper function to extract Drive ID
function getDriveId(url) {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

// ================= SEARCH FILTER =================
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    if (!apiData || !apiData.gallery) return;

    const filtered = apiData.gallery.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        String(item.episode).includes(keyword) ||
        item.date.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
        gallery.innerHTML = `<p class="center-text">Episodes not found</p>`;
        return;
    }

    renderGallery(filtered);
});

// ================= FETCH EPISODE JSON =================
document.addEventListener("DOMContentLoaded", () => {
    fetch("https://teeniesub-eng.vercel.app/Episode.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("Episode.json not Found");
            }
            return res.json();
        })
        .then(data => {
            apiData = data;
            renderGallery(apiData.gallery);
        })
        .catch(err => {
            console.error(err);
            gallery.innerHTML = `
                <p class="center-text">
                    Failed open Episode.json
                </p>
            `;
        });
});

window.addEventListener("scroll", () => {
    searchBox.classList.remove("active");
    headerTitle.classList.remove("hide");
});

// ================= LOADING SCREEN =================
window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hide");

        setTimeout(() => {
            loader.style.display = "none";
            content.style.display = "block";

            if (location.pathname !== "/Episode") {
                history.pushState(null, "", "/Episode");
            }
        }, 800);
    }, 3000);
});
