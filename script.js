/* ==========================================
   F4MYH - Mission Control V11
   ADIF + Leaflet + Worldwide Callsign Lookup
========================================== */


/* ==========================================
   STATION CONFIG
========================================== */

const STATION_CONFIG = {


    "9A/F4MYH": {


        callsign:"9A/F4MYH",


        lat:43.5081,


        lon:16.4402


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


    "Scanning logbook...",


    "Mapping QSOs...",


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
   LOAD LOCAL CALLSIGN DATABASE
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
   WORLDWIDE CALLSIGN PREFIX DATABASE
========================================== */


const PREFIX_COUNTRIES = {


    "F":"France",

    "TM":"France",

    "FG":"Guadeloupe",

    "FH":"Mayotte",

    "FK":"New Caledonia",

    "FP":"Saint Pierre",

    "FR":"Réunion",

    "FS":"Saint Martin",

    "FY":"French Guiana",



    "9A":"Croatia",

    "S5":"Slovenia",

    "E7":"Bosnia",

    "9H":"Malta",

    "I":"Italy",

    "IK":"Italy",

    "IZ":"Italy",

    "IS":"Sardinia",

    "IT9":"Sicily",


    "DL":"Germany",

    "DA":"Germany",

    "DB":"Germany",

    "DC":"Germany",

    "DD":"Germany",

    "DF":"Germany",

    "DG":"Germany",

    "DH":"Germany",

    "DJ":"Germany",

    "DK":"Germany",

    "DM":"Germany",


    "G":"United Kingdom",

    "GM":"Scotland",

    "GW":"Wales",

    "GI":"Northern Ireland",

    "M":"United Kingdom",



    "EA":"Spain",

    "EB":"Spain",

    "EC":"Spain",

    "ED":"Spain",

    "EE":"Spain",

    "EF":"Spain",

    "EG":"Spain",

    "EH":"Spain",



    "CT":"Portugal",

    "CU":"Azores",



    "ON":"Belgium",

    "OO":"Belgium",

    "OQ":"Belgium",



    "PA":"Netherlands",

    "PB":"Netherlands",

    "PC":"Netherlands",

    "PD":"Netherlands",



    "HB":"Switzerland",

    "HB0":"Liechtenstein",



    "OE":"Austria",

    "OK":"Czech Republic",

    "OM":"Slovakia",

    "SP":"Poland",

    "SQ":"Poland",



    "LA":"Norway",

    "LB":"Norway",

    "LC":"Norway",

    "SM":"Sweden",

    "OH":"Finland",

    "OY":"Faroe Islands",



    "UA":"Russia",

    "RA":"Russia",

    "R":"Russia",

    "UR":"Ukraine",

    "US":"Ukraine",

    "EU":"Belarus",

    "EW":"Belarus",



    "LZ":"Bulgaria",

    "YO":"Romania",

    "YP":"Romania",

    "SV":"Greece",

    "TA":"Turkey",



    "W":"United States",

    "K":"United States",

    "N":"United States",

    "AA":"United States",

    "AB":"United States",

    "AC":"United States",

    "AD":"United States",

    "AE":"United States",

    "AF":"United States",

    "AG":"United States",

    "AI":"United States",



    "VE":"Canada",

    "VA":"Canada",

    "VY":"Canada",



    "XE":"Mexico",

    "XA":"Mexico",



    "PY":"Brazil",

    "LU":"Argentina",

    "CX":"Uruguay",

    "CE":"Chile",

    "OA":"Peru",



    "JA":"Japan",

    "JE":"Japan",

    "JF":"Japan",

    "JG":"Japan",

    "JH":"Japan",

    "JI":"Japan",

    "JJ":"Japan",

    "JK":"Japan",



    "HL":"South Korea",

    "DS":"South Korea",



    "VK":"Australia",

    "ZL":"New Zealand",

    "ZS":"South Africa",



    "4Z":"Israel",

    "A6":"United Arab Emirates",

    "A7":"Qatar",

    "A9":"Bahrain",

    "9V":"Singapore",

    "9M":"Malaysia",

    "HS":"Thailand",

    "VU":"India",


};









/* ==========================================
   PREFIX LOOKUP
========================================== */


function getCountryFromCall(call){


    call = call.toUpperCase();



    // Supprime suffixes portable

    call = call.split("/")[0];



    // Recherche préfixe long en premier

    for(let size=3; size>=1; size--){


        const prefix =

        call.substring(

            0,

            size

        );



        if(PREFIX_COUNTRIES[prefix]){


            return {


                country:PREFIX_COUNTRIES[prefix]

            };


        }


    }



    return null;


}









/* ==========================================
   APPROXIMATE COORDINATES BY COUNTRY
========================================== */


const COUNTRY_COORDS = {


"France":[46.6,2.2],

"Croatia":[45.1,15.2],

"Germany":[51.1,10.4],

"Italy":[42.8,12.5],

"Spain":[40.4,-3.7],

"Portugal":[39.5,-8],

"United Kingdom":[54.5,-3],

"United States":[39.8,-98.5],

"Canada":[56.1,-106.3],

"Japan":[36.2,138.2],

"Australia":[-25.2,133.7],

"New Zealand":[-40.9,174.8],

"Brazil":[-14.2,-51.9],

"Russia":[61.5,105.3],

"China":[35.8,104.1],

"India":[20.5,78.9],

"South Korea":[37.5,127.9],


};









/* ==========================================
   CALLSIGN COORDINATE FINDER
========================================== */


async function getCallsignCoordinates(call){



    call = call.toUpperCase();



    // Base locale

    if(callsignDB[call]){


        return callsignDB[call];


    }






    const countryInfo =

    getCountryFromCall(call);





    if(countryInfo){


        const pos =

        COUNTRY_COORDS[countryInfo.country];



        if(pos){


            const coords={


                country:

                countryInfo.country,


                lat:

                pos[0] + 

                (Math.random()-0.5),


                lon:

                pos[1] +

                (Math.random()-0.5)


            };



            callsignDB[call]=coords;



            return coords;


        }


    }




    console.log(

        "Coordonnées manquantes:",

        call

    );



    return null;


}
/* ==========================================
   ADIF PARSER
========================================== */


async function parseADIF(

data,

station

){


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



        if(!call)

            continue;





        const coords =

        await getCallsignCoordinates(call);





        if(!coords)

            continue;





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


            time:

            getADIF("time_on"),


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
   LOAD LOGBOOK
========================================== */


async function loadADIF(){



    try{


        const response =

        await fetch(

            "./logbook.adi"

        );




        if(!response.ok){


            throw new Error(

                "logbook.adi introuvable"

            );


        }




        const text =

        await response.text();




        console.log(

            "ADI LOADED",

            text.substring(

                0,

                300

            )

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







    // Zoom automatique

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



        let max = 0;




        qsoData.forEach(q=>{



            if(q.distance > max)

                max = q.distance;



        });




        dxNumber.textContent =

        max + " km";


    }



}









/* ==========================================
   START SYSTEM
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
   BUTTON PRESS EFFECT
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
