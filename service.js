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

const deposit  = () => {
    while(true) {
        const inputDepositAmount = input("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(inputDepositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log('Invalid deposit amount, try again.');
        }
        else {
            return numberDepositAmount;
        }
    }
}

const depositAmount = deposit();
console.log({ depositAmount });
