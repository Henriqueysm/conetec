document.addEventListener("DOMContentLoaded", () => {

    // Animação dos frames
    const frames = [
        "../images/frame/loading1.png",
        "../images/frame/loading2.png",
        "../images/frame/loading3.png",
        "../images/frame/loading4.png",
        "../images/frame/loading5.png"
    ];

    let index = 0;
    const img = document.getElementById("loader-img");

    setInterval(() => {
        index = (index + 1) % frames.length;
        img.src = frames[index];
    }, 150);
});

// ⚠️ IMPORTANTE: USAR addEventListener AO INVÉS DE window.onload
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("global-loader").classList.add("fade-out");
    }, 200);
});
