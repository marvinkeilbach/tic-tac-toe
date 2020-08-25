// Tasks: 
// work out the checkwin and checkdraw methods and create a "new game" method
// create a transitioning popup on the display with initial comments "you are green, computer is blue, good luck!", which fades out
// when tie or won, transition in a new popup, and ask if a new game is wished -> only when it is clicked, let it fade out (don't allow DOM manipulation when it is still there)
// if a new game is wished, let a new popup come in which says "Round xyz"
// Create color coded score measure (1 point = 1 won round)
// Find a way to let only the div being clicked without using z-index (OR: find out more how to use z-index)
// Why? -> You want to be able to set a background, which isn't possible right now
// Make it beautiful <3

const gameboard = (function() {
    const _gameboard = [[], [], [], 
                        [], [], [], 
                        [], [], []];
    const _render = () => {
        fields.forEach((field, index) => {
            field.firstChild.innerText = _gameboard[index][0];
            field.firstChild.classList = `${_gameboard[index][1]}`;
        })
    };
    const applyMove = (symbol, location, color) => {
        _gameboard[location] = [symbol, color];
        _render();
    };
    const resetGameboard = () => {
        _gameboard.forEach((field, index) => {
            _gameboard[index] = ["", "blank"];
        })
    }
    const _checkStatus = () => {};
    const fields = document.querySelectorAll('.field');
    resetGameboard();
    _render();

    return {applyMove, fields};
})();

const Player = (name, moveStatus) => {
    const _name = name;
    let _moveStatus = moveStatus;
    const toggleMoveStatus = () => {
        _moveStatus = !_moveStatus;
    };
    const checkMoveStatus = () => _moveStatus;

    return {checkMoveStatus, toggleMoveStatus};
}

const gameLogic = (function() {
    const _winningPatterns = [[0, 1, 2], [0, 3, 5], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5]];
    const _humanStatus = [];
    const _computerStatus = [];
    const applyMove = (name, location) => {
        if(name === "human") {
            console.log(name + location);
            _humanStatus.push(+location);
            _humanStatus.sort();
            human.toggleMoveStatus();
            computer.toggleMoveStatus();
            gameboard.applyMove("X", location, "green");
        } else {
            _computerStatus.push(+location);
            _computerStatus.sort();
            human.toggleMoveStatus();
            computer.toggleMoveStatus();
            gameboard.applyMove("O", location, "blue");  
        }
        _checkWin();
        _checkDraw();
    };
    const checkMove = (location) => {
        if(_humanStatus.includes(+location) || _computerStatus.includes(+location)) {
            return false;
        } else {return true;}
    };
    
    const _checkWin = () => {
        _winningPatterns.forEach(pattern => {
            let humanCheck = 0;
            let computerCheck = 0;
            pattern.forEach(field => {
                if(_humanStatus.includes(field)) {
                    humanCheck++;
                }
                if(_computerStatus.includes(field)) {
                    computerCheck++;
                }
            })
            if(humanCheck === 3) {
                console.log("yes");
                alertWin("human");
            }
            if(computerCheck === 3) {
                alertWin("computer");
            }
        })
    }

    const _checkDraw = () => {
        if(_humanStatus.length + _computerStatus.length === 9) {
            alertDraw();
        }
    }

    const alertWin = (winner) => {
        // render alert message on the page
        // reset the game
    }

    const alertDraw = () => {
        // render alert message on the page
        // reset the game
    }

    const currentPlayer = () => {
        if(human.checkMoveStatus === true) {
            return "human";
        } else {
            return "computer";
        }
    }

    return {checkMove, applyMove, currentPlayer};
})();

// Event listeners on the gameboard fields
(function() {
    gameboard.fields.forEach(field => field.addEventListener("click", _fireEvent));
    function _fireEvent(e) {
        const currentMove = e.target.dataset.gridIndex;
        console.log(e);
        console.log(human.checkMoveStatus(), gameLogic.checkMove(currentMove));
        if(human.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
            gameLogic.applyMove("human", currentMove);
        } else if(computer.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
            gameLogic.applyMove("computer", currentMove);
        } else {
            alert("This field has already been played.");
        }
    }
})();

const computer = Player("computer", false);
const human = Player("human", true);