////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: SETUP                                                  //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External def: Last message timeout.
let lmTimeout = null;

// Class.
class ExternalSetup {

	// Status printer.
	static printStatus(newStatus) {

		// Clear last timeout.
		if (lmTimeout) clearTimeout(lmTimeout);

		// Quit if incorrect menu.
		if (menuName != "setup") return;

		// Clear previous.
		BufferInterface.fillText(22, 9, consoleSize.columns, 1, " ", 25);

		// Print new.
		BufferInterface.writeString(newStatus, 22, consoleSize.columns-newStatus.length-1, 25);

		// Set clear timeout.
		lmTimeout = setTimeout(() => {
			BufferInterface.fillText(22, 9, consoleSize.columns, 1, " ", 25);
		}, 3000);

	}

	// Track skip.
	static nextTrack() {

		// Play next track.
		Music.nextTrack();

	}

}