// Tasks: 
// Build AI
// Make reset button
// Allow choice between 2player game and game against AI

const gameboard = (function() {
    let _gameboard = [[], [], [], 
                      [], [], [], 
                      [], [], []];

    const _render = () => {
        fields.forEach((field, index) => {
            field.firstChild.innerText = _gameboard[index][0];
            field.firstChild.classList = `${_gameboard[index][1]}`;
        });
    };
    const updateScore = (winner) => {
        _humanScore.firstChild.innerText = human.score;
        _computerScore.firstChild.innerText = computer.score;
        if(winner === "human") {
            _humanScore.firstChild.classList.toggle('update-score');
            _humanScore.classList.toggle('update-score');
        } else if (winner === "computer") {
            _computerScore.firstChild.classList.toggle('update-score');
            _computerScore.classList.toggle('update-score');
        }
    }
    const applyMove = (symbol, location, color) => {
        _gameboard[location] = [symbol, color];
        toggleActive();
        _render();
    };
    const resetGameboard = () => {
        _gameboard.forEach((field, index) => {
            _gameboard[index] = ["", "blank"];
        });
        _render();
    }
    const toggleActive = () => {
        _humanScore.classList.toggle('active');
        _computerScore.classList.toggle('active');
    }

    const infoField = document.querySelector('button');
    const fields = document.querySelectorAll('.field');
    const _humanScore = document.querySelector('.human-score');
    const _computerScore = document.querySelector('.computer-score');
    let status = "pause";
    return {applyMove, fields, infoField, status, resetGameboard, updateScore, toggleActive};
})();

const Player = (name, moveStatus) => {
    const _name = name;
    let _moveStatus = moveStatus;
    const toggleMoveStatus = () => {_moveStatus = !_moveStatus;};
    const checkMoveStatus = () => _moveStatus;
    const score = 0;

    return {checkMoveStatus, toggleMoveStatus, moveStatus, score};
}

const gameLogic = (function() {
    const _winningPatterns = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5]];
    let _humanStatus = [];
    let _computerStatus = [];
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
        if(!winStatus) {
            _checkDraw();
        }

    };
    const checkMove = (location) => {
        if(_humanStatus.includes(+location) || _computerStatus.includes(+location)) {
            return false;
        } else {return true;}
    };
    
    let winStatus = false;

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
                alertWin("human");
                winStatus = true;
            }
            if(computerCheck === 3) {
                alertWin("computer");
                winStatus = true;
            }
        })
    }

    const _checkDraw = () => {
        if(_humanStatus.length + _computerStatus.length === 9) {
            alertWin("nobody");
        }
    }

    const alertWin = (winner) => {
        gameboard.status = "pause";
        if(winner === "human") {
            human.score++;
        } else {
            computer.score++
        }
        if(winner !== "nobody") {gameboard.infoField.innerText = `the ${winner} won!`;
        } else {
            gameboard.infoField.innerText = `that's a tie!`;
        }
        gameboard.infoField.parentElement.classList.toggle(`${winner}`);
        gameboard.infoField.parentElement.classList.toggle('hover');
        gameboard.infoField.parentElement.classList.toggle('float-visible');
        setTimeout(function() {
            gameboard.updateScore(winner);
        }, 500);
        setTimeout(function() {
            gameboard.infoField.innerText = "click to start new round";
            gameboard.infoField.parentElement.classList.toggle(`${winner}`);
            gameboard.infoField.parentElement.classList.toggle('hover');
            gameboard.updateScore(winner);
        }, 2000);

        // reset the game
    }

    const reset = () => {
        _humanStatus = [];
        _computerStatus = [];
        winStatus = false;
        if(!human.checkMoveStatus()) {
            human.toggleMoveStatus();
            computer.toggleMoveStatus();
            gameboard.toggleActive();
        }
    }

    return {checkMove, applyMove, reset};
})();

// Event listeners on the gameboard fields
(function() {
    gameboard.fields.forEach(field => field.addEventListener("click", _fireEvent));
    gameboard.infoField.addEventListener("click", startGame);

    function _fireEvent(e) {
        if(gameboard.status === "running") {
            const currentMove = e.target.dataset.gridIndex;
            if(human.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
                gameLogic.applyMove("human", currentMove);
            } else if(computer.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
                gameLogic.applyMove("computer", currentMove);
            } else {
                alert("This field has already been played.");
            }
        }
    }

    function startGame(e) {
        if(gameboard.status === "pause" && gameboard.infoField.innerText === "click to start new round") {
            e.target.parentElement.classList.toggle('float-visible');
            gameboard.status = "running"
            gameLogic.reset();
            gameboard.resetGameboard();
        }
    }
})();

const computer = Player("computer", false);
const human = Player("human", true);

gameboard.resetGameboard();
gameboard.updateScore();