/* ==========================================
   F4MYH - Mission Control V11
   ADIF + Leaflet + Smart Callsign Locator
========================================== */


/* ==========================================
   STATION CONFIG
========================================== */


const STATION_CONFIG = {


    "9A/F4MYH": {

        callsign:"9A/F4MYH",

        country:"Croatia",

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
   LOAD LOCAL DATABASE
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


        console.log(

            "No local database"

        );


        callsignDB={};


    }


}








/* ==========================================
   PREFIX DATABASE
========================================== */


const PREFIX_DATABASE = {


/* Europe */


"F": ["France",46.6,2.2],

"TM": ["France",46.6,2.2],

"DL": ["Germany",51,10],

"DA": ["Germany",51,10],

"DB": ["Germany",51,10],

"DC": ["Germany",51,10],

"DD": ["Germany",51,10],

"DE": ["Germany",51,10],

"DF": ["Germany",51,10],

"DG": ["Germany",51,10],

"DH": ["Germany",51,10],

"DJ": ["Germany",51,10],

"DK": ["Germany",51,10],

"DM": ["Germany",51,10],


"EA": ["Spain",40,-4],

"EB": ["Spain",40,-4],


"CT": ["Portugal",39,-8],


"EI": ["Ireland",53,-8],


"G": ["United Kingdom",54,-2],

"M": ["United Kingdom",54,-2],

"MW": ["Wales",52,-3],


"ON": ["Belgium",50.8,4.3],

"PA": ["Netherlands",52.1,5.3],


"HB": ["Switzerland",46.8,8.2],

"HB0": ["Liechtenstein",47.1,9.5],


"I": ["Italy",42.8,12.5],


"OE": ["Austria",47.5,14.5],


"OK": ["Czech Republic",49.8,15.5],

"OM": ["Slovakia",48.7,19.5],


"SP": ["Poland",52,19],

"SQ": ["Poland",52,19],


"SM": ["Sweden",60,18],


"OH": ["Finland",64,26],


"LA": ["Norway",61,8],


"OZ": ["Denmark",56,10],


"UA": ["Russia",55,37],

"RA": ["Russia",55,37],

"RK": ["Russia",55,37],


"UR": ["Ukraine",49,32],

"UT": ["Ukraine",49,32],


"EU": ["Belarus",53.7,27.9],


"LY": ["Lithuania",55.2,23.8],

"ES": ["Estonia",58.6,25],


"YU": ["Serbia",44,21],

"Z3": ["North Macedonia",41.6,21.7],


"9A": ["Croatia",45.1,15.2],

"E7": ["Bosnia",44,17],


"S5": ["Slovenia",46.1,14.9],


/* ==========================================
   PREFIX DATABASE (SUITE)
========================================== */


/* Amérique du Nord */


"K": ["United States",39,-98],

"N": ["United States",39,-98],

"W": ["United States",39,-98],

"AA": ["United States",39,-98],

"AB": ["United States",39,-98],

"AC": ["United States",39,-98],

"AD": ["United States",39,-98],

"AE": ["United States",39,-98],

"AF": ["United States",39,-98],

"AG": ["United States",39,-98],


"VE": ["Canada",56,-106],

"VA": ["Canada",56,-106],

"VO": ["Canada",56,-106],

"VY": ["Canada",56,-106],


"XE": ["Mexico",23,-102],

"XA": ["Mexico",23,-102],


"6Y": ["Jamaica",18.1,-77.3],


"KP4": ["Puerto Rico",18.2,-66.5],


"FG": ["Guadeloupe",16.2,-61.5],


"FM": ["Martinique",14.6,-61],


"PJ": ["Caribbean Netherlands",12.1,-68.9],




/* Amérique du Sud */


"PY": ["Brazil",-10,-55],

"PP": ["Brazil",-10,-55],


"LU": ["Argentina",-34,-64],


"CX": ["Uruguay",-32,-56],


"CE": ["Chile",-30,-71],


"HK": ["Colombia",4,-72],


"HC": ["Ecuador",-1,-78],


"OA": ["Peru",-9,-75],


"YV": ["Venezuela",8,-66],




/* Afrique */


"ZS": ["South Africa",-30,25],

"ZR": ["South Africa",-30,25],

"ZT": ["South Africa",-30,25],


"CN": ["Morocco",31,-7],


"EA8": ["Canary Islands",28,-17],


"5H": ["Tanzania",-6,35],


"7X": ["Algeria",28,2],


"SU": ["Egypt",27,30],


"9G": ["Ghana",7,-1],


"5N": ["Nigeria",9,8],


"TY": ["Benin",9,2],




/* Asie */


"JA": ["Japan",36,138],

"JE": ["Japan",36,138],

"JF": ["Japan",36,138],

"JG": ["Japan",36,138],

"JH": ["Japan",36,138],

"JI": ["Japan",36,138],

"JJ": ["Japan",36,138],

"JK": ["Japan",36,138],


"HL": ["South Korea",37,127],


"BY": ["China",35,103],

"BG": ["China",35,103],


"BV": ["Taiwan",23.7,121],


"VU": ["India",21,78],


"HS": ["Thailand",15,101],


"9M": ["Malaysia",4,102],


"YB": ["Indonesia",-2,118],


"DU": ["Philippines",13,122],


"4Z": ["Israel",31,35],


"A6": ["United Arab Emirates",24,54],




/* Océanie */


"VK": ["Australia",-25,133],

"ZL": ["New Zealand",-41,174],


"FK": ["New Caledonia",-21,165],


"KH": ["United States Pacific",19,-155],


"NH": ["United States Pacific",19,-155],


"V7": ["Marshall Islands",7,171],


"9V": ["Singapore",1.3,103.8],
   
/* Préfixes ajoutés */

"LB": ["Norway",61,8],
"LG": ["Norway",61,8],

"LZ": ["Bulgaria",42.7,25.5],

"EC": ["Spain",40,-4],

"PE": ["Netherlands",52.1,5.3],
"PD": ["Netherlands",52.1,5.3],

"YC": ["Indonesia",-2,118],
"YD": ["Indonesia",-2,118],

"SA": ["Sweden",60,18],

"BD": ["China",35,103],
"BI": ["China",35,103],

"BX": ["Taiwan",23.7,121],

"DS": ["South Korea",37,127],

"TA": ["Turkey",39,35],

"JR": ["Japan",36,138],

"R1": ["Russia",55,37],
"R3": ["Russia",55,37],
"R4": ["Russia",55,37],
"R8": ["Russia",55,37],

"RU": ["Russia",55,37],
"RW": ["Russia",55,37],
"RD": ["Russia",55,37],
"UB": ["Russia",55,37],

"YO": ["Romania",45.9,24.9],

"SV": ["Greece",39,22],

"UN": ["Kazakhstan",48,68],

/* ==========================================
   NOUVEAUX PREFIXES MANQUANTS
========================================== */


/* Europe */

"3A": ["Monaco",43.7,7.4],

"4O": ["Montenegro",42.7,19.3],

"9H": ["Malta",35.9,14.5],

"CT": ["Portugal",39,-8],

"CU": ["Azores",38.5,-28],

"EA6": ["Balearic Islands",39.5,2.9],

"EA9": ["Ceuta and Melilla",35.9,-5.3],

"EK": ["Armenia",40.2,44.5],

"ER": ["Moldova",47,28.8],

"EW": ["Belarus",53.7,27.9],

"EX": ["Kyrgyzstan",41.2,74.7],

"EY": ["Tajikistan",38.8,71],

"EZ": ["Turkmenistan",38.9,59.5],

"HA": ["Hungary",47.1,19.5],

"HG": ["Hungary",47.1,19.5],

"HV": ["Vatican",41.9,12.45],

"IS": ["Sardinia",40.1,9],

"JY": ["Jordan",31,36],

"JT": ["Mongolia",46.8,103],

"LX": ["Luxembourg",49.8,6.1],

"OH0": ["Aland Islands",60.1,19.9],

"OY": ["Faroe Islands",62,7],

"OX": ["Greenland",64,-51],

"TF": ["Iceland",65,-18],

"TK": ["Corsica",42.1,9.1],

"Z6": ["Kosovo",42.6,21.1],



/* Afrique */

"3C": ["Equatorial Guinea",1.6,10.5],

"3X": ["Guinea",9.5,-13.7],

"5R": ["Madagascar",-18,47],

"5S": ["Madagascar",-18,47],

"5T": ["Mauritania",21,-10],

"5U": ["Niger",17,9],

"5V": ["Togo",8,1],

"5W": ["Samoa",-13.8,-172],

"5X": ["Uganda",1,32],

"5Y": ["Kenya",-1,38],

"6V": ["Senegal",14,-14],

"6W": ["Senegal",14,-14],

"7P": ["Lesotho",-29.6,28.2],

"7Q": ["Malawi",-13.2,34.3],

"8R": ["Guyana",5,-58.9],

"9J": ["Zambia",-13.1,27.8],

"9K": ["Kuwait",29.3,47.9],

"9L": ["Sierra Leone",8.5,-11.8],

"9N": ["Nepal",28.3,84],

"9Q": ["Democratic Republic of Congo",-4,22],

"9X": ["Rwanda",-1.9,29.9],

"9Y": ["Trinidad and Tobago",10.7,-61.5],

"ST": ["Sudan",15,32],

"TR": ["Gabon",-0.8,11.6],

"TZ": ["Mali",17,-4],



/* Amérique */

"3B8": ["Mauritius",-20.2,57.5],

"3B9": ["Rodrigues Island",-19.7,63.4],

"CP": ["Bolivia",-17,-65],

"CO": ["Cuba",21.5,-80],

"HI": ["Dominican Republic",19,-70.7],

"HJ": ["Colombia",4,-72],

"HR": ["Honduras",14.7,-86.2],

"TI": ["Costa Rica",9.9,-84],

"TG": ["Guatemala",15.5,-90],

"V2": ["Antigua and Barbuda",17.1,-61.8],

"V3": ["Belize",17.2,-88.5],

"V4": ["Saint Kitts and Nevis",17.3,-62.7],

"V5": ["Namibia",-22,17],

"V6": ["Micronesia",7.4,151],

"V8": ["Brunei",4.5,114.7],

"VP9": ["Bermuda",32.3,-64.8],

"PZ": ["Suriname",4,-56],



/* Asie */

"4J": ["Azerbaijan",40.4,47.8],

"4K": ["Azerbaijan",40.4,47.8],

"4L": ["Georgia",42,43.5],

"4P": ["Sri Lanka",7.8,80.7],

"4S": ["Sri Lanka",7.8,80.7],

"AP": ["Pakistan",30,70],

"AS": ["Pakistan",30,70],

"VR": ["Hong Kong",22.3,114.2],

"XU": ["Cambodia",12.5,104.9],

"XV": ["Vietnam",16,108],

"XW": ["Laos",18,105],

"XZ": ["Myanmar",21,96],

"YI": ["Iraq",33,44],

"YJ": ["Vanuatu",-16,167],

"YK": ["Syria",35,38],



/* Océanie */

"FO": ["French Polynesia",-17.7,-149],

"FW": ["Wallis and Futuna",-13.3,-176],

"ZK": ["New Zealand Islands",-42,173],

"ZP": ["Paraguay",-23,-58],

"VK9": ["Australian Territories",-12,130],

"AK": ["United States",39,-98],

"PU": ["Brazil",-10,-55],

"US": ["Ukraine",49,32]

};








/* ==========================================
   NORMALIZE CALLSIGN
========================================== */


function normalizeCall(call){


    return call

    .toUpperCase()

    .replace(/\/P$/,"")

    .replace(/\/M$/,"")

    .replace(/\/MM$/,"")

    .replace(/\/AM$/,"")

    .trim();


}









/* ==========================================
   GET PREFIX
========================================== */


function getPrefix(call){


    call = normalizeCall(call);



    // Exemple :
    // F4MYH -> F
    // DL1ABC -> DL
    // 9A5E -> 9A


    for(const prefix of Object.keys(PREFIX_DATABASE)
        .sort((a,b)=>b.length-a.length)){


        if(call.startsWith(prefix)){


            return prefix;


        }


    }



    return null;


}









/* ==========================================
   GET CALLSIGN POSITION
========================================== */


async function getCallsignCoordinates(call){


    call = normalizeCall(call);



    // Base locale en priorité

    if(callsignDB[call]){


        return callsignDB[call];


    }






    const prefix = getPrefix(call);




    if(prefix){


        const data =
        PREFIX_DATABASE[prefix];



        const coords={


            country:data[0],


            lat:data[1],


            lon:data[2]


        };



        callsignDB[call]=coords;



        console.log(

            "Prefix location",

            call,

            coords

        );



        return coords;


    }




    console.warn(

        "Coordonnées manquantes:",

        call

    );



    return null;


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
   DISTANCE CALCULATION
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
   ADIF FIELD READER
========================================== */


function getADIF(record,field){


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









/* ==========================================
   ADIF PARSER
========================================== */


async function parseADIF(

data,

station

){



    qsoData=[];



    const stationInfo =
    STATION_CONFIG[station];



    if(!stationInfo)

        return;





    const records =

    data

    .split(/<eor>/i);






    for(const record of records){



        if(

            !record

            .toLowerCase()

            .includes("<call")

        )

            continue;






        const rawCall =

        getADIF(

            record,

            "call"

        );





        if(!rawCall)

            continue;






        const coords =

        await getCallsignCoordinates(

            rawCall

        );





        if(!coords)

            continue;







        const distance =

        calculateDistance(

            stationInfo.lat,

            stationInfo.lon,

            coords.lat,

            coords.lon

        );






        const qso={



            station:station,



            call:normalizeCall(rawCall),



            country:
            coords.country,



            lat:
            coords.lat,



            lon:
            coords.lon,



            band:
            getADIF(

                record,

                "band"

            ),



            mode:
            getADIF(

                record,

                "mode"

            ),



            date:
            getADIF(

                record,

                "qso_date"

            ),



            time:
            getADIF(

                record,

                "time_on"

            ),



            distance:distance,



            stationLat:
            stationInfo.lat,



            stationLon:
            stationInfo.lon



        };






        qsoData.push(qso);



    }







    console.log(

        "QSOs affichables:",

        qsoData.length

    );



    console.log(

        qsoData

    );



    displayQSOs();



}









/* ==========================================
   LOAD ADIF FILE
========================================== */


async function loadADIF(){


    try{


        const response =

        await fetch(

            "./logbook.adi"

        );




        if(!response.ok){


            throw new Error(

                "Logbook introuvable"

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
   DISPLAY QSOs ON MAP
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

        Heure :
        ${qso.time}

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

            weight:2,

            opacity:0.7

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

        L.latLngBounds();



        qsoData.forEach(q=>{


            bounds.extend([

                q.lat,

                q.lon

            ]);


        });





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



        let max=0;



        qsoData.forEach(q=>{


            if(q.distance > max)

                max=q.distance;


        });




        dxNumber.textContent =

        max+" km";


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
   BUTTON PRESS ANIMATION
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
