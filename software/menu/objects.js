////////////////////////////////////////////////////////////////////////////////
// BEEFAX // MENU OBJECTS                                                     //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Display item object.
class DisplayItem {

	// Constructor.
	constructor(title, row, column, width = -1, offset = -1, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		this.title = title;
		this.row = row;
		this.column = column;
		this.width = (title.length>=width ? title.length : (width>=0 ? width : 0));
		this.offset = (offset>=0 ? offset: 0);
		this.fCol = (fCol>=0 ? fCol : 0);
		this.bCol = (bCol>=0 ? bCol : 1);
		this.fBlk = fBlk;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "display";
	}

	// Write function.
	write() {

		// Draw background.
		BufferInterface.fillRect(this.row, this.column, this.width, 1, this.bCol, this.bBlk);

		// Draw foreground.
		BufferInterface.writeString(this.title, this.row, (this.column + this.offset), this.fCol, this.bCol, this.fBlk, this.bBlk);

	}
	
}

// Menu item object.
class MenuItem extends DisplayItem {
	
	// Constructor.
	constructor(title, row, column, callback, width = -1, offset = -1, fCol = -1, bCol = -1,  fBlk = null, bBlk = null) {
		super(title, row, column, width, offset, fCol, bCol, fBlk, bBlk);
		this.callback = callback;
	}

	// Type.
	getType() {
		return "item";
	}

	// Title.
	getTitle() {
		return this.title;
	}

	// Select function.
	select() {
		BufferInterface.setSelection(true, this.row, this.column, this.width, 1);
		Display.goDraw();
		if (currentUpdateOnNav) currentUpdate();
	}

	// Callback runner.
	doCallback() {
		this.callback();
	}

}

// Color block object.
class ColorBlock {

	// Constructor.
	constructor(colorData, row, column) {
		this.colorData = colorData;
		this.row = row;
		this.column = column;
	}

	// Type.
	getType() {
		return "color.block";
	}

	// Write function.
	write() {
		for (let cRow = 0; cRow < this.colorData.length; cRow++) {
			for (let cColumn = 0; cColumn < this.colorData[cRow].length; cColumn++) {
				if (this.colorData[cRow][cColumn] != -1) {
					BufferInterface.placeBCol(this.row + cRow, this.column + cColumn, this.colorData[cRow][cColumn]);
				}
			}
		}
	}

}

// Display block object.
class DisplayBlock {

	// Constructor.
	constructor(textData, row, column, fCol = -1, bCol = -1, fBlk = null, bBlk = null) {
		this.textData = textData;
		this.row = row;
		this.column = column;
		this.fCol = fCol;
		this.bCol = bCol;
		this.fBlk = fBlk;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "display.block";
	}

	// Write function.
	write() {
		for (let tRow = 0; tRow < this.textData.length; tRow++) {
			let item = new DisplayItem(this.textData[tRow], this.row+tRow, this.column, -1, -1, this.fCol, this.bCol, this.fBlk, this.bBlk);
			item.write();
		}
	}

}

// Colortangle object.
class Colortangle {
	
	// Constructor.
	constructor(row, column, width, height, bCol, bBlk = null) {
		this.row = row;
		this.column = column;
		this.width = width;
		this.height = height;
		this.bCol = bCol;
		this.bBlk = bBlk;
	}

	// Type.
	getType() {
		return "colortangle";
	}

	// Write function.
	write() {
		BufferInterface.fillRect(this.row, this.column, this.width, this.height, this.bCol, this.bBlk);
	}

}