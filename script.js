/* ==========================================
   F4MYH - Mission Control V7
========================================== */


/*
    LOCAL QRZ CONFIG

    NE PAS METTRE SUR GITHUB

    Les clés doivent normalement être
    utilisées côté serveur.
*/

const QRZ_CONFIG = {

    stations: {

        "F4MYH": {
            callsign:"F4MYH",
            apiKey:"7A95-D46F-BA03-DF11"
        },


        "9A/F4MYH": {
            callsign:"9A/F4MYH",
            apiKey:"6998-8E54-7255-6607"
        }

    }

};





/* ==========================================
   TYPEWRITER
========================================== */


const typing=document.querySelector(".typing");


const messages=[

"Initializing station...",
"Loading antennas...",
"Connecting satellites...",
"Scanning HF bands...",
"System online ✓"

];


let messageIndex=0;
let charIndex=0;



function typeWriter(){


if(!typing)return;


if(charIndex < messages[messageIndex].length){


typing.textContent += messages[messageIndex][charIndex];

charIndex++;

setTimeout(typeWriter,55);


}

else{


setTimeout(()=>{

typing.textContent="";

charIndex=0;

messageIndex++;


if(messageIndex>=messages.length)
messageIndex=0;


typeWriter();


},1200);


}


}



if(typing){

typing.textContent="";
typeWriter();

}









/* ==========================================
   MAP SYSTEM
========================================== */


let map;

let layers=[];


let qsoData=[];



function initMap(){


map=L.map("map")
.setView(
[45,10],
3
);



L.tileLayer(

"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

{

attribution:
"© OpenStreetMap © CARTO"

}

).addTo(map);


}







function clearLayers(){


layers.forEach(layer=>{

map.removeLayer(layer);

});


layers=[];


}







function displayQSOs(station){



clearLayers();



let qsos;


if(station==="ALL"){

qsos=qsoData;

}

else{

qsos=qsoData.filter(
q=>q.station===station
);

}




qsos.forEach(qso=>{


let marker=
L.marker(

[
qso.lat,
qso.lon
]

)

.addTo(map);



marker.bindPopup(`

<h3>
${qso.call}
</h3>

Country :
${qso.country}

<br>

Band :
${qso.band}

<br>

Mode :
${qso.mode}

<br>

Date :
${qso.date}

<br>

Distance :
${qso.distance} km

`);





let line=
L.polyline(

[

[
qso.stationLat,
qso.stationLon
],

[
qso.lat,
qso.lon
]

],

{

color:"#2997ff",

weight:2

}

)

.addTo(map);



layers.push(marker,line);



});



updateStats(qsos);



}









function updateStats(qsos){


let qsoNumber =
document.getElementById(
"qso-number"
);


let countryNumber =
document.getElementById(
"country-number"
);


let dxNumber =
document.getElementById(
"dx-number"
);





if(qsoNumber)
qsoNumber.textContent=qsos.length;




if(countryNumber){

let countries=
new Set(
qsos.map(q=>q.country)
);

countryNumber.textContent=
countries.size;

}





if(dxNumber){

let max=0;


qsos.forEach(q=>{

if(q.distance>max)
max=q.distance;

});


dxNumber.textContent=
max+" km";

}


}









/* ==========================================
   LOAD LOCAL DATA
========================================== */


fetch("qso-data.json")

.then(response=>response.json())

.then(data=>{


qsoData=data;


initMap();


displayQSOs("F4MYH");


})

.catch(error=>{


console.error(
"QSO data error:",
error
);


});









/* ==========================================
   BUTTONS
========================================== */


document
.querySelectorAll(".station-btn")
.forEach(button=>{


button.addEventListener(

"click",

()=>{


document
.querySelectorAll(".station-btn")
.forEach(btn=>
btn.classList.remove("active")
);



button.classList.add("active");



displayQSOs(
button.dataset.station
);



}

);


});
