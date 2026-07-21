/* ==========================================
   F4MYH - Mission Control V11
   ADIF + Leaflet + Maidenhead Locator
========================================== */


/* ==========================================
   CONFIG STATION
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
   MAIDENHEAD GRID CONVERTER
========================================== */


function gridToLatLon(grid){


    if(!grid || grid.length < 4)

        return null;



    grid = grid.toUpperCase();



    let lon =
    (grid.charCodeAt(0)-65)
    *
    20
    -
    180;



    let lat =
    (grid.charCodeAt(1)-65)
    *
    10
    -
    90;



    lon +=
    parseInt(grid[2])
    *
    2;



    lat +=
    parseInt(grid[3]);




    if(grid.length >= 6){


        lon +=

        (grid.charCodeAt(4)-65)

        *

        (5/60);



        lat +=

        (grid.charCodeAt(5)-65)

        *

        (2.5/60);



    }



    return {


        country:"Unknown",


        lat:lat+0.5,


        lon:lon+1


    };


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

    Math.sin(dLat/2)

    *

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
    data.split("<eor>");



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
        getADIF("call");



        let coords =
        callsignDB[call];



        /*
            Si l'indicatif n'est pas dans
            callsigns.json on utilise le GRID
        */


        if(!coords){


            const grid =
            getADIF("gridsquare");



            coords =
            gridToLatLon(grid);



        }



        if(!coords){


            console.log(

                "Coordonnées manquantes:",

                call

            );


            continue;

        }





        const stationInfo =
        STATION_CONFIG[station];



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
            stationInfo.lat,


            stationLon:
            stationInfo.lon



        });


    }



    console.log(

        "QSOs affichables:",

        qsoData.length

    );



    console.log(qsoData);



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
   DISPLAY QSOs
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


    });




    updateStats();



    if(qsoData.length){


        const bounds =

        L.latLngBounds(

            qsoData.map(q=>[

                q.lat,

                q.lon

            ])

        );



        bounds.extend([

            STATION_CONFIG["9A/F4MYH"].lat,

            STATION_CONFIG["9A/F4MYH"].lon

        ]);



        map.fitBounds(

            bounds,

            {

                padding:[50,50]

            }

        );


    }


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

            qsoData.map(q=>q.country)

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
