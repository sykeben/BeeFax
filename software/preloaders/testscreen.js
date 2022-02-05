////////////////////////////////////////////////////////////////////////////////
// BEEFAX // TEST SCREEN                                                      //
////////////////////////////////////////////////////////////////////////////////
// (C) 2021 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Class.
class TestScreen {

	// Initialization child function.
	static init() {

		// Write test screen (after delay).
		setTimeout(this.write, 125);

	}

	// Test screen writer.
	static write() {

		// Title.
		BufferInterface.fillRect(0, 0, consoleSize.columns, 1, 5);
		BufferInterface.writeString(0, 1, "BEEFAX / Test Page", 0);

		// Possible colors.
		BufferInterface.fillRect(2, 1, 16, 1, 13);
		BufferInterface.writeString(2, 1, "Colors", 21)
		let color = 0;
		for (let row = 3; row <= 6; row++) {
			for (let column = 1; column <= 16; column+=2) {
				let formattedColor = (color < 10 ? " " : "") + color.toString();
				BufferInterface.writeString(row, column, formattedColor, ((color==1)||(color==24) ? 25 : 1), color);
				color++;
			}
		}

		// Blinking combos.
		BufferInterface.fillRect(8, 1, 16, 1, 13);
		BufferInterface.writeString(8, 1, "Blinking", 21);
		BufferInterface.fillRect(9, 1, 16, 1, 25, false);
		BufferInterface.writeString(9, 1, "Foreground", 30, -1, true);
		BufferInterface.fillRect(10, 1, 16, 1, 25, true);
		BufferInterface.writeString(10, 1, "Background", 30, -1, false);
		BufferInterface.fillRect(11, 1, 16, 1, 25, true);
		BufferInterface.writeString(11, 1, "Both", 30, -1, true);

		// Selection setup.
		BufferInterface.setSelection(true, 0, 0, 5, 1);

	}

	// Key interface.
	static checkKey(e) {

		// Fix event.
		e = e || window.event;

		// React.
		if (e.keyCode == '38') selection.row--;          // Up.
		else if (e.keyCode == '40') selection.row++;     // Down.
		else if (e.keyCode == '37') selection.column-=5; // Left.
		else if (e.keyCode == '39') selection.column+=5; // Right.

		// Redraw.
		const canvas = canvases[drawingBuffer];
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		Decoder.draw(displaySize, canvas, context, drawingBuffer);

	}

}

// External: (Following) Definitions.
document.onkeydown = TestScreen.checkKey;