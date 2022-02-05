////////////////////////////////////////////////////////////////////////////////
// BEEFAX // MENU DATA                                                        //
////////////////////////////////////////////////////////////////////////////////
// (C) 2021 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class MenuData {

	static menus = {

		"main": {
			title: {
				text: "Main Menu",
				fCol: 2, bCol: 18
			},
			periodicUpdate: ExternalMain.periodicUpdate,
			periodicInterval: 250,
			initialWait: 125,
			updateOnNav: true,
			data: [
				new DisplayItem("Sections", 2, 1, 21, 6, 1, 10),
				new MenuItem("[ About ]", 4, 2, () => { MenuEngine.goMenu("about", 0); }),
				new MenuItem("[ Heads Up ]", 6, 2, () => { MenuEngine.goMenu("headsup", 0); }),
				new MenuItem("[ News ]", 8, 2, () => { MenuEngine.goMenu("news", 0); }),
				new MenuItem("[ Setup ]", 22, 2, () => { MenuEngine.goMenu("setup", 1); }),
				new DisplayItem("Description", 2, 23, 21, 1, 1, 10),
			]
		},

		"about": {
			title: {
				text: "About BeeFax",
				fCol: 3, bCol: 19
			},
			periodicUpdate: function() {},
			periodicInterval: 99999999,
			initialWait: 125,
			updateOnNav: false,
			data: [
				new DisplayBlock([
					"BeeFax is another alternative to the now",
					"defunct CeeFax system, which was aired",
					"alongside the BBC up until 2012.",
					"",
					"BeeFax is contained completely within your",
					"web browser. All external data requests",
					"are handled locally, not through the cloud.",
					"",
					"BeeFax is optimized to be navigated with a",
					"basic-style remote. All",
					"that is needed to easily",
					"interact with BeeFax",
					"is 4 arrow keys and",
					"a select button.",
					"", "","",
					"BeeFax is copyright",
					"of Benjamin Sykes."
				], 2, 1),
				new ColorBlock([
					[-1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, 25, 25,  0,  0,  0,  0, 20, 20, 25, 25, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, 20, 20, 25, 25,  0,  0,  0,  0, 20, 20, 25, 25, 20, 20, -1, -1, -1, -1],
					[-1, -1, -1, -1, 20, 20, 25, 25, 20, 20, 25, 25, 20, 20,  1,  1, 20, 20, 25, 25, 25, 25],
					[25, 25, 25, 25, 20, 20, 25, 25, 20, 20, 25, 25, 20, 20, 25, 25, 20, 20, -1, -1, -1, -1],
					[-1, -1, -1, -1, 20, 20, 25, 25, 20, 20, 25, 25, 20, 20,  1,  1, 20, 20, 25, 25, 25, 25],
					[-1, -1, -1, -1, 20, 20, 25, 25,  0,  0,  0,  0, 20, 20, 25, 25, 20, 20, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, 25, 25,  0,  0,  0,  0, 20, 20, 25, 25, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
					[-1, -1, -1, -1, -1, -1, -1, -1,  0,  0,  0,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
				], 12, 21),
				new MenuItem("<< Back", 22, 1, () => { MenuEngine.goMenu("main", 0); })
			]
		},

		"headsup": {
			title: {
				text: "Heads Up",
				fCol: 23, bCol: 15
			},
			periodicUpdate: ExternalHeadsUp.periodicUpdate,
			periodicInterval: 2500,
			initialWait: 250,
			updateOnNav: false,
			data: [
				new DisplayItem("Forecast", 2, 1),
				new Colortangle(3, 1, consoleSize.columns-2, 10, 21),
				new DisplayItem("Right Now", 14, consoleSize.columns-21),
				new Colortangle(15, consoleSize.columns-21, 20, 6, 21),
				new MenuItem("<< Back", 22, 1, () => { MenuEngine.goMenu("main", 1); })
			]
		},

		"news": {
			title: {
				text: "News",
				fCol: 26, bCol: 30
			},
			periodicUpdate: ExternalNews.periodicUpdate,
			periodicInterval: 60000,
			initialWait: 125,
			updateOnNav: false,
			data: [
				new DisplayItem("Top Stories", 2, 1),
				new Colortangle(3, 1, consoleSize.columns-2, 18, 25),
				new MenuItem("<< Back", 22, 1, () => { newsScroll = 0; MenuEngine.goMenu("main", 2); }),
				new DisplayItem("(Data from wikipedia.org)", consoleSize.rows-2, consoleSize.columns-26, -1, -1, 25)
			]
		},

		"setup": {
			title: {
				text: "Setup",
				fCol: 22, bCol: 14
			},
			periodicUpdate: function() {},
			periodicInterval: 99999999,
			initialWait: 125,
			updateOnNav: false,
			data: [
				new MenuItem("Next Track", 2, 1, () => { ExternalSetup.requestSkip(); }),
				new DisplayItem("Skip to the next song.", 2, 15, -1, 0, 28),
				new MenuItem("<< Back", 22, 1, () => { MenuEngine.goMenu("main", 3); })
			]
		}

	};

}