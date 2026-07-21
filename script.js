/* ==========================================
   F4MYH - Mission Control V6
========================================== */



/* ==========================================
   TYPEWRITER EFFECT
========================================== */


const typing = document.querySelector(".typing");


const messages = [
    "Initializing station...",
    "Loading antennas...",
    "Connecting satellites...",
    "Scanning HF bands...",
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



if(typing){

typing.textContent="";

typeWriter();

}









/* ==========================================
   SCROLL REVEAL
========================================== */


const revealElements =
document.querySelectorAll(
".about, .timeline, .qso-map, .projects, .gallery, .social"
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
   IMAGE LOADING
========================================== */


document
.querySelectorAll("img")
.forEach(img=>{

img.loading="lazy";

});









/* ==========================================
   BUTTON EFFECT
========================================== */


document
.querySelectorAll("a")
.forEach(button=>{


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











/* ==========================================
   QSO MAP SYSTEM
========================================== */


const mapElement =
document.getElementById("map");



if(mapElement){



const stations = {


"F4MYH":{

name:"F4MYH 🇫🇷",

position:[
48.85,
2.35
],

color:"#2997ff"

},



"9A/F4MYH":{

name:"9A/F4MYH 🇭🇷",

position:[
43.51,
16.44
],

color:"#a855f7"

}


};







const map =
L.map("map")
.setView(
[45,10],
3
);





L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"© OpenStreetMap"

}

)

.addTo(map);







const contacts = {



"F4MYH":[

{

call:"JA1XXX",

country:"Japan",

lat:35.6762,

lon:139.6503,

band:"20m",

mode:"FT8",

distance:"9700 km"

},


{

call:"W1ABC",

country:"USA",

lat:42.3601,

lon:-71.0589,

band:"40m",

mode:"SSB",

distance:"5600 km"

}

],




"9A/F4MYH":[


{

call:"DL1ABC",

country:"Germany",

lat:52.52,

lon:13.40,

band:"20m",

mode:"SSB",

distance:"850 km"

}


]



};







let currentLayer=[];





function loadStation(name){



currentLayer.forEach(item=>{

map.removeLayer(item);

});



currentLayer=[];



let station =
stations[name];



contacts[name].forEach(qso=>{



let marker =
L.marker(
[
qso.lat,
qso.lon
]
)

.addTo(map);



marker.bindPopup(`

<b>${qso.call}</b><br>

${qso.country}<br><br>

Band : ${qso.band}<br>

Mode : ${qso.mode}<br>

Distance : ${qso.distance}

`);





let line =
L.polyline(

[

station.position,

[
qso.lat,
qso.lon
]

],

{

color:station.color,

weight:2

}

)

.addTo(map);




currentLayer.push(
marker,
line
);



});






document
.getElementById("qso-number")
.textContent =
contacts[name].length;



document
.getElementById("country-number")
.textContent =
contacts[name].length;



document
.getElementById("dx-number")
.textContent =
contacts[name][0].distance;



}







loadStation("F4MYH");








/* ==========================================
   STATION BUTTONS
========================================== */


document
.querySelectorAll(".station-btn")
.forEach(button=>{


button.addEventListener(
"click",
()=>{


document
.querySelectorAll(".station-btn")
.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



let station =
button.dataset.station;



if(station==="ALL"){


loadStation("F4MYH");

setTimeout(()=>{

loadStation("9A/F4MYH");

},100);


}

else{


loadStation(station);

}



});

});



}
