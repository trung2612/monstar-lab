const carouselSlide=document.querySelector(".row");
const carouselItems=document.querySelectorAll(".item");

//button
const prevBtn=document.querySelector("#prevSlide");
const nextBtn=document.querySelector("#nextSlide");

//currentCounter
let currentCounter=0;
const size=carouselItems[0].clientWidth+30;

//make slide show
function makeSlideshow(counter){
    //lam viec voi nut cham duoi slide
    currentCounter-=currentCounter-counter;
    //lam viec voi prev, next btn
    if(counter==carouselItems.length){
        carouselSlide.style.transition = "transform 0.4s ease-in-out";
        currentCounter=0;
        carouselSlide.style.transform = 'translateX('+(-size * currentCounter) + 'px';
    } else if(counter==-1){
        carouselSlide.style.transition = "transform 0.4s ease-in-out";
        currentCounter=carouselItems.length-1;
        carouselSlide.style.transform = 'translateX('+(-size * currentCounter) + 'px';
    }else{
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    carouselSlide.style.transform = 'translateX('+(-size * currentCounter) + 'px';
    }
}

//button listener
nextBtn.addEventListener('click',()=>{
    makeSlideshow(++currentCounter);
})

prevBtn.addEventListener('click',()=>{
    makeSlideshow(--currentCounter);
});

//set timeout
setInterval(()=>{
    makeSlideshow(++currentCounter);
}, 5000);