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



    const prefixes = Object.keys(PREFIX_DATABASE)
        .sort((a,b)=>b.length-a.length);



    for(const prefix of prefixes){


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



    if(callsignDB[call]){


        return callsignDB[call];


    }




    const prefix = getPrefix(call);



    if(prefix){


        const data = PREFIX_DATABASE[prefix];



        const coords = {


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
