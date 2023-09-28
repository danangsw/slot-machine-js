#!/usr/bin/env node

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
 * reference CLI: https://youtu.be/_oHByo8tiEY?si=TxmuqT1T2PuFjSN-
 * 
 */

import prompt from 'prompt-sync';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import spinner from 'nanospinner';

const input = prompt();

let balanceAmount = 0; // INITIAL BALANCE

const ROWS= 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 3,
    "B": 6,
    "C": 9,
    "D": 12,
    "E": 15
};

const SYMBOLS_VALUE = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1
};

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const welcome = async () => {
    const welcomeTitle = chalkAnimation.rainbow(
        'WHO WANTS TO BE A JAVASCRIPT MILLIONAIRE? \n'
    );
    await sleep();
    figlet('LOT$ OF $LOT', (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });

    await sleep();
    welcomeTitle.stop();
    console.log(`
    ${chalk.yellowBright('HOW TO PLAY?')}
    1. Deposit some money ${chalk.greenBright("$$$")}
    2. Determine number of ${chalk.blueBright("lines")} to bet on
    3. Collect bet a amount ${chalk.greenBright("$$$")}
    4. ${chalk.bgRedBright("Spin")} the slot machine
    5. Get your winning ${chalk.greenBright("$$$")}
    `);
};

const getStarted = async () => { 
    let betLines = 0;
    let betAmount = 0;

    while (true) { 
        const answerChoices = [
            `1. Deposit ${chalk.greenBright("$$$")}`,
            `2. Let's bet on`,
            `3. ${chalk.bgRedBright("Spin Now!")}`,
            `4. Quit game`
        ];
    
        console.log(`:: ${chalk.yellowBright('GETTING STARTED')}`);
        console.log(`Your balance ${chalk.greenBright('$') + chalk.bgGreenBright(balanceAmount)}`);
        console.log(`Your bet amount ${chalk.greenBright('$') + chalk.bgGreenBright(betAmount)}`);
        console.log(`Your bet lines ${chalk.bgRedBright(betLines)}`);
        const answers = await inquirer.prompt({
            name: 'game_options',
            type: 'list',
            message: 'Please choose your action:',
            choices: answerChoices
        });
    
        console.clear();
    
        const gameOption = answerChoices.indexOf(answers.game_options);
    
        switch (gameOption) {
            case 0:
                balanceAmount += await deposit();
                break;
            case 1:
                if (balanceAmount > 0) {
                    betLines = await getNumberOfLines();
                    betAmount = await getBet(balanceAmount, betLines);
                } else { 
                    console.log('You ran out of money!');
                }
                break;
            case 2:
                if (balanceAmount > 0 &&
                    betLines > 0 &&
                    betAmount > 0
                ) { 
                    balanceAmount -= betLines * betAmount;
                    balanceAmount = balanceAmount < 0 ? 0 : balanceAmount;
                    balanceAmount = await playGame(balanceAmount, betAmount, betLines);
                    await sleep(1000);
                }
                else { 
                    console.log('You ran out of money!');
                }
                break;
            case 3:
                spinner.createSpinner('Exit...').start();
                await sleep(500);
                process.exit(1);
            default:
                break;
        }

        const loader = spinner.createSpinner('Saving...').start();
        await sleep();
        loader.stop();
        console.clear();
    }
}

/**
 * 1. User: Deposit some money
 * @returns number of deposit amount
 */
const deposit  = async () => {
    while(true) {
        const inputDepositAmount = input("Enter a deposit amount (>= $0): ");
        const numberDepositAmount = parseFloat(inputDepositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount < 0) {
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
const getNumberOfLines = async () => { 
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
const getBet = async (balance, lines) => {
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
        const rowString = row.join(' - ');
        figlet(rowString, (err, data) => {
            console.log(gradient.pastel.multiline(data));
        });
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
const game = async () => { 
    await welcome();
    await getStarted();
};

const playGame = async (balance, betAmount, betLines) => { 
    let won = 0;

    while (won == 0) { 
        let reels = spin();
        let transposeReels = transpose(reels);
        printReels(transposeReels);
        won = getWinning(transposeReels, betAmount, betLines);
        balance += won;
        balance--;
        
        console.log(balance, won, betAmount, betLines);
        await sleep(500);

        if (won > 0) { 
            console.log(`You Won ${chalk.greenBright('$') + chalk.bgGreenBright(won)}!!!`);
            console.log(`Your balance ${chalk.greenBright('$') + chalk.bgGreenBright(balance)}`);
            await sleep(2000);
        }

        if (balance <= 0) { 
            balance = 0;
            console.log(`${chalk.bgRedBright('You ran out of money!')}, your balance ${chalk.greenBright('$') + chalk.bgGreenBright(balance)}`);
            await sleep(2000);
            break;
        }

        console.clear();
    }

    return balance;
}

// Code drive
await game();