////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: QUOTES                                                 //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External Def: Timer.
let quotesTimer = 14;
const quotesLength = 15;

// Class.
class ExternalQuotes {

    // Periodic update function.
    static periodicUpdate() {

        // Manage Timer.
        if (quotesTimer >= quotesLength) {

            // Timer done, perform update.
            quotesTimer = 0;
            BufferInterface.fillRect(20, 1, consoleSize.columns-2, 1, 25);

            // Get & display random quote.
            getJSON(`https://api.quotable.io/random?maxLength=${(consoleSize.columns-4)*13}`, {}).then(data => {

                // Quit if incorrect menu.
                if (menuName != "quotes") return;

                // Clear previous quote & author.
                BufferInterface.fillText(3, 2, consoleSize.columns-4, 13, " ", 20);
                BufferInterface.fillText(17, 2, consoleSize.columns-4, 1, " ", 20);

                // Write new quote.
                let quoteBlock = new DisplayBlock(formatTextWrap(data.content, consoleSize.columns-4), 3, 2, 20, 25);
                quoteBlock.write();

                // Write new author.
                let authorItem = new DisplayItem(data.author, 17, consoleSize.columns-data.author.length-2, -1, -1, 20, 25);
                authorItem.write();

            });

        } else {

            // Timer continues, move forward.
            quotesTimer++;
            BufferInterface.fillRect(20, 1, Math.round((consoleSize.columns-2)*(quotesTimer/quotesLength)), 1, 12);

        }

    }

}