/* ==========================================
   F4MYH - Mission Control V8
========================================== */


/*
    LOCAL QRZ CONFIG

    TEST LOCAL UNIQUEMENT

    NE PAS DEPLOYER SUR GITHUB

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


    if(!typing) return;



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



            if(messageIndex>=messages.length){

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




    setTimeout(()=>{

        map.invalidateSize();

    },500);


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


        let marker =

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


        `);






        layers.push(marker);



    });




    updateStats(qsos);



}
/* ==========================================
   UPDATE STATS
========================================== */


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




    if(qsoNumber){

        qsoNumber.textContent =
        qsos.length;

    }





    if(countryNumber){


        let countries =
        new Set(

            qsos.map(
                q=>q.country
            )

        );


        countryNumber.textContent =
        countries.size;


    }





    if(dxNumber){


        let max=0;


        qsos.forEach(q=>{


            if(q.distance > max){

                max=q.distance;

            }


        });



        dxNumber.textContent =
        max+" km";


    }



}









/* ==========================================
   QRZ API LOCAL
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





    const url =

    `https://logbook.qrz.com/api?KEY=${config.apiKey}&ACTION=FETCH`;





    try{


        const response =

        await fetch(url);



        const text =

        await response.text();





        console.log(
            "QRZ RESPONSE",
            text
        );





        const parser =

        new DOMParser();





        const xml =

        parser.parseFromString(

            text,

            "text/xml"

        );





        const entries =

        xml.getElementsByTagName(
            "CALL"
        );





        qsoData=[];





        for(let i=0;i<entries.length;i++){



            let record =

            entries[i].parentNode;





            qsoData.push({



                station:station,



                call:

                record
                .getElementsByTagName("CALL")[0]
                ?.textContent || "",




                country:

                record
                .getElementsByTagName("COUNTRY")[0]
                ?.textContent || "Unknown",




                band:

                record
                .getElementsByTagName("BAND")[0]
                ?.textContent || "",




                mode:

                record
                .getElementsByTagName("MODE")[0]
                ?.textContent || "",




                date:

                record
                .getElementsByTagName("QSO_DATE")[0]
                ?.textContent || "",




                lat:

                parseFloat(

                record
                .getElementsByTagName("LAT")[0]
                ?.textContent

                ) || 0,




                lon:

                parseFloat(

                record
                .getElementsByTagName("LON")[0]
                ?.textContent

                ) || 0,




                distance:0,




                stationLat:45,

                stationLon:3



            });



        }





        console.log(

            "QSOs chargés :",

            qsoData.length

        );





        displayQSOs(station);



    }



    catch(error){


        console.error(

            "QRZ API ERROR",

            error

        );


    }



}









/* ==========================================
   START SYSTEM
========================================== */


if(document.getElementById("map")){


    initMap();


    loadQRZQSOs(
        "F4MYH"
    );


}









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


            btn.classList.remove(
                "active"
            );


        });






        button.classList.add(
            "active"
        );






        if(button.dataset.station==="ALL"){


            loadQRZQSOs(
                "F4MYH"
            );


        }


        else{


            loadQRZQSOs(

                button.dataset.station

            );


        }




    });



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
   BUTTON PRESS EFFECT
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
