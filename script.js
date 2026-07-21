// ======================================================
// F4MYH RADIO MAP
// DXCC PREFIX DATABASE
// ======================================================

const DXCC_PREFIXES = {

    // EUROPE
    "F": {country:"France", lat:46.6, lon:2.2},
    "FG": {country:"Guadeloupe", lat:16.2, lon:-61.5},
    "FH": {country:"Mayotte", lat:-12.8, lon:45.1},
    "FJ": {country:"Saint Barthelemy", lat:17.9, lon:-62.8},
    "FK": {country:"New Caledonia", lat:-21.5, lon:165.5},
    "FM": {country:"Martinique", lat:14.6, lon:-61},
    "FO": {country:"French Polynesia", lat:-17.6, lon:-149.5},
    "FP": {country:"Saint Pierre and Miquelon", lat:46.8, lon:-56.3},
    "FR": {country:"Reunion", lat:-21.1, lon:55.5},
    "FS": {country:"Saint Martin", lat:18.1, lon:-63},
    "FY": {country:"French Guiana", lat:4.9, lon:-52.3},

    "DL": {country:"Germany", lat:51, lon:10},
    "DA": {country:"Germany", lat:51, lon:10},
    "DB": {country:"Germany", lat:51, lon:10},
    "DC": {country:"Germany", lat:51, lon:10},
    "DD": {country:"Germany", lat:51, lon:10},
    "DG": {country:"Germany", lat:51, lon:10},
    "DH": {country:"Germany", lat:51, lon:10},
    "DJ": {country:"Germany", lat:51, lon:10},
    "DK": {country:"Germany", lat:51, lon:10},
    "DM": {country:"Germany", lat:51, lon:10},
    "DO": {country:"Germany", lat:51, lon:10},

    "EA": {country:"Spain", lat:40.4, lon:-3.7},
    "EB": {country:"Spain", lat:40.4, lon:-3.7},
    "EC": {country:"Spain", lat:40.4, lon:-3.7},
    "ED": {country:"Spain", lat:40.4, lon:-3.7},
    "EE": {country:"Spain", lat:40.4, lon:-3.7},

    "EI": {country:"Ireland", lat:53.4, lon:-8},
    "G": {country:"United Kingdom", lat:54, lon:-2},
    "M": {country:"United Kingdom", lat:54, lon:-2},
    "GM": {country:"Scotland", lat:56.8, lon:-4.2},
    "GW": {country:"Wales", lat:52.2, lon:-3.5},

    "I": {country:"Italy", lat:41.8, lon:12.5},
    "IK": {country:"Italy", lat:41.8, lon:12.5},
    "IZ": {country:"Italy", lat:41.8, lon:12.5},

    "ON": {country:"Belgium", lat:50.8, lon:4.3},
    "OO": {country:"Belgium", lat:50.8, lon:4.3},

    "PA": {country:"Netherlands", lat:52.1, lon:5.3},
    "PB": {country:"Netherlands", lat:52.1, lon:5.3},

    "SP": {country:"Poland", lat:52, lon:19},
    "SN": {country:"Poland", lat:52, lon:19},
    "SQ": {country:"Poland", lat:52, lon:19},

    "OK": {country:"Czech Republic", lat:49.8, lon:15.5},
    "OM": {country:"Slovakia", lat:48.7, lon:19.7},

    "OE": {country:"Austria", lat:47.5, lon:14.5},
    "HB": {country:"Switzerland", lat:46.8, lon:8.2},

    "SM": {country:"Sweden", lat:62, lon:15},
    "SA": {country:"Sweden", lat:62, lon:15},

    "OH": {country:"Finland", lat:64, lon:26},
    "OF": {country:"Finland", lat:64, lon:26},

    "LA": {country:"Norway", lat:61, lon:8},
    "LB": {country:"Norway", lat:61, lon:8},
    "LN": {country:"Norway", lat:61, lon:8},

    "OZ": {country:"Denmark", lat:56, lon:10},
    "OY": {country:"Faroe Islands", lat:62, lon:-6},

    "ES": {country:"Estonia", lat:58.6, lon:25},
    "LY": {country:"Lithuania", lat:55.2, lon:23.8},
    "YL": {country:"Latvia", lat:57, lon:24.6},

    "LZ": {country:"Bulgaria", lat:42.7, lon:25.5},
    "YO": {country:"Romania", lat:46, lon:25},

    "9A": {country:"Croatia", lat:45.1, lon:15.2},
    "E7": {country:"Bosnia Herzegovina", lat:43.9, lon:17.7},
    "YT": {country:"Serbia", lat:44, lon:21},
    "4O": {country:"Montenegro", lat:42.7, lon:19.3},


    // AMERICAS

    "K": {country:"USA", lat:39.8, lon:-98.5},
    "N": {country:"USA", lat:39.8, lon:-98.5},
    "W": {country:"USA", lat:39.8, lon:-98.5},
    "AA": {country:"USA", lat:39.8, lon:-98.5},

    "VE": {country:"Canada", lat:56, lon:-106},
    "VA": {country:"Canada", lat:56, lon:-106},

    "XE": {country:"Mexico", lat:23.6, lon:-102.5},

    "LU": {country:"Argentina", lat:-34.6, lon:-58.4},
    "PY": {country:"Brazil", lat:-10, lon:-55},
    "CE": {country:"Chile", lat:-30, lon:-71},

    // ASIA

    "JA": {country:"Japan", lat:36, lon:138},
    "JR": {country:"Japan", lat:36, lon:138},
    "JE": {country:"Japan", lat:36, lon:138},

    "HL": {country:"South Korea", lat:36.5, lon:127.9},
    "DS": {country:"South Korea", lat:36.5, lon:127.9},

    "BY": {country:"China", lat:35.8, lon:104},
    "BD": {country:"China", lat:35.8, lon:104},

    "VU": {country:"India", lat:20.5, lon:78.9},
    "HS": {country:"Thailand", lat:15.8, lon:100.9},

    "YB": {country:"Indonesia", lat:-2.5, lon:118},
    "VK": {country:"Australia", lat:-25, lon:133},
    "ZL": {country:"New Zealand", lat:-41, lon:174},


    // AFRICA

    "ZS": {country:"South Africa", lat:-30, lon:25},
    "CN": {country:"Morocco", lat:31.7, lon:-7},
    "EA8": {country:"Canary Islands", lat:28, lon:-15},

    "5H": {country:"Tanzania", lat:-6, lon:35},
    "5N": {country:"Nigeria", lat:9, lon:8},

};
// ======================================================
// CALLSIGN PARSER
// Détection pays depuis indicatif radioamateur
// ======================================================


function cleanCallsign(call) {

    if (!call) return "";

    return call
        .toUpperCase()
        .trim()
        .replace(/\/P$/,"")
        .replace(/\/M$/,"")
        .replace(/\/MM$/,"")
        .replace(/\/QRP$/,"")
        .replace(/\/[0-9]+$/,"");

}



// Recherche du meilleur préfixe DXCC
// Exemple :
// EA8ABC -> EA8 avant EA
// EU1FQ -> EU
// F4MYH -> F

function findDXCC(call) {


    call = cleanCallsign(call);


    let bestMatch = null;
    let bestLength = 0;


    for (const prefix in DXCC_PREFIXES) {


        if (call.startsWith(prefix)) {


            if (prefix.length > bestLength) {

                bestMatch = DXCC_PREFIXES[prefix];
                bestLength = prefix.length;

            }

        }

    }


    return bestMatch;


}





// ======================================================
// PREFIXES SPECIAUX
// ======================================================


const SPECIAL_PREFIXES = {


    // Russie
    "UA0": {country:"Russia Asia",lat:60,lon:100},
    "RA0": {country:"Russia Asia",lat:60,lon:100},
    "R0": {country:"Russia Asia",lat:60,lon:100},


    // Ukraine
    "UR": {country:"Ukraine",lat:49,lon:32},
    "UT": {country:"Ukraine",lat:49,lon:32},
    "UY": {country:"Ukraine",lat:49,lon:32},


    // Belarus
    "EU": {country:"Belarus",lat:53.7,lon:27.9},
    "EW": {country:"Belarus",lat:53.7,lon:27.9},


    // Kazakhstan
    "UN": {country:"Kazakhstan",lat:48,lon:68},


    // Turkey
    "TA": {country:"Turkey",lat:39,lon:35},
    "TC": {country:"Turkey",lat:39,lon:35},


    // Greece
    "SV": {country:"Greece",lat:39,lon:22},
    "SW": {country:"Greece",lat:39,lon:22},


    // Portugal
    "CT": {country:"Portugal",lat:39.5,lon:-8},
    "CS": {country:"Portugal",lat:39.5,lon:-8},


    // Slovenia
    "S5": {country:"Slovenia",lat:46.1,lon:14.9},


    // Israel
    "4X": {country:"Israel",lat:31.5,lon:34.8},
    "4Z": {country:"Israel",lat:31.5,lon:34.8},


    // Saudi Arabia
    "HZ": {country:"Saudi Arabia",lat:24,lon:45},
    "7Z": {country:"Saudi Arabia",lat:24,lon:45},


    // UAE
    "A6": {country:"United Arab Emirates",lat:24.3,lon:54.3},


    // Indonesia
    "YC": {country:"Indonesia",lat:-2.5,lon:118},
    "YD": {country:"Indonesia",lat:-2.5,lon:118},
    "YE": {country:"Indonesia",lat:-2.5,lon:118},


    // Philippines
    "DU": {country:"Philippines",lat:12.8,lon:121.7},
    "DV": {country:"Philippines",lat:12.8,lon:121.7},


    // Vietnam
    "XV": {country:"Vietnam",lat:16,lon:108},


    // Taiwan
    "BV": {country:"Taiwan",lat:23.7,lon:121},
    "BU": {country:"Taiwan",lat:23.7,lon:121},


    // Brazil extensions
    "PP": {country:"Brazil",lat:-10,lon:-55},
    "PQ": {country:"Brazil",lat:-10,lon:-55},
    "PR": {country:"Brazil",lat:-10,lon:-55},


    // Colombia
    "HK": {country:"Colombia",lat:4.5,lon:-74},
    "HJ": {country:"Colombia",lat:4.5,lon:-74},


    // Peru
    "OA": {country:"Peru",lat:-9,lon:-75},


    // Ecuador
    "HC": {country:"Ecuador",lat:-1.8,lon:-78},


    // Venezuela
    "YV": {country:"Venezuela",lat:7,lon:-66},


    // South Africa
    "ZR": {country:"South Africa",lat:-30,lon:25},
    "ZS": {country:"South Africa",lat:-30,lon:25},


    // Caribbean
    "6Y": {country:"Jamaica",lat:18.1,lon:-77.3},
    "FG": {country:"Guadeloupe",lat:16.2,lon:-61.5},
    "KP4": {country:"Puerto Rico",lat:18.2,lon:-66.5},


};




// ======================================================
// Recherche complète
// ======================================================


function getCallsignLocation(call) {


    call = cleanCallsign(call);


    // priorité aux préfixes spéciaux

    for (const prefix in SPECIAL_PREFIXES) {

        if (call.startsWith(prefix)) {

            console.log(
                "Special prefix location",
                call,
                SPECIAL_PREFIXES[prefix]
            );

            return SPECIAL_PREFIXES[prefix];

        }

    }



    // sinon base principale

    let result = findDXCC(call);



    if(result){

        console.log(
            "Prefix location",
            call,
            result
        );

        return result;

    }



    console.warn(
        "Pays inconnu:",
        call
    );


    return null;


}
// ======================================================
// DXCC PREFIX DATABASE - PART 3/5
// EUROPE + AMERICAS EXTENSIONS
// ======================================================


Object.assign(SPECIAL_PREFIXES, {


    // =========================
    // EUROPE
    // =========================


    // Russia
    "UA": {country:"Russia",lat:55.7,lon:37.6},
    "RA": {country:"Russia",lat:55.7,lon:37.6},
    "RK": {country:"Russia",lat:55.7,lon:37.6},
    "RV": {country:"Russia",lat:55.7,lon:37.6},
    "RW": {country:"Russia",lat:55.7,lon:37.6},
    "RX": {country:"Russia",lat:55.7,lon:37.6},

    "UA0": {country:"Russia Asia",lat:60,lon:100},
    "RA0": {country:"Russia Asia",lat:60,lon:100},


    // Ukraine
    "UT": {country:"Ukraine",lat:49,lon:32},
    "UR": {country:"Ukraine",lat:49,lon:32},
    "UY": {country:"Ukraine",lat:49,lon:32},


    // Belarus
    "EU": {country:"Belarus",lat:53.7,lon:27.9},
    "EW": {country:"Belarus",lat:53.7,lon:27.9},


    // Portugal
    "CT": {country:"Portugal",lat:39.5,lon:-8},
    "CS": {country:"Portugal",lat:39.5,lon:-8},
    "CR": {country:"Portugal",lat:39.5,lon:-8},


    // Hungary
    "HA": {country:"Hungary",lat:47.1,lon:19.5},
    "HG": {country:"Hungary",lat:47.1,lon:19.5},


    // Slovenia
    "S5": {country:"Slovenia",lat:46.1,lon:14.9},


    // Greece
    "SV": {country:"Greece",lat:39,lon:22},
    "SW": {country:"Greece",lat:39,lon:22},


    // Turkey
    "TA": {country:"Turkey",lat:39,lon:35},
    "TB": {country:"Turkey",lat:39,lon:35},
    "TC": {country:"Turkey",lat:39,lon:35},


    // Kosovo
    "Z6": {country:"Kosovo",lat:42.6,lon:21},


    // Albania
    "ZA": {country:"Albania",lat:41.1,lon:20},



    // =========================
    // AMERICAS
    // =========================


    // USA
    "AA": {country:"USA",lat:39.8,lon:-98.5},
    "AB": {country:"USA",lat:39.8,lon:-98.5},
    "AC": {country:"USA",lat:39.8,lon:-98.5},
    "AD": {country:"USA",lat:39.8,lon:-98.5},
    "AE": {country:"USA",lat:39.8,lon:-98.5},
    "AF": {country:"USA",lat:39.8,lon:-98.5},
    "AG": {country:"USA",lat:39.8,lon:-98.5},
    "AI": {country:"USA",lat:39.8,lon:-98.5},
    "AK": {country:"USA Alaska",lat:64.2,lon:-149.5},
    "AL": {country:"USA Alaska",lat:64.2,lon:-149.5},


    // Canada provinces
    "VE1": {country:"Canada Nova Scotia",lat:45,lon:-63},
    "VE2": {country:"Canada Quebec",lat:46.8,lon:-71.2},
    "VE3": {country:"Canada Ontario",lat:44.5,lon:-79.5},
    "VE4": {country:"Canada Manitoba",lat:49.8,lon:-97},
    "VE5": {country:"Canada Saskatchewan",lat:52,lon:-106},
    "VE6": {country:"Canada Alberta",lat:53.5,lon:-113},
    "VE7": {country:"Canada British Columbia",lat:49.3,lon:-123},
    "VE8": {country:"Canada Northwest Territories",lat:62,lon:-114},


    // Mexico
    "XA": {country:"Mexico",lat:23.6,lon:-102.5},
    "XE": {country:"Mexico",lat:23.6,lon:-102.5},
    "XF": {country:"Mexico",lat:23.6,lon:-102.5},


    // Caribbean
    "V2": {country:"Antigua and Barbuda",lat:17.1,lon:-61.8},
    "V3": {country:"Belize",lat:17.2,lon:-88.5},
    "V4": {country:"Saint Kitts and Nevis",lat:17.3,lon:-62.7},
    "V5": {country:"Namibia",lat:-22.5,lon:17},
    "VP2": {country:"Caribbean Islands",lat:18,lon:-63},

    "KP3": {country:"Puerto Rico",lat:18.2,lon:-66.5},
    "KP4": {country:"Puerto Rico",lat:18.2,lon:-66.5},

    "HI": {country:"Dominican Republic",lat:18.7,lon:-70.1},
    "CM": {country:"Cuba",lat:21.5,lon:-78.9},



    // South America

    "PY": {country:"Brazil",lat:-10,lon:-55},
    "PP": {country:"Brazil",lat:-10,lon:-55},
    "PR": {country:"Brazil",lat:-10,lon:-55},
    "PS": {country:"Brazil",lat:-10,lon:-55},
    "PT": {country:"Brazil",lat:-10,lon:-55},
    "PU": {country:"Brazil",lat:-10,lon:-55},


    "LU": {country:"Argentina",lat:-34.6,lon:-58.4},
    "LW": {country:"Argentina",lat:-34.6,lon:-58.4},


    "CE": {country:"Chile",lat:-30,lon:-71},
    "CA": {country:"Chile",lat:-30,lon:-71},


    "OA": {country:"Peru",lat:-9,lon:-75},

    "HC": {country:"Ecuador",lat:-1.8,lon:-78},

    "HK": {country:"Colombia",lat:4.5,lon:-74},
    "HJ": {country:"Colombia",lat:4.5,lon:-74},

    "YV": {country:"Venezuela",lat:7,lon:-66},


});
// ======================================================
// DXCC PREFIX DATABASE - PART 4/5
// AFRICA + ASIA + OCEANIA
// ======================================================


Object.assign(SPECIAL_PREFIXES, {



    // =========================
    // AFRICA
    // =========================


    // Morocco
    "CN": {
        country:"Morocco",
        lat:31.7,
        lon:-7
    },


    // Algeria
    "7X": {
        country:"Algeria",
        lat:28,
        lon:2.6
    },


    // Tunisia
    "3V": {
        country:"Tunisia",
        lat:34,
        lon:9
    },


    // Egypt
    "SU": {
        country:"Egypt",
        lat:27,
        lon:30
    },


    // Libya
    "5A": {
        country:"Libya",
        lat:27,
        lon:17
    },


    // Senegal
    "6W": {
        country:"Senegal",
        lat:14.5,
        lon:-14.5
    },


    // Ghana
    "9G": {
        country:"Ghana",
        lat:7.9,
        lon:-1
    },


    // Nigeria
    "5N": {
        country:"Nigeria",
        lat:9,
        lon:8
    },


    // Kenya
    "5Z": {
        country:"Kenya",
        lat:-1,
        lon:37.9
    },


    // Tanzania
    "5H": {
        country:"Tanzania",
        lat:-6,
        lon:35
    },


    // Uganda
    "5X": {
        country:"Uganda",
        lat:1.3,
        lon:32
    },


    // Ethiopia
    "ET": {
        country:"Ethiopia",
        lat:9,
        lon:40
    },


    // Sudan
    "ST": {
        country:"Sudan",
        lat:15,
        lon:32
    },


    // South Africa
    "ZS": {
        country:"South Africa",
        lat:-30,
        lon:25
    },

    "ZR": {
        country:"South Africa",
        lat:-30,
        lon:25
    },


    // Namibia
    "V5": {
        country:"Namibia",
        lat:-22.5,
        lon:17
    },


    // Botswana
    "A2": {
        country:"Botswana",
        lat:-22,
        lon:24
    },


    // Zimbabwe
    "Z2": {
        country:"Zimbabwe",
        lat:-19,
        lon:29
    },


    // Zambia
    "9J": {
        country:"Zambia",
        lat:-13,
        lon:27
    },


    // Mozambique
    "C9": {
        country:"Mozambique",
        lat:-18,
        lon:35
    },


    // Madagascar
    "5R": {
        country:"Madagascar",
        lat:-18.8,
        lon:46.8
    },


    // Mauritius
    "3B8": {
        country:"Mauritius",
        lat:-20.2,
        lon:57.5
    },


    // Reunion
    "FR": {
        country:"Reunion",
        lat:-21.1,
        lon:55.5
    },



    // =========================
    // ASIA
    // =========================


    // Japan
    "JA": {
        country:"Japan",
        lat:36,
        lon:138
    },

    "JE": {
        country:"Japan",
        lat:36,
        lon:138
    },

    "JF": {
        country:"Japan",
        lat:36,
        lon:138
    },

    "JG": {
        country:"Japan",
        lat:36,
        lon:138
    },


    // China
    "BY": {
        country:"China",
        lat:35.8,
        lon:104
    },

    "BD": {
        country:"China",
        lat:35.8,
        lon:104
    },


    // South Korea
    "HL": {
        country:"South Korea",
        lat:36.5,
        lon:127.9
    },


    // Taiwan
    "BV": {
        country:"Taiwan",
        lat:23.7,
        lon:121
    },


    // India
    "VU": {
        country:"India",
        lat:20.5,
        lon:78.9
    },


    // Thailand
    "HS": {
        country:"Thailand",
        lat:15.8,
        lon:100.9
    },


    // Vietnam
    "XV": {
        country:"Vietnam",
        lat:16,
        lon:108
    },


    // Philippines
    "DU": {
        country:"Philippines",
        lat:12.8,
        lon:121.7
    },

    "DV": {
        country:"Philippines",
        lat:12.8,
        lon:121.7
    },


    // Indonesia
    "YB": {
        country:"Indonesia",
        lat:-2.5,
        lon:118
    },

    "YC": {
        country:"Indonesia",
        lat:-2.5,
        lon:118
    },

    "YD": {
        country:"Indonesia",
        lat:-2.5,
        lon:118
    },


    // Malaysia
    "9M": {
        country:"Malaysia",
        lat:4.2,
        lon:101.9
    },


    // Singapore
    "9V": {
        country:"Singapore",
        lat:1.35,
        lon:103.8
    },


    // Pakistan
    "AP": {
        country:"Pakistan",
        lat:30,
        lon:70
    },


    // Bangladesh
    "S2": {
        country:"Bangladesh",
        lat:23.7,
        lon:90.4
    },


    // Kazakhstan
    "UN": {
        country:"Kazakhstan",
        lat:48,
        lon:68
    },


    // Israel
    "4X": {
        country:"Israel",
        lat:31.5,
        lon:34.8
    },

    "4Z": {
        country:"Israel",
        lat:31.5,
        lon:34.8
    },


    // Saudi Arabia
    "HZ": {
        country:"Saudi Arabia",
        lat:24,
        lon:45
    },


    // UAE
    "A6": {
        country:"United Arab Emirates",
        lat:24.3,
        lon:54.3
    },



    // =========================
    // OCEANIA
    // =========================


    // Australia
    "VK": {
        country:"Australia",
        lat:-25,
        lon:133
    },


    // New Zealand
    "ZL": {
        country:"New Zealand",
        lat:-41,
        lon:174
    },


    // Fiji
    "3D2": {
        country:"Fiji",
        lat:-17.7,
        lon:178
    },


    // Samoa
    "5W": {
        country:"Samoa",
        lat:-13.8,
        lon:-172
    },


    // Tonga
    "A3": {
        country:"Tonga",
        lat:-21.1,
        lon:-175.2
    },


    // Papua New Guinea
    "P2": {
        country:"Papua New Guinea",
        lat:-6,
        lon:147
    },


    // Guam
    "KH2": {
        country:"Guam",
        lat:13.4,
        lon:144.7
    },


    // Hawaii
    "KH6": {
        country:"Hawaii",
        lat:19.8,
        lon:-155.5
    },


});
// ======================================================
// DXCC PREFIX DATABASE - PART 5/5
// RARE DXCC + ISLANDS + FINAL TOOLS
// ======================================================


Object.assign(SPECIAL_PREFIXES, {


    // =========================
    // EUROPE RARE
    // =========================


    // Monaco
    "3A": {
        country:"Monaco",
        lat:43.7,
        lon:7.4
    },


    // Vatican
    "HV": {
        country:"Vatican City",
        lat:41.9,
        lon:12.45
    },


    // San Marino
    "T7": {
        country:"San Marino",
        lat:43.9,
        lon:12.45
    },


    // Malta
    "9H": {
        country:"Malta",
        lat:35.9,
        lon:14.5
    },


    // Andorra
    "C3": {
        country:"Andorra",
        lat:42.5,
        lon:1.5
    },


    // Liechtenstein
    "HB0": {
        country:"Liechtenstein",
        lat:47.1,
        lon:9.5
    },


    // Gibraltar
    "ZB": {
        country:"Gibraltar",
        lat:36.1,
        lon:-5.35
    },



    // =========================
    // ATLANTIC ISLANDS
    // =========================


    // Canary Islands
    "EA8": {
        country:"Canary Islands",
        lat:28,
        lon:-15
    },


    // Azores
    "CU": {
        country:"Azores",
        lat:38.6,
        lon:-28
    },


    // Madeira
    "CT3": {
        country:"Madeira",
        lat:32.7,
        lon:-16.9
    },


    // Cape Verde
    "D4": {
        country:"Cape Verde",
        lat:16,
        lon:-24
    },


    // Bermuda
    "VP9": {
        country:"Bermuda",
        lat:32.3,
        lon:-64.8
    },



    // =========================
    // CARIBBEAN
    // =========================


    // Aruba
    "P4": {
        country:"Aruba",
        lat:12.5,
        lon:-70
    },


    // Curacao
    "PJ2": {
        country:"Curacao",
        lat:12.1,
        lon:-68.9
    },


    // Bonaire
    "PJ4": {
        country:"Bonaire",
        lat:12.2,
        lon:-68.3
    },


    // Cayman Islands
    "ZF": {
        country:"Cayman Islands",
        lat:19.3,
        lon:-81.2
    },


    // Bahamas
    "C6": {
        country:"Bahamas",
        lat:25,
        lon:-77.4
    },


    // Barbados
    "8P": {
        country:"Barbados",
        lat:13.1,
        lon:-59.6
    },


    // Trinidad
    "9Y": {
        country:"Trinidad and Tobago",
        lat:10.7,
        lon:-61.5
    },


    // Dominican
    "HI": {
        country:"Dominican Republic",
        lat:18.7,
        lon:-70.1
    },



    // =========================
    // PACIFIC ISLANDS
    // =========================


    // French Polynesia
    "FO": {
        country:"French Polynesia",
        lat:-17.6,
        lon:-149.5
    },


    // New Caledonia
    "FK": {
        country:"New Caledonia",
        lat:-21.5,
        lon:165.5
    },


    // Vanuatu
    "YJ": {
        country:"Vanuatu",
        lat:-16.3,
        lon:167.2
    },


    // Solomon Islands
    "H4": {
        country:"Solomon Islands",
        lat:-9.6,
        lon:160
    },


    // Kiribati
    "T30": {
        country:"Kiribati",
        lat:1.3,
        lon:173
    },


    // Tuvalu
    "T2": {
        country:"Tuvalu",
        lat:-8.5,
        lon:179.2
    },



    // =========================
    // POLAR / SPECIAL
    // =========================


    // Antarctica
    "CE9": {
        country:"Antarctica",
        lat:-90,
        lon:0
    },


    // Falkland
    "VP8": {
        country:"Falkland Islands",
        lat:-51.8,
        lon:-59.5
    },


    // South Georgia
    "VP8": {
        country:"South Georgia",
        lat:-54,
        lon:-36
    },


    // Tristan da Cunha
    "ZD9": {
        country:"Tristan da Cunha",
        lat:-37.1,
        lon:-12.3
    },


    // Saint Helena
    "ZD7": {
        country:"Saint Helena",
        lat:-15.9,
        lon:-5.7
    },


});




// ======================================================
// FINAL CALLSIGN PARSER OPTIMIZATION
// ======================================================


function getCallsignLocation(call) {


    call = cleanCallsign(call);



    // Trier par longueur
    // Exemple:
    // EA8ABC -> EA8 avant EA

    const prefixes = Object.keys(SPECIAL_PREFIXES)
        .sort((a,b)=>b.length-a.length);



    for(const prefix of prefixes){


        if(call.startsWith(prefix)){


            return SPECIAL_PREFIXES[prefix];


        }


    }



    return findDXCC(call);


}




// ======================================================
// DISTANCE CALCULATOR
// ======================================================


function calculateDistance(lat1,lon1,lat2,lon2){


    const R = 6371;


    const dLat =
        (lat2-lat1)*Math.PI/180;


    const dLon =
        (lon2-lon1)*Math.PI/180;



    const a =
        Math.sin(dLat/2)**2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2)**2;



    return Math.round(
        R * 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        )
    );

}




// ======================================================
// AZIMUTH CALCULATOR
// ======================================================


function calculateAzimuth(lat1,lon1,lat2,lon2){


    const φ1 = lat1*Math.PI/180;
    const φ2 = lat2*Math.PI/180;

    const Δλ =
        (lon2-lon1)*Math.PI/180;



    const y =
        Math.sin(Δλ)*Math.cos(φ2);


    const x =
        Math.cos(φ1)*Math.sin(φ2)
        -
        Math.sin(φ1)*
        Math.cos(φ2)*
        Math.cos(Δλ);



    let bearing =
        Math.atan2(y,x)
        *
        180/Math.PI;



    return Math.round(
        (bearing+360)%360
    );


}
