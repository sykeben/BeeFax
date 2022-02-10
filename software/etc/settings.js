////////////////////////////////////////////////////////////////////////////////
// BEEFAX // ETC: SETTINGS                                                    //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Setting defaulter.
function defaultSetting(rawSetting, defaultOption = "") {
    if (rawSetting == null) {
        return defaultOption;
    } else {
        return rawSetting;
    }
}

// Default setting data.
const defaults = {

    // Location.
    location: {
        lat: 40.4444,
        lon: -86.9256
    }

};