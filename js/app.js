document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    let btn = document.querySelector(".burger");
    let el = document.querySelector("header div");
    let close1 = document.querySelector(".close");


    btn.addEventListener("click", () => {
        el.classList.toggle("open-menu");
        btn.innerHTML === "☰" ? btn.innerHTML = "✕" : btn.innerHTML = "☰";
    });
    close1.addEventListener("click", () => {
        el.classList.toggle("open-menu");
        btn.innerHTML === "☰" ? btn.innerHTML = "✕" : btn.innerHTML = "☰";
    });
});