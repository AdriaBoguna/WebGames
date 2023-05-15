const carrusel = document.querySelector(".carrusel");
const carruselSlides = document.querySelector(".carrusel-slides");
const articles = document.querySelectorAll(".carrusel article");
const prevButton = document.querySelector(".carrusel-prev");
const nextButton = document.querySelector(".carrusel-next");

// Clonar el primer y último artículo
const firstArticleClone = articles[0].cloneNode(true);
const lastArticleClone = articles[articles.length - 1].cloneNode(true);

// Agregar clones al carrusel
carruselSlides.appendChild(firstArticleClone);
carruselSlides.insertBefore(lastArticleClone, articles[0]);

let activeIndex = 1; // El índice activo comienza en 1 debido al artículo clonado al principio
setActiveArticle();

function setActiveArticle() {
    articles.forEach((article, index) => {
        if (index === activeIndex - 1) {
            article.classList.add("active");
            const offsetX = article.offsetLeft - (carrusel.offsetWidth - article.offsetWidth) / 2;
            carruselSlides.style.transform = `translateX(-${offsetX}px)`;
        } else {
            article.classList.remove("active");
        }
    });
}

prevButton.addEventListener("click", () => {
    if (activeIndex > 1) {
        activeIndex--;
    } else {
        activeIndex = articles.length;
        setTimeout(() => {
            carruselSlides.style.transition = "none";
            setActiveArticle();
            setTimeout(() => {
                carruselSlides.style.transition = "transform 0.5s ease";
            }, 50);
        }, 500);
    }
    setActiveArticle();
});

nextButton.addEventListener("click", () => {
    if (activeIndex < articles.length) {
        activeIndex++;
    } else {
        activeIndex = 1;
        setTimeout(() => {
            carruselSlides.style.transition = "none";
            setActiveArticle();
            setTimeout(() => {
                carruselSlides.style.transition = "transform 0.5s ease";
            }, 50);
        }, 500);
    }
    setActiveArticle();
});