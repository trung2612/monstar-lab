var slideIndex = 0;
const preBtn = document.querySelector("#prevSlide");
const nextBtn = document.querySelector("#nextSlide");
// KHai bào hàm hiển thị slide
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("item");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
  console.log(slideIndex);
}
//mặc định hiển thị slide đầu tiên
showSlides((slideIndex = 0));

function currentSlide(n) {
  showSlides((slideIndex = n));
}

nextBtn.addEventListener("click", () => {
   slideIndex++;
  if (slideIndex > 2) {
    slideIndex = 0;
  }
  currentSlide(slideIndex);
});

preBtn.addEventListener("click", () => {  
  if (slideIndex == 0 ) {
    slideIndex = 3;
  }
  slideIndex--;
  currentSlide(slideIndex);
});

setInterval(() => {
    slideIndex++;
  if (slideIndex > 2) {
    slideIndex = 0;
  }
  currentSlide(slideIndex);
}, 5000);