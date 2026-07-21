/* ==========================================
   F4MYH - Mission Control V7
   QSO Network System
========================================== */


/* ==========================================
   TYPEWRITER
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

        typing.textContent += messages[messageIndex][charIndex];

        charIndex++;

        setTimeout(typeWriter,55);

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
   SCROLL ANIMATION
========================================== */


const revealElements =
document.querySelectorAll(
".about, .timeline, .qso-map, .projects, .gallery, .social"
);



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
threshold:.15
});



revealElements.forEach(el=>{

    el.style.opacity="0";

    el.style.transform="translateY(30px)";

    el.style.transition=
    "all .8s ease";

    observer.observe(el);

});











/* ==========================================
   QSO MAP
========================================== */


let map;


let currentLayers=[];



let allQSOs=[];



let activeStation="F4MYH";





function initMap(){



    map =
    L.map("map")
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

    )

    .addTo(map);

}





function clearMap(){


    currentLayers.forEach(layer=>{

        map.removeLayer(layer);

    });


    currentLayers=[];

}







function stationMarker(station){


    let marker =
    L.marker(
    [
    station.lat,
    station.lon
    ]
    )

    .addTo(map);



    marker.bindPopup(`

    <h3>
    📡 ${station.call}
    </h3>

    ${station.location}

    `);



    currentLayers.push(marker);


}







function drawQSOs(stationName){



    clearMap();



    let filtered;



    if(stationName==="ALL"){


        filtered=allQSOs;


    }else{


        filtered =
        allQSOs.filter(
        qso =>
        qso.station === stationName
        );


    }





    filtered.forEach(qso=>{



        let marker =
        L.marker(

        [
        qso.lat,
        qso.lon
        ]

        )

        .addTo(map);




        marker.bindPopup(`

        <b>
        ${qso.call}
        </b>
        <br><br>

        Country:
        ${qso.country}

        <br>

        Band:
        ${qso.band}

        <br>

        Mode:
        ${qso.mode}

        <br>

        Date:
        ${qso.date}

        <br>

        Distance:
        ${qso.distance} km

        `);





        let line =
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

        weight:2,

        opacity:.8

        }

        )

        .addTo(map);



        currentLayers.push(
        marker,
        line
        );



    });





    updateStats(filtered);



}








function updateStats(qsos){


    document
    .getElementById("qso-number")
    .textContent =
    qsos.length;



    let countries =
    new Set(
    qsos.map(
    q=>q.country
    )
    );


    document
    .getElementById("country-number")
    .textContent =
    countries.size;





    let max = 0;


    qsos.forEach(q=>{

        if(q.distance > max){

            max=q.distance;

        }

    });



    document
    .getElementById("dx-number")
    .textContent =
    max+" km";

}









/* ==========================================
   LOAD DATA
========================================== */


fetch("qso-data.json")

.then(response=>response.json())

.then(data=>{


    allQSOs=data;



    initMap();



    drawQSOs("F4MYH");


})

.catch(error=>{


console.error(
"QSO loading error:",
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
.forEach(btn=>{

btn.classList.remove("active");

});



button.classList.add("active");



drawQSOs(
button.dataset.station
);



});


});
