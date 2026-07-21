/* ==========================================
   F4MYH - Mission Control V4
   JavaScript Effects
========================================== */


/* ==========================================
   TYPEWRITER EFFECT
========================================== */


const text = [
    "Initializing station...",
    "Loading antennas...",
    "Connecting satellites...",
    "System online ✓"
];


const typing = document.querySelector(".typing");


let line = 0;
let char = 0;



function typeWriter(){

    if(line >= text.length){
        return;
    }


    if(char < text[line].length){

        typing.textContent += text[line].charAt(char);

        char++;

        setTimeout(typeWriter,50);

    }

    else{

        setTimeout(()=>{

            typing.textContent="";

            line++;

            char=0;

            typeWriter();

        },1200);

    }

}



typeWriter();






/* ==========================================
   SCROLL REVEAL
========================================== */


const elements = document.querySelectorAll(
"section,.card,.glass,.event"
);



elements.forEach(el=>{

    el.style.opacity="0";

    el.style.transform="translateY(40px)";

    el.style.transition=
    "all .8s ease";

});



const observer = new IntersectionObserver(

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



elements.forEach(el=>{

observer.observe(el);

});








/* ==========================================
   MOUSE PARALLAX
========================================== */


const hero = document.querySelector(".hero-content");



document.addEventListener(
"mousemove",

(e)=>{


const x =
(e.clientX / window.innerWidth - .5)
* 15;


const y =
(e.clientY / window.innerHeight - .5)
* 15;



if(hero){

hero.style.transform =
`
translate(
${x}px,
${y}px
)
`;

}



}

);








/* ==========================================
   CARD 3D EFFECT
========================================== */


const cards =
document.querySelectorAll(".card");



cards.forEach(card=>{


card.addEventListener(
"mousemove",

(e)=>{


const rect =
card.getBoundingClientRect();


const x =
e.clientX - rect.left;


const y =
e.clientY - rect.top;



const rotateX =
(y - rect.height/2) / 15;


const rotateY =
(rect.width/2 - x) / 15;



card.style.transform =
`
perspective(800px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-10px)
`;



}



);



card.addEventListener(
"mouseleave",

()=>{


card.style.transform=
"";


}

);


});








/* ==========================================
   SMOOTH BUTTON FEEDBACK
========================================== */


document.querySelectorAll("a")
.forEach(link=>{


link.addEventListener(
"click",

()=>{


link.style.transform=
"scale(.95)";


setTimeout(()=>{

link.style.transform="";

},150);


}


);


});
