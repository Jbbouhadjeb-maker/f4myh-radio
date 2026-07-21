/* ==========================================
   F4MYH - Mission Control V9
   QRZ + Leaflet + Local Callsign Database
========================================== */


/* ==========================================
   QRZ CONFIG
========================================== */

const QRZ_CONFIG = {

    stations: {

        "F4MYH": {

            callsign:"F4MYH",

            apiKey:"7A95-D46F-BA03-DF11",

            lat:48.8566,

            lon:2.3522

        },


        "9A/F4MYH": {

            callsign:"9A/F4MYH",

            apiKey:"6998-8E54-7255-6607",

            lat:43.5081,

            lon:16.4402

        }

    }

};





/* ==========================================
   GLOBAL VARIABLES
========================================== */

let map;

let layers=[];

let qsoData=[];

let callsignDB={};







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


    if(!typing)
        return;



    if(charIndex < messages[messageIndex].length){


        typing.textContent +=
        messages[messageIndex][charIndex];


        charIndex++;


        setTimeout(
            typeWriter,
            55
        );


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
   LOAD CALLSIGN DATABASE
========================================== */


async function loadCallsignDatabase(){


    try{


        const response =
        await fetch("./callsigns.json");



        callsignDB =
        await response.json();



        console.log(
            "Callsign database loaded",
            callsignDB
        );


    }


    catch(error){


        console.error(
            "Callsign database error",
            error
        );


    }


}









/* ==========================================
   MAP INIT
========================================== */


function initMap(){


    map = L.map("map")
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



    setTimeout(()=>{

        map.invalidateSize();

    },500);


}








/* ==========================================
   CLEAR MAP
========================================== */


function clearLayers(){


    layers.forEach(layer=>{


        map.removeLayer(layer);


    });


    layers=[];


}








/* ==========================================
   DISTANCE CALCULATOR
========================================== */


function calculateDistance(

lat1,

lon1,

lat2,

lon2

){


    const R = 6371;


    const dLat =
    (lat2-lat1)
    *
    Math.PI/180;


    const dLon =
    (lon2-lon1)
    *
    Math.PI/180;



    const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180)

    *

    Math.cos(lat2*Math.PI/180)

    *

    Math.sin(dLon/2)

    *

    Math.sin(dLon/2);



    return Math.round(

        R *
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        )

    );


}
/* ==========================================
   QRZ API FETCH
========================================== */


async function loadQRZQSOs(station){


    const config =
    QRZ_CONFIG.stations[station];



    if(!config){

        console.error(
            "Station inconnue"
        );

        return;

    }




    const formData = new URLSearchParams();


    formData.append(
        "KEY",
        config.apiKey
    );


    formData.append(
        "ACTION",
        "FETCH"
    );


    formData.append(
        "OPTION",
        "ALL,MAX:250"
    );




    try{


        const response =
        await fetch(

            "https://qrz-proxy.jb-bouhadjeb.workers.dev",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/x-www-form-urlencoded"

                },

                body:formData

            }

        );



        const text =
        await response.text();




        console.log(
            "QRZ RESPONSE",
            text
        );




        parseADIF(

            text,

            station

        );



    }


    catch(error){


        console.error(
            "QRZ API ERROR",
            error
        );


    }


}









/* ==========================================
   ADIF PARSER
========================================== */


function parseADIF(

data,

station

){



    qsoData=[];



    const records =
    data.split("<eor>");




    records.forEach(record=>{



        if(!record.includes("<call"))

            return;




        function getADIF(field){


            const regex =

            new RegExp(

                "<"+field+
                ":[0-9]+>([^<]*)",

                "i"

            );


            const result =
            record.match(regex);



            return result ?
            result[1].trim()
            :
            "";


        }






        const call =
        getADIF("call");




        const coords =
        callsignDB[call];





        if(!coords)

            return;







        const distance =

        calculateDistance(

            configStation(station).lat,

            configStation(station).lon,

            coords.lat,

            coords.lon

        );






        qsoData.push({


            station:station,


            call:call,


            country:
            coords.country,


            lat:
            coords.lat,


            lon:
            coords.lon,


            band:
            getADIF("band"),


            mode:
            getADIF("mode"),


            date:
            getADIF("qso_date"),



            distance:distance,


            stationLat:
            configStation(station).lat,


            stationLon:
            configStation(station).lon



        });



    });





    console.log(

        "QSOs affichables:",

        qsoData.length

    );



    displayQSOs();



}









function configStation(name){


    return QRZ_CONFIG.stations[name];


}









/* ==========================================
   DISPLAY QSO
========================================== */


function displayQSOs(){



    clearLayers();




    qsoData.forEach(qso=>{



        const marker =

        L.marker([

            qso.lat,

            qso.lon

        ])

        .addTo(map);






        marker.bindPopup(`

        <h3>${qso.call}</h3>

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






        const line =

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





        layers.push(

            marker,

            line

        );



    });




    updateStats();



}









/* ==========================================
   STATS
========================================== */


function updateStats(){



    const qsoNumber =
    document.getElementById(
        "qso-number"
    );



    const countryNumber =
    document.getElementById(
        "country-number"
    );



    const dxNumber =
    document.getElementById(
        "dx-number"
    );





    if(qsoNumber)

        qsoNumber.textContent =
        qsoData.length;






    if(countryNumber){


        const countries =

        new Set(

            qsoData.map(

                q=>q.country

            )

        );



        countryNumber.textContent =
        countries.size;


    }






    if(dxNumber){


        let max=0;



        qsoData.forEach(q=>{


            if(q.distance>max)

                max=q.distance;


        });




        dxNumber.textContent =
        max+" km";


    }


}









/* ==========================================
   START
========================================== */


async function startSystem(){


    if(!document.getElementById("map"))

        return;



    await loadCallsignDatabase();



    initMap();



    loadQRZQSOs(
        "F4MYH"
    );


}





startSystem();









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


                btn.classList.remove(
                    "active"
                );


            });





            button.classList.add(
                "active"
            );




            loadQRZQSOs(

                button.dataset.station

            );



        }

    );


});








/* ==========================================
   IMAGE LAZY LOAD
========================================== */


document
.querySelectorAll("img")
.forEach(img=>{


    img.loading="lazy";


});








/* ==========================================
   BUTTON PRESS
========================================== */


document
.querySelectorAll("a")
.forEach(button=>{


    button.addEventListener(

        "mousedown",

        ()=>{

            button.style.scale=".96";

        }

    );



    button.addEventListener(

        "mouseup",

        ()=>{

            button.style.scale="1";

        }

    );


});
