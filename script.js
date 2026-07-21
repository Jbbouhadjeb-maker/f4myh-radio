/* ==========================================
   F4MYH - Mission Control V11
   ADIF + Leaflet + Local Callsign Database
========================================== */


/* ==========================================
   STATION CONFIG
========================================== */

const STATION_CONFIG = {

    "9A/F4MYH": {

        callsign:"9A/F4MYH",

        lat:43.5081,

        lon:16.4402,

        country:"Croatia"

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
   DISTANCE
========================================== */


function calculateDistance(

lat1,

lon1,

lat2,

lon2

){


    const R=6371;


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
   ADIF PARSER
========================================== */


async function parseADIF(data, station){


    qsoData=[];


    const records =
    data.split(/<eor>/i);



    const stationInfo =
    STATION_CONFIG[station];



    if(!stationInfo){

        console.error(
            "Station inconnue",
            station
        );

        return;

    }



    for(const record of records){


        if(!record.toLowerCase().includes("<call"))

            continue;



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
        getADIF("call").toUpperCase();



        if(!call)

            continue;



        let coords =
        callsignDB[call];



        /*
          Si le pays n'est pas dans
          callsigns.json on ignore pas
          le QSO, on met position inconnue
        */


        if(!coords){


            console.log(
                "Position inconnue:",
                call
            );


            continue;


        }





        const distance =

        calculateDistance(

            stationInfo.lat,

            stationInfo.lon,

            coords.lat,

            coords.lon

        );





        qsoData.push({


            station:station,


            call:call,


            country:
            coords.country || "Unknown",


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
            stationInfo.lat,


            stationLon:
            stationInfo.lon



        });



    }





    console.log(

        "QSOs affichables:",

        qsoData.length

    );



    displayQSOs();



}










/* ==========================================
   LOAD ADIF
========================================== */


async function loadADIF(){


    try{


        const response =
        await fetch("./logbook.adi");



        const text =
        await response.text();



        console.log(
            "ADI LOADED",
            text.substring(0,300)
        );



        await parseADIF(

            text,

            "9A/F4MYH"

        );


    }


    catch(error){


        console.error(
            "ADI ERROR",
            error
        );


    }


}









/* ==========================================
   DISPLAY MAP
========================================== */


function displayQSOs(){


    clearLayers();



    let bounds=[];



    qsoData.forEach(qso=>{


        const marker =

        L.marker([

            qso.lat,

            qso.lon

        ])

        .addTo(map);



        marker.bindPopup(`

        <h3>${qso.call}</h3>

        Pays :
        ${qso.country}

        <br>

        Bande :
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



        bounds.push([

            qso.lat,

            qso.lon

        ]);



    });





    /*
       Ajout du point station
    */


    const stationMarker =

    L.marker([

        43.5081,

        16.4402

    ])

    .addTo(map);



    stationMarker.bindPopup(

        "<b>9A/F4MYH</b><br>Croatia Station"

    );



    layers.push(

        stationMarker

    );



    bounds.push([

        43.5081,

        16.4402

    ]);





    if(bounds.length){


        map.fitBounds(

            bounds,

            {

                padding:[50,50]

            }

        );


    }



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


        countryNumber.textContent =

        new Set(

            qsoData.map(

                q=>q.country

            )

        ).size;


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



    await loadADIF();



}



startSystem();








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
