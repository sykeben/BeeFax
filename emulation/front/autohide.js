// Source: https://github.com/defaude/autohide-cursor/blob/master/autohide-cursor.js
// Modified so it can be used outside of a normal module pov.

// Class.
class AutoHide {

	// Initialzation child function.
	static init() {
		this.autohideCursor();
		document.documentElement.style.cursor = 'none';
	}

	// Original function.
	static autohideCursor(delay = 1e3) {

		function showCursor() {
			document.documentElement.removeAttribute('style');
		}

		function hideCursor() {
			document.documentElement.style.cursor = 'none';
		}

		let timeout;

		document.documentElement.addEventListener('mousemove', function () {
			showCursor();
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(hideCursor, delay);
		}, false);

		setTimeout(hideCursor, delay);

	}

}