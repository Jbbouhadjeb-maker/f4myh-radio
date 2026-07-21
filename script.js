/* ==========================================
   F4MYH - Mission Control V4
   Clean JavaScript
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


let message = 0;
let letter = 0;



function writeText(){


    if(!typing) return;



    if(letter < messages[message].length){


        typing.textContent += 
        messages[message][letter];


        letter++;


        setTimeout(
            writeText,
            60
        );


    } else {


        setTimeout(()=>{


            typing.textContent="";


            letter=0;


            message++;



            if(message >= messages.length){

                message=0;

            }



            writeText();



        },1200);


    }


}



typing.textContent="";

writeText();








/* ==========================================
   SCROLL ANIMATION
========================================== */


const sections = document.querySelectorAll(
".about, .timeline, .projects, .gallery, .social"
);



sections.forEach(section=>{


    section.style.opacity="0";


    section.style.transform=
    "translateY(50px)";


    section.style.transition=
    "opacity .8s ease, transform .8s ease";


});





const revealObserver = new IntersectionObserver(
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
    threshold:.15
}
);





sections.forEach(section=>{

    revealObserver.observe(section);

});








/* ==========================================
   CARD 3D EFFECT
========================================== */


const cards = document.querySelectorAll(".card");



cards.forEach(card=>{


card.addEventListener(
"mousemove",
(e)=>{


const box =
card.getBoundingClientRect();



const x =
e.clientX - box.left;


const y =
e.clientY - box.top;



const rotateX =
-(y - box.height/2) / 20;



const rotateY =
(x - box.width/2) / 20;




card.style.transform = `

perspective(900px)

rotateX(${rotateX}deg)

rotateY(${rotateY}deg)

translateY(-10px)

`;



});






card.addEventListener(
"mouseleave",
()=>{


card.style.transform="";


}

);



});










/* ==========================================
   HERO MOUSE MOVEMENT
========================================== */


const hero =
document.querySelector(".hero-content");



document.addEventListener(
"mousemove",
(e)=>{


if(!hero) return;



const x =
(e.clientX / window.innerWidth - .5)
* 10;



const y =
(e.clientY / window.innerHeight - .5)
* 10;




hero.style.transform =
`
translate(
${x}px,
${y}px
)

`;



});









/* ==========================================
   BUTTON CLICK EFFECT
========================================== */


const buttons =
document.querySelectorAll("a");



buttons.forEach(button=>{


button.addEventListener(
"mousedown",
()=>{


button.style.transform=
"scale(.95)";


});


button.addEventListener(
"mouseup",
()=>{


button.style.transform="";


});


});
