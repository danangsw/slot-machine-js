/**
 * 
 * TODO:
 * 1. User: Deposit some money
 * 2. User: Determine numnber of lines to bet on
 * 3. User: Collect a bet amount
 * 4. User: Spin the slot machine
 * 5. System: Check if the user win
 * 6. System: Give the user their winning
 * 7. User: Play agan?
 * 
 */

import prompt from 'prompt-sync';

const input = prompt();
 
const ROWS= 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
    "E": 10
};

const SYMBOLS_VALUE = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1
};

/**
 * 1. User: Deposit some money
 * @returns number of deposit amount
 */
const deposit  = () => {
    while(true) {
        const inputDepositAmount = input("Enter a deposit amount (>= $100): ");
        const numberDepositAmount = parseFloat(inputDepositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount < 100) {
            console.log('Invalid deposit amount, try again.');
        }
        else {
            return numberDepositAmount;
        }
    }
}

/**
 * 2. User: Determine numnber of lines to bet on
 * @returns number of lines to bet on
 */
const getNumberOfLines = () => { 
    while(true) {
        const inputLines = input(`Enter the number of line to bet on (1-${ROWS}): `);
        const numberLines = parseFloat(inputLines);

        if(isNaN(numberLines) || numberLines <= 0 || numberLines > ROWS) {
            console.log('Invalid input lines, try again.');
        }
        else {
            return numberLines;
        }
    }
}

/**
 *  * 3. User: Collect a bet amount
 * @param {nummber} balance amount to bet on
 * @param {number} lines number to bet on
 * @returns number bet amount 
 */
const getBet = (balance, lines) => {
    while (true) { 
        const maxBet = Math.floor(balance / lines);
        const inputBet = input(`Enter a bet amount (<= $${maxBet}): `);
        const numberBet = parseFloat(inputBet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > maxBet) {
            console.log('Invalid a bet amount, try again.');
        }
        else {
            return numberBet;
        }
    }
}

/**
 * 4. User: Spin the slot machine
 * @returns 
 */
const spin = () => { 
    const symbols = [];

    for (const [key, value] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < value; i++) {
            symbols.push(key);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIdx = Math.floor(Math.random() * reelSymbols.length); 
            const reel = reelSymbols[randomIdx];
            reels[i].push(reel);
            reelSymbols.slice(randomIdx, 1);
        }
    }

    return reels;
}

/**
 * Transporse reels list
 * @param {*} reels 
 * @returns transporsed list
 */
const transpose = (reels) => { 
    const transposeReels = [];
    for (let i = 0; i < ROWS; i++) {
        transposeReels.push([]);
        for (let j = 0; j < COLS; j++) {
            transposeReels[i].push(reels[j][i]);
        }
    }

    return transposeReels;
}

const printReels = (reels) => { 
    for (const row of reels) {
        const rowString = row.join(' | ');
        console.log(rowString);
    }
}

const getWinning = (reels, bet, lines) => { 
    let winning = 0;

    for (let i = 0; i < ROWS; i++) {
        const row = [...reels[i]];
        const won = row.every((val) => val === row[0]);

        if (won && (lines > 0)) { 
            winning += SYMBOLS_VALUE[row[0]] * bet;
            lines--;
        }
    }

    return winning;
}

/**
 * Play the game
 */
const game = () => { 
    let balanceAmount = deposit();
    
    while (true) { 
        let betLines = getNumberOfLines();
        let betAmount = getBet(balanceAmount, betLines);
        balanceAmount -= betLines * betAmount;

        let won = 0;
        let spinner = 1;
        while (won == 0 && balanceAmount >= 0) { 
            console.log(`${spinner++}. Spinning...`);
            let reels = spin();
            let transposeReels = transpose(reels);
            printReels(transposeReels);
            won = getWinning(transposeReels, betAmount, betLines);
            balanceAmount += won;
            console.log(`You Won! $${won}`);
            console.log(`Your balance now: $${balanceAmount}`);

            balanceAmount--;
        }

        if (balanceAmount <= 0) { 
            console.log('You ran out of money!');
            break;
        }

        let playAgain = input(`Do you want to play again (y/n): `);
        if (playAgain.toLowerCase() === 'n') break;
    }
};

// Code drive
game();