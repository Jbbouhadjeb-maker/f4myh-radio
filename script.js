/* ==========================================
   F4MYH - Mission Control V5
   Lightweight JavaScript
========================================== */


/* ==========================================
   TYPEWRITER EFFECT
========================================== */


const typing = document.querySelector(".typing");


const messages = [
    "Initializing station...",
    "Loading antennas...",
    "Connecting satellites...",
    "System online ✓"
];


let messageIndex = 0;
let charIndex = 0;



function typeWriter(){


    if(!typing) return;



    if(charIndex < messages[messageIndex].length){


        typing.textContent +=
        messages[messageIndex][charIndex];


        charIndex++;


        setTimeout(
            typeWriter,
            55
        );


    }else{


        setTimeout(()=>{


            typing.textContent="";


            charIndex=0;


            messageIndex++;



            if(messageIndex >= messages.length){

                messageIndex=0;

            }



            typeWriter();



        },1200);


    }


}



typing.textContent="";

typeWriter();







/* ==========================================
   SIMPLE SCROLL REVEAL
========================================== */


const revealElements =
document.querySelectorAll(
".about, .timeline, .projects, .gallery, .social"
);



revealElements.forEach(element=>{


    element.style.opacity="0";

    element.style.transform=
    "translateY(30px)";


    element.style.transition=
    "opacity .8s ease, transform .8s ease";


});




const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


    if(entry.isIntersecting){


        entry.target.style.opacity="1";


        entry.target.style.transform=
        "translateY(0)";


    }


});


},
{
    threshold:0.15
});





revealElements.forEach(element=>{


    observer.observe(element);


});








/* ==========================================
   IMAGE LOADING FIX
========================================== */


const images =
document.querySelectorAll("img");



images.forEach(img=>{


    img.loading="lazy";


});








/* ==========================================
   BUTTON PRESS EFFECT
========================================== */


const buttons =
document.querySelectorAll("a");



buttons.forEach(button=>{


button.addEventListener(
"mousedown",
()=>{


button.style.scale=".96";


});


button.addEventListener(
"mouseup",
()=>{


button.style.scale="1";


});


});
