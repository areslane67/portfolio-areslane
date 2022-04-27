document.addEventListener("DOMContentLoaded", e => {
    console.log(navigator.userAgent);

    let el, modal, closed, open_modal;

    el = document.querySelectorAll(".grid-picture-large li");
    modal = document.querySelector(".parent-modale");
    closed = document.querySelector(".modale button");

    /* property elements */

    open_modal = function () {
        console.log(this.dataset);
        /* les variables */
        let image = this.dataset.image;
        let title = this.dataset.title;
        modal.classList.add("modale-active"); /* ajouter la classe active */
        /* sélectionner les sélecteurs html*/
        document.querySelector(".modale img").setAttribute("src", image);
        document.querySelector(".modale .desc h3").innerText = title;
    };
    for (rows of el) {
        rows.addEventListener("click", open_modal);
    }
    closed.addEventListener("click", () => {
        modal.classList.remove("modale-active");
    });
});