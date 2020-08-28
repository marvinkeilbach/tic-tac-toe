// Tasks: 
// Build AI
// Make reset button

const gameboard = (function() {
    let _gameboard = [[], [], [], 
                      [], [], [], 
                      [], [], []];
    const infoField = document.querySelector('.start-game');
    const choiceFields = document.querySelectorAll('.choice');
    const resetField = document.querySelector('.reset');
    const fields = document.querySelectorAll('.field');
    const _humanScore = document.querySelector('.human-score');
    const _computerScore = document.querySelector('.computer-score');
    let status = "pause";
    
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

    return {applyMove, fields, infoField, choiceFields, status, resetGameboard, updateScore, toggleActive, resetField};
})();




const Player = (name, moveStatus) => {
    let _name = name;
    let _moveStatus = moveStatus;
    
    const getName = () => _name;
    const setName = (newName) => {_name = newName};
    const toggleMoveStatus = () => {_moveStatus = !_moveStatus;};
    const checkMoveStatus = () => _moveStatus;
    const score = 0;

    return {checkMoveStatus, toggleMoveStatus, score, getName, setName};
}




const gameLogic = (function() {
    const _winningPatterns = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5]];
    let _humanStatus = [];
    let _computerStatus = [];

    const applyMove = (name, location) => {
        if(name === "human") {
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

        if(AI.status && computer.checkMoveStatus() && gameboard.status === "running") {
            AI.makeMove();
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

        if(winner === "human") {
            gameboard.infoField.innerText = `${human.getName()} won!`;
        } else if(winner === "computer") {
            gameboard.infoField.innerText = `${computer.getName()} won!`;
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
            gameboard.resetField.parentElement.classList.toggle('float-visible');
            gameboard.updateScore(winner);
        }, 2000);

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

    return {checkMove, applyMove, reset, _computerStatus};
})();




const AI = (function() {
    let status = false;

    const makeMove = function() {
        let choice;
        choice = Math.floor(Math.random() * Math.floor(8));
        if(gameLogic.checkMove(choice)) {
            gameLogic.applyMove("computer", choice);
        } else if(gameLogic._computerStatus.length < 4){
            makeMove();
        } else {
            return;
        }
    }


    return {status, makeMove};
})();




// Event listeners on the gameboard fields
(function() {
    gameboard.fields.forEach(field => field.addEventListener("click", _fireEvent));
    gameboard.infoField.addEventListener("click", _startGame);
    gameboard.choiceFields.forEach(field => field.addEventListener("click", _makeChoice));
    gameboard.resetField.addEventListener("click", _reset);


    function _fireEvent(e) {
        if(gameboard.status === "running" && AI.status === false) {
            const currentMove = e.target.dataset.gridIndex;
            if(human.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
                gameLogic.applyMove("human", currentMove);
            } else if(computer.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
                gameLogic.applyMove("computer", currentMove);
            } else {
                alert("This field has already been played.");
            }
        }
        else if(gameboard.status === "running" && human.checkMoveStatus()) {
            const currentMove = e.target.dataset.gridIndex;
            if(human.checkMoveStatus() && gameLogic.checkMove(currentMove)) {
                gameLogic.applyMove("human", currentMove);
            } else {
                alert("This field has already been played.");
            }
        }
    }


    function _startGame(e) {
        if(gameboard.status === "pause" && gameboard.infoField.innerText === "click to start new round") {
            e.target.parentElement.classList.toggle('float-visible');
            if(gameboard.resetField.classList.contains('float-visible')) {
                gameboard.resetField.classList.toggle('float-visible');
            }
            gameboard.status = "running"
            gameLogic.reset();
            gameboard.resetGameboard();
        }
        if(gameboard.resetField.parentElement.classList.contains('float-visible')) {
            gameboard.resetField.parentElement.classList.toggle('float-visible');
        }
    }


    function _makeChoice(e) {
        if(e.target.classList.contains('pvp')) {
            AI.status = false;
        } else {
            AI.status = true;
        }
        computer.setName(AI.status ? "computer" : "player 2");
        human.setName(AI.status ? "you" : "player 1");

        gameboard.choiceFields.forEach(field => {
            field.parentElement.classList.toggle('float-visible');
            field.parentElement.classList.toggle('invisible');
        });
        gameboard.infoField.parentElement.classList.toggle('float-visible');
        if(gameboard.infoField.parentElement.classList.contains('invisible')) {
            gameboard.infoField.parentElement.classList.toggle('invisible');
        }
    }


    function _reset() {
        if(gameboard.status === "pause") {
            gameboard.resetField.parentElement.classList.toggle('float-visible');
            gameboard.infoField.parentElement.classList.toggle('float-visible');
            gameboard.infoField.parentElement.classList.toggle('invisible');
            gameboard.choiceFields.forEach(field => {
                field.parentElement.classList.toggle('float-visible');
                field.parentElement.classList.toggle('invisible');
            })
            gameLogic.reset();
            gameboard.resetGameboard();
            computer.score = 0;
            human.score = 0;
            gameboard.updateScore();
        }
    }
})();

const computer = Player((AI.status ? "computer" : "player 2"), false);
const human = Player((AI.status ? "you" : "player 1"), true);

gameboard.resetGameboard();
gameboard.updateScore();