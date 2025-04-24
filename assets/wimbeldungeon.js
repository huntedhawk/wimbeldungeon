function Racket() {
    this.damage = 3;
    this.damageRacket = function() {
        this.damage--;
        return this.damage;
    };
}
function Player(name) {
    this.name = name;
    this.racket = new Racket();
    this.powerPoints = 0;
    this.game = 0;
    this.set = 0;
}
function Dice() {
    document.getElementById("dice-mat").innerHTML = (
        '<div class="die">' +
        '<figure class="face face-1"></figure>' +
        '<figure class="face face-2"></figure>' +
        '<figure class="face face-3"></figure>' +
        '<figure class="face face-4"></figure>' +
        '<figure class="face face-5"></figure>' +
        '<figure class="face face-6"></figure>' +
        '<figure class="face face-7"></figure>' +
        '<figure class="face face-8"></figure>' +
        '<figure class="face face-9"></figure>' +
        '<figure class="face face-10"></figure>' +
        '<figure class="face face-11"></figure>' +
        '<figure class="face face-12"></figure>' +
        '<figure class="face face-13"></figure>' +
        '<figure class="face face-14"></figure>' +
        '<figure class="face face-15"></figure>' +
        '<figure class="face face-16"></figure>' +
        '<figure class="face face-17"></figure>' +
        '<figure class="face face-18"></figure>' +
        '<figure class="face face-19"></figure>' +
        '<figure class="face face-20"></figure>' +
        "</div>"
    );

    this.die = document.querySelector("#dice-mat .die");
    this.sides = 20;

    this.roll = function() {
        let result = Math.floor(Math.random() * this.sides + 1);
        this.rollTo(result);
        return result;
    };

    this.rollTo = function(result) {
        if (this.die) {
            this.die.classList.add("rolling");
            setTimeout(() => {
                this.die.setAttribute("data-face", result);
            }, 50);
        }
    };

    this.reset = function() {
        if (this.die) {
            this.die.removeAttribute("data-face");
            this.die.classList.remove("rolling");
        }
    };
}

// Pass the main game object (gameObj) to the Scoreboard
function Scoreboard(player1, player2, gameObj) {
    this.player1 = player1;
    this.player2 = player2;
    this.log = new Log();
    this.gameObj = gameObj; // Store reference to the main game object

    this.currentScore = function() {
        const result = {
            player1: {
                game: this.player1.game,
                set: this.player1.set
            },
            player2: {
                game: this.player2.game,
                set: this.player2.set
            }
        };
        return result;
    };

    this.addPoint = function(player) {
        let opponent = player.opposingPlayer;
        let playerGame = player.game;
        let opponentGame = opponent.game;

        if (playerGame === 0) player.game = 15;
        else if (playerGame === 15) player.game = 30;
        else if (playerGame === 30) player.game = 40;
        else if (playerGame === 40) {
            if (opponentGame < 40) { // Game win
                this.winGame(player);
            } else if (opponentGame === 40) { // Deuce -> Advantage Player
                player.game = "Advantage";
                this.log.write(player.name + " has Advantage.");
            } else if (opponentGame === "Advantage") { // Advantage Opponent -> Deuce
                opponent.game = 40;
                this.log.write("Deuce.");
            }
        } else if (playerGame === "Advantage") { // Advantage Player -> Game win
            this.winGame(player);
        }

        // Only log point if game wasn't won immediately
        if (player.game !== 0 && player.game !== "Advantage") {
             this.log.write("Point to " + player.name + ". Score: " + player.game + "-" + opponent.game);
        } else if (player.game === "Advantage") {
             // Logged above
        } else if (player.game === 40 && opponent.game === 40) {
             // Logged above (Deuce)
        }
    };

    this.winGame = function(player) {
        this.log.write('Game to ' + player.name);
        player.game = 0;
        player.opposingPlayer.game = 0;
        player.set++;
        this.log.write('Set score: ' + player.name + ' ' + player.set + ' - ' + player.opposingPlayer.name + ' ' + player.opposingPlayer.set);

        // Check for Match Win (Assuming first to 2 sets)
        if (player.set >= 2) { // Simple win condition, could add tie-break logic later
            this.winMatch(player);
        }
    };

    this.winMatch = function(player) {
         this.log.write("Match to " + player.name + "!");
         // Disable further play
         document.getElementById('continueRally').disabled = true;
         const serveButton = document.querySelector('#newServe button#serve'); // Assuming the button has id="serve"
         if (serveButton) {
             serveButton.disabled = true;
         }

         // --- Replace confirm() with modal ---
         // const playAgain = confirm(player.name + " wins the match! Play again?");
         // if (playAgain) { ... } else { ... }

         // Get the modal instance from the game object
         const modalInstance = this.gameObj.playAgainModal;
         if (modalInstance) {
             // Set the winner message
             const winnerMessageEl = document.getElementById('matchWinnerMessage');
             if (winnerMessageEl) {
                 winnerMessageEl.textContent = player.name + " wins the match!";
             }
             // Show the modal
             modalInstance.show();
         } else {
             // Fallback if modal instance isn't available
             this.log.write("Game Over. Thanks for playing! (Modal not found)");
         }
         // --- End replacement ---

         // The logic for resetting or quitting is now handled by the
         // event listeners attached to the modal buttons in index.html
    };

    this.draw = function () {
        let result = this.currentScore();
        document.getElementById('player1Name').innerHTML = this.player1.name;
        document.getElementById('player2Name').innerHTML = this.player2.name;
        document.getElementById('player1Game').innerHTML = result.player1.game;
        document.getElementById('player1Set').innerHTML = result.player1.set;
        document.getElementById('player2Game').innerHTML = result.player2.game;
        document.getElementById('player2Set').innerHTML = result.player2.set;

        // Update Power Points display
        const p1ppEl = document.getElementById('player1PP');
        if (p1ppEl) p1ppEl.textContent = this.player1.powerPoints;
        const p2ppEl = document.getElementById('player2PP');
        if (p2ppEl) p2ppEl.textContent = this.player2.powerPoints;

        // Update Racket Damage display
        const p1DamageEl = document.getElementById('player1Damage');
        if (p1DamageEl) p1DamageEl.textContent = this.player1.racket.damage;
        const p2DamageEl = document.getElementById('player2Damage');
        if (p2DamageEl) p2DamageEl.textContent = this.player2.racket.damage;
    };
}
function Rally() {
    this.current = parseInt(0);
    this.previous = parseInt(0);
    this.difficulty = parseInt(0);
    this.add = function(difficulty) {
        this.difficulty = 0;
        this.previous = this.current;
        this.current = parseInt(difficulty);
        this.difficulty = this.current + this.previous;
        return this.difficulty;
    };
    this.draw = function () {
        const difficultySpan = document.getElementById('currentShotDifficulty');
        if (difficultySpan) {
             difficultySpan.innerHTML = " has shot difficulty - " + this.difficulty;
        }
    };
}
function Log() {
    this.dom = document.getElementById('log'); // Get element directly
    this.write = function (message) {
        this.dom.insertAdjacentHTML('beforeend', "<p>" + message + "</p>");

        let height = this.dom.scrollHeight;

        this.dom.scrollTo({
            top: height,
            behavior: 'smooth' // Use native smooth scrolling
        });
    }
}

// Add playAgainModalInstance parameter
function Wimbledungeons(player1Name, player2Name, powerPoints, racketDamage, newServeModalInstance, playAgainModalInstance) {
    this.rules = {
        powerPoints: powerPoints,
        racketDamage: racketDamage
    };
    this.log = new Log();
    this.log.write('Building Game Object Please wait');
    this.dice = new Dice();
    this.player1 = new Player(player1Name);
    this.player2 = new Player(player2Name);
    this.player1.opposingPlayer = this.player2;
    this.player2.opposingPlayer = this.player1;
    this.currentPlayer = this.player1;
    this.currentServer = this.player1;
    // Pass 'this' (the Wimbledungeons instance) to Scoreboard
    this.scoreboard = new Scoreboard(this.player1, this.player2, this);
    // this.scoreboard.currentPlayer = this.currentPlayer; // This property seems unused in Scoreboard
    this.rally = new Rally();
    this.newServeModal = newServeModalInstance; // Store the serve modal instance
    this.playAgainModal = playAgainModalInstance; // Store the play again modal instance

    // $('#player1Serving').html('&times;');
    const p1ServingEl = document.getElementById('player1Serving');
    if (p1ServingEl) p1ServingEl.innerHTML = '&times;';

    this.awardPP = function(player, diceRoll) {
        if (!this.rules.powerPoints) return; // Exit if rule not enabled

        let ppGained = 0;
        if (diceRoll === 20) {
            ppGained = 2; // Nat 20 gives 2 PP
        } else if (diceRoll >= 16) {
            ppGained = 1; // 16-19 gives 1 PP
        }

        if (ppGained > 0) {
             player.powerPoints += ppGained;
             this.log.write(player.name + " gained " + ppGained + " Power Point(s)! Total: " + player.powerPoints);
        }
    };

    this.pressAdvantage = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            // Check if difficulty is already at or above cap
            if (difficulty >= 20) {
                 this.log.write(player.name + " tried to Press Advantage, but difficulty is already 20 or higher.");
                 return difficulty; // Return unchanged difficulty
            }
            player.powerPoints--;
            let newDifficulty = difficulty + 5;
            // Apply cap
            if (newDifficulty > 20) {
                newDifficulty = 20;
                this.log.write(player.name + " Pressed the Advantage! Difficulty increased to capped value of 20. PP left: " + player.powerPoints);
            } else {
                this.log.write(player.name + " Pressed the Advantage! Difficulty is now " + newDifficulty + ". PP left: " + player.powerPoints);
            }
            return newDifficulty;
        }
        return difficulty; // Return unchanged if no PP or rule disabled
    };

    this.calmStorm = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            player.powerPoints--;
            // Ensure difficulty doesn't go below a minimum (e.g., 1 or 0?)
            let newDifficulty = Math.max(1, difficulty - 5); // Prevent going below 1
            this.log.write(player.name + " Calmed the Storm! Difficulty is now " + newDifficulty + ". PP left: " + player.powerPoints);
            return newDifficulty;
        }
        return difficulty;
    };

    this.checkHit = function(diceroll, difficulty) {
        // Check if the roll meets or exceeds the required difficulty
        if (diceroll >= difficulty) {
            this.log.write("Hit! (Roll: " + diceroll + " vs Difficulty: " + difficulty + ")");
            return true; // Successful hit
        } else {
            this.log.write("Miss! (Roll: " + diceroll + " vs Difficulty: " + difficulty + ")");
            return false; // Missed shot
        }
    };

    this.racketCheck = function(player, diceRoll) {
        if (!this.rules.racketDamage) {
             return false; // Exit if rule is not enabled
        }

        let damageTaken = 0;
        if (diceRoll === 1) {
            damageTaken = 2; // Critical failure
        } else if (diceRoll <= 5) {
            damageTaken = 1;
        }

        if (damageTaken > 0) {
            for (let i = 0; i < damageTaken; i++) {
                 player.racket.damageRacket(); // Decrement damage
            }
            this.log.write("Racket damaged! Roll: " + diceRoll + ". Damage taken: " + damageTaken + ". Racket health: " + player.racket.damage);

            if (player.racket.damage <= 0) { // Check if health is 0 or less
                player.racket = new Racket(); // Give new racket
                this.log.write(player.name + "'s racket broke! Point lost. New racket provided.");
                return true; // Racket broke
            }
        }
        return false; // Racket did not break
    };

    this.changeServer = function () {
        const p1ServingEl = document.getElementById('player1Serving');
        const p2ServingEl = document.getElementById('player2Serving');

        if(this.currentServer === this.player1)
        {
            this.currentServer = this.player2;
            if (p1ServingEl) p1ServingEl.innerHTML = '';
            if (p2ServingEl) p2ServingEl.innerHTML = '&times;';
        }
        else
        {
            this.currentServer = this.player1;
            if (p1ServingEl) p1ServingEl.innerHTML = '&times;';
            if (p2ServingEl) p2ServingEl.innerHTML = '';
        }
    };

    this.changePlayer = function () {
        if(this.currentPlayer === this.player1)
        {
            this.currentPlayer = this.player2;
        }
        else
        {
            this.currentPlayer = this.player1;
        }
        this.log.write(this.currentPlayer.name + "'s turn.");
    };

    this.serve = function(
        serveDifficulty,
        pressAdvantage,
        calmStorm
    ) {
        const diceRoll = this.dice.roll();
        this.log.write(this.currentServer.name + " serves. Dice Rolled a " + diceRoll);
        this.awardPP(this.currentServer, diceRoll); // Award PP based on roll

        // Check for racket damage/break FIRST
        if (this.racketCheck(this.currentServer, diceRoll)) {
            // Racket broke, point to opponent
            this.log.write("Serve failed due to broken racket.");
            this.scoreboard.addPoint(this.currentServer.opposingPlayer);
            document.getElementById('continueRally').disabled = true;

            const newServeModalEl = document.getElementById('newServe');

            // Define the handler using an arrow function to capture 'this'
            const serveModalHiddenHandler = () => { // Changed to arrow function
                this.startNewServe(); // Use 'this' directly
                // Remove the listener after it runs once
                if (newServeModalEl) {
                    newServeModalEl.removeEventListener('hidden.bs.modal', serveModalHiddenHandler);
                }
            };

            // Remove any previous listener before adding a new one
            if (newServeModalEl) {
                newServeModalEl.removeEventListener('hidden.bs.modal', serveModalHiddenHandler);
                // Add the listener
                newServeModalEl.addEventListener('hidden.bs.modal', serveModalHiddenHandler);
            }

            this.changeServer(); // Server changes as point is lost
            this.draw();
            return; // Stop further processing for this serve
        }

        // If racket didn't break, calculate difficulty and check hit
        let difficulty = this.rally.add(serveDifficulty); // Reset rally difficulty for serve

        // Apply power point abilities
        if (calmStorm) {
            difficulty = this.calmStorm(this.currentServer, difficulty);
        }
        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentServer, difficulty);
        }

        // Now check if the serve was successful
        let hitSuccess = this.checkHit(diceRoll, difficulty);

        if (!hitSuccess) {
            // Serve missed, point to opponent
            this.log.write(this.currentServer.name + " missed the serve.");
            this.scoreboard.addPoint(this.currentServer.opposingPlayer);
            document.getElementById('continueRally').disabled = true;

            const newServeModalEl = document.getElementById('newServe');

            // Define the handler using an arrow function
            const serveModalHiddenHandler = () => { // Changed to arrow function
                this.startNewServe(); // Use 'this' directly
                if (newServeModalEl) {
                    newServeModalEl.removeEventListener('hidden.bs.modal', serveModalHiddenHandler);
                }
            };

            // Remove/Add listener
            if (newServeModalEl) {
                newServeModalEl.removeEventListener('hidden.bs.modal', serveModalHiddenHandler);
                newServeModalEl.addEventListener('hidden.bs.modal', serveModalHiddenHandler);
            }

            this.changeServer(); // Server changes as point is lost
        } else {
            // Serve successful, next player is the receiver
            this.log.write(this.currentServer.name + " served successfully.");
            this.currentPlayer = this.currentServer.opposingPlayer; // Receiver's turn
            document.getElementById('continueRally').disabled = false; // Enable return button
        }

        this.draw();
    };

    this.continueRally = function(
        shotDifficulty,
        pressAdvantage,
        calmStorm
    ) {
        const diceRoll = this.dice.roll();
        this.log.write(this.currentPlayer.name + " returns. Dice Rolled a " + diceRoll);
        this.awardPP(this.currentPlayer, diceRoll); // Award PP based on roll

        // Check for racket damage/break FIRST
        if (this.racketCheck(this.currentPlayer, diceRoll)) {
            // Racket broke, point to opponent
            this.log.write("Return failed due to broken racket.");
            this.scoreboard.addPoint(this.currentPlayer.opposingPlayer);
            document.getElementById('continueRally').disabled = true;

            // Point lost, start new serve sequence
            // No modal needed here, just call startNewServe directly
            this.startNewServe();
            this.draw();
            return; // Stop further processing
        }

        // If racket didn't break, calculate difficulty and check hit
        // Difficulty includes opponent's last shot + current player's chosen shot
        let difficulty = this.rally.add(shotDifficulty);

        // Apply power point abilities
        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentPlayer, difficulty);
        }
        if (calmStorm) {
            difficulty = this.calmStorm(this.currentPlayer, difficulty);
        }

        // Now check if the return was successful
        let hitSuccess = this.checkHit(diceRoll, difficulty);

        if (!hitSuccess) {
            // Return missed, point to opponent
            this.log.write(this.currentPlayer.name + " missed the return.");
            this.scoreboard.addPoint(this.currentPlayer.opposingPlayer);
            document.getElementById('continueRally').disabled = true;

            // Point lost, start new serve sequence
            // No modal needed here, just call startNewServe directly
            this.startNewServe();
        } else {
            // Return successful, change player for the next shot
            this.log.write(this.currentPlayer.name + " returned successfully.");
            this.changePlayer(); // Opponent's turn to return
            document.getElementById('continueRally').disabled = false; // Keep rally going
        }

        this.draw();
    };

    this.startNewServe = function () {
        // $('#newServe').modal({backdrop:'static',keyboard:false});
        // Options should be set when creating the modal instance in index.html
        if (this.newServeModal) {
            this.newServeModal.show();
        }

        // $('#newServe').find('.modal-title').html(this.currentServer.name + ' serving');
        const modalTitle = document.querySelector('#newServe .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = this.currentServer.name + ' serving';
        }

        // $('#newServe').off('hidden.bs.modal');
        // Removing specific listeners is handled in serve/continueRally, so this might not be needed
        // If you need to remove ALL listeners of this type:
        // const newServeModalEl = document.getElementById('newServe');
        // if (newServeModalEl) {
        //    // Note: No standard way to remove *all* listeners without references.
        //    // Best practice is to manage listeners specifically.             $('#player1PP').text(this.player1.powerPoints); // Assuming you add <span id="player1PP"></span> etc. to your HTML score area
        // }s);

        this.draw(); // Draw AFTER preparing the modal content(current player for rally, current server for serve)
    };

    // Add a resetGame method
    this.resetGame = function() {
        this.log.write("Starting a new match...");
        this.player1.game = 0;
        this.player1.set = 0;
        this.player2.game = 0;
        this.player2.set = 0;
        this.player1.racket = new Racket();
        this.player2.racket = new Racket();
        this.player1.powerPoints = 0;
        this.player2.powerPoints = 0;

        // Re-enable buttons
        const serveButton = document.querySelector('#newServe button#serve');
        if (serveButton) {
            serveButton.disabled = false;
        }
        // Note: continueRally button should still be disabled until a serve is successful
        document.getElementById('continueRally').disabled = true;

        this.startNewServe(); // Trigger the serve modal for the new game
        // Draw is called within startNewServe, so no extra call needed here
    };

    this.draw = function () {
        // $('#advancedRules').html('');
        const advancedRulesEl = document.getElementById('advancedRules');
        if (advancedRulesEl) advancedRulesEl.innerHTML = '';
        // $('#serveAdanced').html('');
        const serveAdvancedEl = document.getElementById('serveAdanced');
        if (serveAdvancedEl) serveAdvancedEl.innerHTML = '';

        // Display Power Points if rule is enabled
        if (this.rules.powerPoints) {
             // $('#player1PP').text(this.player1.powerPoints);
             const p1ppEl = document.getElementById('player1PP');
             if (p1ppEl) p1ppEl.textContent = this.player1.powerPoints; // Use textContent for plain text
             // $('#player2PP').text(this.player2.powerPoints);
             const p2ppEl = document.getElementById('player2PP');
             if (p2ppEl) p2ppEl.textContent = this.player2.powerPoints;

             let playerForRallyOptions = this.currentPlayer;
             let playerForServeOptions = this.currentServer;

             // Add Rally Options
             let rallyOptionsHtml = '';
             if (playerForRallyOptions.powerPoints > 0) {
                 rallyOptionsHtml += `<div>Power Points: ${playerForRallyOptions.powerPoints}</div>`;
                 rallyOptionsHtml += `<input type="checkbox" id="pressAdvantage" value="1"><label for="pressAdvantage"> Press Advantage (Cost: 1 PP)</label><br>`;
                 rallyOptionsHtml += `<input type="checkbox" id="calmStorm" value="1"><label for="calmStorm"> Calm Storm (Cost: 1 PP)</label>`;
             } else {
                 rallyOptionsHtml += `<div>Power Points: 0</div>`;
             }
             // $('#advancedRules').html(rallyOptionsHtml);
             if (advancedRulesEl) advancedRulesEl.innerHTML = rallyOptionsHtml;

             // Add Serve Options
             let serveOptionsHtml = '';
              if (playerForServeOptions.powerPoints > 0) {
                 serveOptionsHtml += `<div>Power Points: ${playerForServeOptions.powerPoints}</div>`;
                 serveOptionsHtml += `<input type="checkbox" id="pressAdvantageServe" value="1"><label for="pressAdvantageServe"> Press Advantage (Cost: 1 PP)</label><br>`;
                 serveOptionsHtml += `<input type="checkbox" id="calmStormServe" value="1"><label for="calmStormServe"> Calm Storm (Cost: 1 PP)</label>`;
             } else {
                  serveOptionsHtml += `<div>Power Points: 0</div>`;
             }
             // $('#serveAdanced').html(serveOptionsHtml);
             if (serveAdvancedEl) serveAdvancedEl.innerHTML = serveOptionsHtml;
        }

        // Update player names, scores, etc.
        // $('#currentPlayer').html(this.currentPlayer.name);
        const currentPlayerEl = document.getElementById('currentPlayer');
        if (currentPlayerEl) currentPlayerEl.innerHTML = this.currentPlayer.name;

        // Example placeholder:
        // const shotTypeEl = document.getElementById('shotType');
        // if (shotTypeEl) shotTypeEl.textContent = (this.rally.current === 0 ? 'Serve' : 'Return');

        this.scoreboard.draw();
        this.rally.draw();
    };
    this.log.write('GameObject Built game ready');
}
