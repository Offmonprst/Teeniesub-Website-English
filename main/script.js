// Variabel
const menuBtn = document.getElementById("menuBtn");
const loader = document.getElementById("loading-screen");
const content = document.getElementById("content");
const menuBox = document.getElementById("menuBox");
const whatsapp = document.getElementById("shareWA");
const copyurl = document.getElementById("Copyurl");
const facebook =document.getElementById("shareFB");
const twitter = document.getElementById("shareX");
const pageUrl = window.location.href;

// Toggle menu
menuBtn.addEventListener("click", () => {
    menuBox.classList.toggle("active");
});

window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hide");
        setTimeout(() => {
            loader.style.display = "none";
            content.style.display = "block";
        }, 800);
    }, 3000);
});

// Share link
whatsapp.addEventListener("click", () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`);
});
copyurl.addEventListener("click", () => {
    navigator.clipboard.writeText(pageUrl);
    alert("Link disalin");
});
facebook.addEventListener("click", () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, "_blank");
});
twitter.addEventListener("click", () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`, "_blank");
});
