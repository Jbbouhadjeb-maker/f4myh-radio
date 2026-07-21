/* ==========================================
   F4MYH - Clean Script
========================================== */


/* TYPEWRITER */

const typing = document.querySelector(".typing");

const messages = [
    "Initializing station...",
    "Loading antennas...",
    "Connecting satellites...",
    "System online ✓"
];

let msg = 0;
let char = 0;


function typeWriter(){

    if(!typing) return;


    if(char < messages[msg].length){

        typing.textContent += messages[msg][char];

        char++;

        setTimeout(typeWriter,60);

    } else {

        setTimeout(()=>{

            typing.textContent="";
            char=0;
            msg++;

            if(msg >= messages.length){
                msg=0;
            }

            typeWriter();

        },1200);

    }

}


typing.textContent="";
typeWriter();





/* CARD HOVER 3D */

const cards = document.querySelectorAll(".card");


cards.forEach(card=>{


card.addEventListener("mousemove",(e)=>{


const rect = card.getBoundingClientRect();


const x =
e.clientX - rect.left;


const y =
e.clientY - rect.top;



const rotateX =
-(y - rect.height / 2) / 25;


const rotateY =
(x - rect.width / 2) / 25;



card.style.transform = 
`
perspective(800px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
`;



});



card.addEventListener("mouseleave",()=>{


card.style.transform="";


});


});
