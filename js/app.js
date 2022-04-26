document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    let btn = document.querySelector(".burger");
    let el = document.querySelector("header div");

    btn.addEventListener("click", () => {
        el.classList.toggle("open-menu");
        btn.innerHTML === "☰" ? btn.innerHTML = "✕" : btn.innerHTML = "☰";

    });
});