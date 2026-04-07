// ==========================================
// 🚇 MTA 地铁线路基础配置
// ==========================================
const LINE_MAP = {
    "A": { feed: "ace", color: "#0039A6" }, "C": { feed: "ace", color: "#0039A6" }, "E": { feed: "ace", color: "#0039A6" },
    "B": { feed: "bdfm", color: "#FF6319" }, "D": { feed: "bdfm", color: "#FF6319" }, "F": { feed: "bdfm", color: "#FF6319" }, "M": { feed: "bdfm", color: "#FF6319" },
    "N": { feed: "nqrw", color: "#FCCC0A", textColor: "black" }, "Q": { feed: "nqrw", color: "#FCCC0A", textColor: "black" }, "R": { feed: "nqrw", color: "#FCCC0A", textColor: "black" }, "W": { feed: "nqrw", color: "#FCCC0A", textColor: "black" },
    "1": { feed: "1234567", color: "#EE352E" }, "2": { feed: "1234567", color: "#EE352E" }, "3": { feed: "1234567", color: "#EE352E" }, 
    "4": { feed: "1234567", color: "#00933C" }, "5": { feed: "1234567", color: "#00933C" }, "6": { feed: "1234567", color: "#00933C" }, 
    "7": { feed: "1234567", color: "#B933AD" }, "L": { feed: "l", color: "#A7A9AC" }, "G": { feed: "g", color: "#6CBE45" }, "J": { feed: "jz", color: "#996633" }, "Z": { feed: "jz", color: "#996633" }
};

// ==========================================
// 🚌 MTA 巴士地区分类大厅数据
// ==========================================
const BUS_BOROUGHS = {
    "Brooklyn": ["B1", "B3", "B4", "B6", "B8", "B9", "B11", "B15", "B35", "B41", "B44", "B44-SBS", "B46", "B46-SBS", "B62", "B63", "B67", "B68", "B70", "B82", "B82-SBS"],
    "Manhattan": ["M1", "M2", "M3", "M4", "M5", "M7", "M8", "M11", "M14A-SBS", "M14D-SBS", "M15", "M15-SBS", "M23-SBS", "M34-SBS", "M42", "M60-SBS", "M101"],
    "Queens": ["Q4", "Q5", "Q25", "Q32", "Q43", "Q44-SBS", "Q46", "Q53-SBS", "Q58", "Q59", "Q60", "Q64", "Q88"],
    "Bronx": ["BX1", "BX2", "BX6", "BX6-SBS", "BX9", "BX12", "BX12-SBS", "BX15", "BX19", "BX41-SBS"],
    "Staten Island": ["S40", "S44", "S46", "S53", "S59", "S74", "S79-SBS", "S89", "S93", "SIM1", "SIM1C"]
};
const ALL_BUS_ROUTES = [].concat(...Object.values(BUS_BOROUGHS));

// ==========================================
// 📍 MTA 地铁物理字典 (全网完整版)
// ==========================================
const STATION_DICT = {
    "1": [
        { id: "101", name: "Van Cortlandt Park-242 St" }, { id: "103", name: "238 St" }, { id: "104", name: "231 St" }, { id: "106", name: "Marble Hill-225 St" },
        { id: "107", name: "215 St" }, { id: "108", name: "207 St" }, { id: "109", name: "Dyckman St" }, { id: "110", name: "191 St" }, { id: "111", name: "181 St" },
        { id: "112", name: "168 St-Washington Hts" }, { id: "113", name: "157 St" }, { id: "114", name: "145 St" }, { id: "115", name: "137 St-City College" },
        { id: "116", name: "125 St" }, { id: "117", name: "116 St-Columbia Univ" }, { id: "118", name: "Cathedral Pkwy (110 St)" }, { id: "119", name: "103 St" },
        { id: "120", name: "96 St" }, { id: "121", name: "86 St" }, { id: "122", name: "79 St" }, { id: "123", name: "72 St" }, { id: "124", name: "66 St-Lincoln Ctr" },
        { id: "125", name: "59 St-Columbus Circle" }, { id: "126", name: "50 St" }, { id: "127", name: "Times Sq-42 St" }, { id: "128", name: "34 St-Penn Station" },
        { id: "129", name: "28 St" }, { id: "130", name: "23 St" }, { id: "131", name: "18 St" }, { id: "132", name: "14 St" }, { id: "133", name: "Christopher St-Sheridan Sq" },
        { id: "134", name: "Houston St" }, { id: "135", name: "Canal St" }, { id: "136", name: "Franklin St" }, { id: "137", name: "Chambers St" },
        { id: "138", name: "WTC Cortlandt" }, { id: "139", name: "Rector St" }, { id: "142", name: "South Ferry" }
    ],
    "2": [
        { id: "201", name: "Wakefield-241 St" }, { id: "204", name: "Nereid Av" }, { id: "205", name: "233 St" }, { id: "206", name: "225 St" }, { id: "207", name: "219 St" },
        { id: "208", name: "Gun Hill Rd" }, { id: "209", name: "Burke Av" }, { id: "210", name: "Allerton Av" }, { id: "211", name: "Pelham Pkwy" }, { id: "212", name: "Bronx Park East" },
        { id: "213", name: "E 180 St" }, { id: "214", name: "West Farms Sq-E Tremont Av" }, { id: "215", name: "174 St" }, { id: "216", name: "Freeman St" },
        { id: "217", name: "Simpson St" }, { id: "218", name: "Intervale Av" }, { id: "219", name: "Prospect Av" }, { id: "220", name: "Jackson Av" }, { id: "221", name: "3 Av-149 St" },
        { id: "222", name: "149 St-Grand Concourse" }, { id: "224", name: "135 St" }, { id: "225", name: "125 St" }, { id: "226", name: "116 St" }, { id: "227", name: "Central Park North (110 St)" },
        { id: "120", name: "96 St" }, { id: "123", name: "72 St" }, { id: "127", name: "Times Sq-42 St" }, { id: "128", name: "34 St-Penn Station" }, { id: "132", name: "14 St" },
        { id: "137", name: "Chambers St" }, { id: "228", name: "Park Pl" }, { id: "229", name: "Fulton St" }, { id: "230", name: "Wall St" }, { id: "231", name: "Clark St" },
        { id: "232", name: "Borough Hall" }, { id: "233", name: "Hoyt St" }, { id: "234", name: "Nevins St" }, { id: "235", name: "Atlantic Av-Barclays Ctr" },
        { id: "236", name: "Bergen St" }, { id: "237", name: "Grand Army Plaza" }, { id: "238", name: "Eastern Pkwy-Brooklyn Museum" }, { id: "239", name: "Franklin Av-Medgar Evers College" },
        { id: "241", name: "President St" }, { id: "242", name: "Sterling St" }, { id: "243", name: "Winthrop St" }, { id: "244", name: "Church Av" },
        { id: "245", name: "Beverly Rd" }, { id: "246", name: "Newkirk Av" }, { id: "247", name: "Brooklyn College-Flatbush Av" }
    ],
    "4": [
        { id: "401", name: "Woodlawn" }, { id: "402", name: "Mosholu Pkwy" }, { id: "405", name: "Bedford Park Blvd-Lehman College" }, { id: "406", name: "Kingsbridge Rd" },
        { id: "407", name: "Fordham Rd" }, { id: "408", name: "183 St" }, { id: "409", name: "Burnside Av" }, { id: "410", name: "176 St" }, { id: "411", name: "Mt Eden Av" },
        { id: "412", name: "170 St" }, { id: "413", name: "167 St" }, { id: "414", name: "161 St-Yankee Stadium" }, { id: "415", name: "149 St-Grand Concourse" },
        { id: "416", name: "138 St-Grand Concourse" }, { id: "418", name: "86 St" }, { id: "419", name: "59 St" }, { id: "420", name: "Grand Central-42 St" },
        { id: "423", name: "14 St-Union Sq" }, { id: "428", name: "Brooklyn Bridge-City Hall" }, { id: "429", name: "Fulton St" }, { id: "430", name: "Wall St" },
        { id: "431", name: "Bowling Green" }, { id: "432", name: "Borough Hall" }, { id: "234", name: "Nevins St" }, { id: "235", name: "Atlantic Av-Barclays Ctr" },
        { id: "239", name: "Franklin Av-Medgar Evers College" }, { id: "248", name: "Crown Hts-Utica Av" }
    ],
    "7": [
        { id: "701", name: "Flushing-Main St" }, { id: "702", name: "Mets-Willets Point" }, { id: "705", name: "111 St" }, { id: "706", name: "103 St-Corona Plaza" },
        { id: "707", name: "Junction Blvd" }, { id: "708", name: "90 St-Elmhurst Av" }, { id: "709", name: "82 St-Jackson Hts" }, { id: "710", name: "74 St-Broadway" },
        { id: "711", name: "69 St" }, { id: "712", name: "61 St-Woodside" }, { id: "713", name: "52 St" }, { id: "714", name: "46 St-Bliss St" }, { id: "715", name: "40 St-Lowery St" },
        { id: "716", name: "33 St-Rawson St" }, { id: "718", name: "Queensboro Plaza" }, { id: "719", name: "Court Sq" }, { id: "720", name: "Hunters Point Av" },
        { id: "721", name: "Vernon Blvd-Jackson Av" }, { id: "723", name: "Grand Central-42 St" }, { id: "724", name: "5 Av" }, { id: "725", name: "Times Sq-42 St" },
        { id: "726", name: "34 St-Hudson Yards" }
    ],
    "A": [
        { id: "A02", name: "Inwood-207 St" }, { id: "A03", name: "Dyckman St" }, { id: "A05", name: "190 St" }, { id: "A06", name: "181 St" }, { id: "A07", name: "175 St" },
        { id: "A09", name: "168 St" }, { id: "A12", name: "145 St" }, { id: "A15", name: "125 St" }, { id: "A24", name: "59 St-Columbus Circle" }, { id: "A27", name: "42 St-Port Authority" },
        { id: "A28", name: "34 St-Penn Station" }, { id: "A30", name: "14 St" }, { id: "A31", name: "W 4 St-Wash Sq" }, { id: "A32", name: "Spring St" },
        { id: "A33", name: "Canal St" }, { id: "A34", name: "Chambers St" }, { id: "A36", name: "Fulton St" }, { id: "A40", name: "High St" }, { id: "A41", name: "Jay St-MetroTech" },
        { id: "A42", name: "Hoyt-Schermerhorn Sts" }, { id: "A46", name: "Nostrand Av" }, { id: "A48", name: "Utica Av" }, { id: "A51", name: "Broadway Junction" },
        { id: "A55", name: "Euclid Av" }, { id: "A61", name: "Ozone Park-Lefferts Blvd" }, { id: "A65", name: "JFK Airport-Howard Beach" }, { id: "A68", name: "Far Rockaway-Mott Av" }
    ],
    "E": [
        { id: "G05", name: "Jamaica Center-Parsons/Archer" }, { id: "G06", name: "Sutphin Blvd-Archer Av-JFK Airport" }, { id: "G07", name: "Jamaica Van Wyck" },
        { id: "F06", name: "Kew Gardens-Union Tpke" }, { id: "F07", name: "71 Av-Forest Hills" }, { id: "G14", name: "Jackson Hts-Roosevelt Av" },
        { id: "G21", name: "Queens Plaza" }, { id: "F09", name: "Court Sq-23 St" }, { id: "F11", name: "Lexington Av/53 St" }, { id: "F12", name: "5 Av/53 St" },
        { id: "D14", name: "7 Av" }, { id: "A24", name: "50 St" }, { id: "A27", name: "42 St-Port Authority" }, { id: "A28", name: "34 St-Penn Station" },
        { id: "A30", name: "14 St" }, { id: "A31", name: "W 4 St-Wash Sq" }, { id: "A32", name: "Spring St" }, { id: "A33", name: "Canal St" }, { id: "A34", name: "WTC-Chambers St" }
    ],
    "F": [
        { id: "F01", name: "Jamaica-179 St" }, { id: "F02", name: "169 St" }, { id: "F03", name: "Parsons Blvd" }, { id: "F04", name: "Sutphin Blvd" },
        { id: "F05", name: "Briarwood" }, { id: "F06", name: "Kew Gardens-Union Tpke" }, { id: "F07", name: "71 Av-Forest Hills" }, { id: "G14", name: "Jackson Hts-Roosevelt Av" },
        { id: "F09", name: "21 St-Queensbridge" }, { id: "F10", name: "Roosevelt Island" }, { id: "F11", name: "Lexington Av/63 St" }, { id: "B12", name: "57 St" },
        { id: "D15", name: "47-50 Sts-Rockefeller Ctr" }, { id: "D16", name: "42 St-Bryant Pk" }, { id: "D17", name: "34 St-Herald Sq" }, { id: "D18", name: "23 St" },
        { id: "D19", name: "14 St" }, { id: "D20", name: "W 4 St-Wash Sq" }, { id: "D21", name: "Broadway-Lafayette St" }, { id: "F14", name: "2 Av" },
        { id: "F15", name: "Delancey St-Essex St" }, { id: "F16", name: "East Broadway" }, { id: "F18", name: "York St" }, { id: "A41", name: "Jay St-MetroTech" },
        { id: "F20", name: "Bergen St" }, { id: "F21", name: "Carroll St" }, { id: "F22", name: "Smith-9 Sts" }, { id: "F23", name: "4 Av-9 St" }, { id: "F24", name: "7 Av" },
        { id: "F25", name: "15 St-Prospect Park" }, { id: "F26", name: "Fort Hamilton Pkwy" }, { id: "F27", name: "Church Av" }, { id: "D43", name: "Coney Island-Stillwell Av" }
    ],
    "N": [
        { id: "N02", name: "Astoria-Ditmars Blvd" }, { id: "N03", name: "Astoria Blvd" }, { id: "N04", name: "30 Av" }, { id: "N05", name: "Broadway" },
        { id: "N06", name: "36 Av" }, { id: "N07", name: "39 Av" }, { id: "N08", name: "Queensboro Plaza" }, { id: "R11", name: "Lexington Av/59 St" },
        { id: "R13", name: "5 Av/59 St" }, { id: "R14", name: "57 St-7 Av" }, { id: "R16", name: "Times Sq-42 St" }, { id: "R17", name: "34 St-Herald Sq" },
        { id: "R20", name: "14 St-Union Sq" }, { id: "R23", name: "Canal St" }, { id: "R31", name: "Atlantic Av-Barclays Ctr" }, { id: "R36", name: "36 St" },
        { id: "R41", name: "59 St" }, { id: "N51", name: "8 Av" }, { id: "N52", name: "Fort Hamilton Pkwy" }, { id: "N53", name: "New Utrecht Av" },
        { id: "N54", name: "18 Av" }, { id: "N55", name: "20 Av" }, { id: "N56", name: "Bay Pkwy" }, { id: "N57", name: "Kings Hwy" }, { id: "N58", name: "Avenue U" },
        { id: "N59", name: "86 St" }, { id: "D43", name: "Coney Island-Stillwell Av" }
    ],
    "R": [
        { id: "G08", name: "Forest Hills-71 Av" }, { id: "G09", name: "67 Av" }, { id: "G10", name: "63 Dr-Rego Park" }, { id: "G11", name: "Woodhaven Blvd" },
        { id: "G12", name: "Grand Av-Newtown" }, { id: "G13", name: "Elmhurst Av" }, { id: "G14", name: "Jackson Hts-Roosevelt Av" }, { id: "G15", name: "65 St" },
        { id: "G16", name: "Northern Blvd" }, { id: "G18", name: "46 St" }, { id: "G19", name: "Steinway St" }, { id: "G20", name: "36 St" }, { id: "G21", name: "Queens Plaza" },
        { id: "R11", name: "Lexington Av/59 St" }, { id: "R13", name: "5 Av/59 St" }, { id: "R14", name: "57 St-7 Av" }, { id: "R15", name: "49 St" },
        { id: "R16", name: "Times Sq-42 St" }, { id: "R17", name: "34 St-Herald Sq" }, { id: "R18", name: "28 St" }, { id: "R19", name: "23 St" },
        { id: "R20", name: "14 St-Union Sq" }, { id: "R21", name: "8 St-NYU" }, { id: "R22", name: "Prince St" }, { id: "R23", name: "Canal St" },
        { id: "R24", name: "City Hall" }, { id: "R25", name: "Cortlandt St" }, { id: "R26", name: "Rector St" }, { id: "R27", name: "Whitehall St-South Ferry" },
        { id: "R28", name: "Court St" }, { id: "R29", name: "Jay St-MetroTech" }, { id: "B08", name: "DeKalb Av" }, { id: "R31", name: "Atlantic Av-Barclays Ctr" },
        { id: "R32", name: "Union St" }, { id: "R33", name: "9 St" }, { id: "R34", name: "Prospect Av" }, { id: "R35", name: "25 St" }, { id: "R36", name: "36 St" },
        { id: "R39", name: "45 St" }, { id: "R40", name: "53 St" }, { id: "R41", name: "59 St" }, { id: "R42", name: "Bay Ridge Av" }, { id: "R43", name: "77 St" },
        { id: "R44", name: "86 St" }, { id: "R45", name: "Bay Ridge-95 St" }
    ],
    "L": [
        { id: "L01", name: "8 Av" }, { id: "L02", name: "6 Av" }, { id: "L03", name: "14 St-Union Sq" }, { id: "L05", name: "3 Av" }, { id: "L06", name: "1 Av" },
        { id: "L08", name: "Bedford Av" }, { id: "L10", name: "Lorimer St" }, { id: "L11", name: "Graham Av" }, { id: "L12", name: "Grand St" },
        { id: "L13", name: "Montrose Av" }, { id: "L14", name: "Morgan Av" }, { id: "L15", name: "Jefferson St" }, { id: "L16", name: "DeKalb Av" },
        { id: "L17", name: "Myrtle-Wyckoff Avs" }, { id: "L19", name: "Halsey St" }, { id: "L20", name: "Wilson Av" }, { id: "L21", name: "Bushwick Av-Aberdeen St" },
        { id: "L22", name: "Broadway Junction" }, { id: "L24", name: "Atlantic Av" }, { id: "L25", name: "Sutter Av" }, { id: "L26", name: "Livonia Av" },
        { id: "L27", name: "New Lots Av" }, { id: "L28", name: "E 105 St" }, { id: "L29", name: "Canarsie-Rockaway Pkwy" }
    ],
    "G": [
        { id: "G22", name: "Court Sq" }, { id: "G24", name: "21 St" }, { id: "G26", name: "Greenpoint Av" }, { id: "G28", name: "Nassau Av" },
        { id: "G29", name: "Metropolitan Av" }, { id: "G30", name: "Broadway" }, { id: "G31", name: "Flushing Av" }, { id: "G32", name: "Myrtle-Willoughby Avs" },
        { id: "G33", name: "Bedford-Nostrand Avs" }, { id: "G34", name: "Classon Av" }, { id: "G35", name: "Clinton-Washington Avs" }, { id: "G36", name: "Fulton St" },
        { id: "A42", name: "Hoyt-Schermerhorn Sts" }, { id: "F20", name: "Bergen St" }, { id: "F21", name: "Carroll St" }, { id: "F22", name: "Smith-9 Sts" },
        { id: "F23", name: "4 Av-9 St" }, { id: "F24", name: "7 Av" }, { id: "F25", name: "15 St-Prospect Park" }, { id: "F26", name: "Fort Hamilton Pkwy" }, { id: "F27", name: "Church Av" }
    ],
    "J": [
        { id: "J12", name: "Jamaica Center-Parsons/Archer" }, { id: "J13", name: "Sutphin Blvd-Archer Av-JFK Airport" }, { id: "J14", name: "121 St" },
        { id: "J15", name: "111 St" }, { id: "J16", name: "104 St" }, { id: "J17", name: "Woodhaven Blvd" }, { id: "J19", name: "85 St-Forest Pkwy" },
        { id: "J20", name: "75 St-Elderts Ln" }, { id: "J21", name: "Cypress Hills" }, { id: "J22", name: "Crescent St" }, { id: "J23", name: "Norwood Av" },
        { id: "J24", name: "Cleveland St" }, { id: "J27", name: "Broadway Junction" }, { id: "J28", name: "Chauncey St" }, { id: "J29", name: "Halsey St" },
        { id: "J30", name: "Gates Av" }, { id: "J31", name: "Kosciuszko St" }, { id: "J32", name: "Myrtle Av" }, { id: "M11", name: "Flushing Av" },
        { id: "M12", name: "Lorimer St" }, { id: "M13", name: "Hewes St" }, { id: "M14", name: "Marcy Av" }, { id: "M16", name: "Delancey St-Essex St" },
        { id: "M18", name: "Bowery" }, { id: "M19", name: "Canal St" }, { id: "M20", name: "Chambers St" }, { id: "M21", name: "Fulton St" }, { id: "M23", name: "Broad St" }
    ]
};

// ----------------------------------------------------
// 🔄 智能共享字典 (同一物理轨道共享 Stop ID)
// ----------------------------------------------------
STATION_DICT["3"] = STATION_DICT["2"]; 
STATION_DICT["5"] = STATION_DICT["4"]; 
STATION_DICT["6"] = STATION_DICT["4"];
STATION_DICT["C"] = STATION_DICT["A"]; 
STATION_DICT["B"] = STATION_DICT["F"]; 
STATION_DICT["D"] = STATION_DICT["F"]; 
STATION_DICT["M"] = STATION_DICT["F"];
STATION_DICT["Q"] = STATION_DICT["N"]; 
STATION_DICT["W"] = STATION_DICT["N"]; 
STATION_DICT["Z"] = STATION_DICT["J"];
