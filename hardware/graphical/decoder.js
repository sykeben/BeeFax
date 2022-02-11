////////////////////////////////////////////////////////////////////////////////
// BEEFAX // GRAPHICS DECODER                                                 //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External: Decoder information.
const consoleSize = {rows: 24, columns: 45};
const cellSize = {width: (displaySize.width / consoleSize.columns), height: (displaySize.height / consoleSize.rows)};
const defaultDisplayMode = "normal";
var displayMode = defaultDisplayMode;
const defaultErrorMessage = "[ Unknown Error ]";
var errorMessage = defaultErrorMessage;

// External: Colors.
const colors = new Array(
	"white", "black", "red", "green", "gold", "blue", "magenta", "cyan",                     // 00-07: Light colors.
	"lightgray", "gray", "darkred", "darkgreen", "brown", "darkblue", "violet", "steelblue", // 08-15: Dark colors.
	"white", "lightgray", "salmon", "lightgreen", "yellow", "lightblue", "pink", "skyblue",  // 16-23: Highlights.
	"#000000", "#202020", "#404040", "#606060", "#808080", "#A0A0A0", "#C0C0C0", "#F0F0F0"   // 24-31: Grays.
);

// External: Buffers.
var textBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var fColBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var bColBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var fBlkBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var bBlkBuffer = Array.from({length: consoleSize.rows}, () => Array.from({length: consoleSize.columns}, () => false));
var selection = {enabled: false, row: -1, column: -1, width: 0, height: 0, lCol: colors[12], hCol: colors[2]};

// Class.
class Decoder {

	// Initialization child function.
	static init() {

		// Reset buffers.
		BufferInterface.resetAll();

	}

	// Decoder parent drawing routine.
	static draw(displaySize, canvas, context, bufferNumber) {
		
		// Update according to decoder mode.
		if (displayMode == "blank") this.drawBlank(displaySize, canvas, context, bufferNumber);
		else if (displayMode == "normal") this.drawNormal(displaySize, canvas, context, bufferNumber);
		else if (displayMode == "test") this.drawTest(displaySize, canvas, context, bufferNumber);
		else this.drawError(displaySize, canvas, context, bufferNumber);

		// Return.
		return;

	}

	// Decoder child drawing routine: Blank.
	static drawBlank(displaySize, canvas, context, bufferNumber) {
		
		// Setup & draw: Black.
		context.fillStyle = "#000000";
		context.fillRect(0, 0, displaySize.width, displaySize.height);

	}

	// Decoder child drawing routine: Normal.
	static drawNormal(displaySize, canvas, context, bufferNumber) {

		// Setup: Text.
		context.font = "16px customFont";
		context.textBaseline = "middle";
		context.textAlign = "center";

		// Draw: Text, FCol, & BCol.
		for (let row = 0; row < consoleSize.rows; row++) {
			for (let column = 0; column < consoleSize.columns; column++) {

				// Draw: BCol.
				if (!(bBlkBuffer[row][column] && bufferNumber==0)) {

					// Set BCol.
					context.fillStyle = colors[bColBuffer[row][column]];

					// Write BCol.
					context.fillRect((column * cellSize.width)-0.5, (row * cellSize.height), cellSize.width+1, cellSize.height);

				}

				// Draw: Text/Icon & FCol.
				if (!(fBlkBuffer[row][column] && bufferNumber==0)) {

					// Set FCol.
					context.fillStyle = colors[fColBuffer[row][column]];

					// Write Text/Icon & FCol.
					let bufData = textBuffer[row][column];
					if ((bufData.length >= 3) && (bufData.substring(0, 3) == ".i:")) {

						// Split package.
						// Format: .i:[IconSet]:[IconCharacter]
						let pack = bufData.split(":");

						// Switch to Icon.
						let oldFont = context.font;
						context.font = `12px customIcon${pack[1]}`;

						// Icon & FCol.
						context.fillText(pack[2], (column * cellSize.width) + (cellSize.width / 2), (row * cellSize.height) + (cellSize.height / 2));

						// Switch back.
						context.font = oldFont;

					} else {

						// Text & FCol.
						context.fillText(bufData, (column * cellSize.width) + (cellSize.width / 2), (row * cellSize.height) + (cellSize.height / 2));

					}

				}

			}
		}

		// Draw: Selection.
		if (selection.enabled) {
			context.strokeStyle = (bufferNumber==0 ? selection.hCol : selection.lCol);
			context.lineWidth = 2;
			context.lineJoin = "bevel";
			context.strokeRect(
				(selection.column * cellSize.width) - 0.5,
				(selection.row * cellSize.height) - 0.5,
				selection.width * cellSize.width,
				selection.height * cellSize.height,
			);
		}

	}

	// Decoder child drawing routine: Test.
	static drawTest(displaySize, canvas, context, bufferNumber) {

		// Draw: Underlay.
		this.drawNormal(displaySize, canvas, context, bufferNumber);

		// Setup: Lines.
		context.strokeStyle = "#ff0000";
		context.lineWidth = 1;

		// Draw: Horizontal lines.
		for (let y = 0; y < displaySize.height; y += (displaySize.height / consoleSize.rows)) {
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(displaySize.width, y);
			context.stroke();
		}

		// Draw: Vertical lines.
		for (let x = 0; x < displaySize.width; x += (displaySize.width / consoleSize.columns)) {
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, displaySize.height);
			context.stroke();
		}

	}

	// Decoder child drawing routine: Error.
	static drawError(displaySize, canvas, context, bufferNumber) {

		// Setup & draw: Background.
		context.fillStyle = "#FF2A2A";
		context.fillRect(0, 0, displaySize.width, displaySize.height);

		// Setup & draw: Title.
		context.fillStyle = "#FF4A4A";
		context.font = "32px customFont"
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText("An error occurred.", displaySize.width/2, displaySize.height/2);

		// Setup & draw: Subtitle.
		context.fillStyle = "#FF4A4A";
		context.font = "16px customFont"
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText(errorMessage, displaySize.width/2, (displaySize.height/2)+32);

		// Setup & draw: Reset message.
		context.fillStyle = "#FF4A4A";
		context.font = "16px customFont"
		context.textBaseline = "bottom";
		context.textAlign = "left";
		context.fillText("Press select to reset.", 10, displaySize.height-10);

	}

}