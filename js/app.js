document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    let btn = document.querySelector(".burger");
    let el = document.querySelector("header div");
    let close1 = document.querySelector(".close");

    let plus = document.querySelector(".plus1");
    let el1 = document.querySelector("main div.close-menu");

    btn.addEventListener("click", () => {
        el.classList.toggle("open-menu");
        btn.innerHTML === "☰" ? btn.innerHTML = "✕" : btn.innerHTML = "☰";
    });
    close1.addEventListener("click", () => {
        el.classList.toggle("open-menu");
        btn.innerHTML === "☰" ? btn.innerHTML = "✕" : btn.innerHTML = "☰";
    });

    plus.addEventListener("click", () => {
        el1.classList.toggle("open-plus");
        plus.innerHTML === "+ Plus" ? plus.innerHTML = "- Moins" : plus.innerHTML = "+ Plus";
        
    });
});