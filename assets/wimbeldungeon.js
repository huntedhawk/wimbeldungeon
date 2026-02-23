function Racket() {
    this.damage = 3;
    this.damageRacket = function() {
        this.damage--;
        return this.damage;
    };
}

function Player(name) {
    this.name = name || "Player";
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

function Scoreboard(player1, player2, gameObj) {
    this.player1 = player1;
    this.player2 = player2;
    this.log = new Log();
    this.gameObj = gameObj;

    this.currentScore = function() {
        return {
            player1: {
                game: this.player1.game,
                set: this.player1.set
            },
            player2: {
                game: this.player2.game,
                set: this.player2.set
            }
        };
    };

    this.addPoint = function(player) {
        const opponent = player.opposingPlayer;
        const playerGame = player.game;
        const opponentGame = opponent.game;

        if (playerGame === 0) {
            player.game = 15;
        } else if (playerGame === 15) {
            player.game = 30;
        } else if (playerGame === 30) {
            player.game = 40;
        } else if (playerGame === 40) {
            if (opponentGame < 40) {
                this.winGame(player);
            } else if (opponentGame === 40) {
                player.game = "Advantage";
                this.log.write(player.name + " has Advantage.");
            } else if (opponentGame === "Advantage") {
                opponent.game = 40;
                this.log.write("Deuce.");
            }
        } else if (playerGame === "Advantage") {
            this.winGame(player);
        }

        if (player.game !== 0 && player.game !== "Advantage") {
            this.log.write("Point to " + player.name + ". Score: " + player.game + "-" + opponent.game);
        }
    };

    this.winGame = function(player) {
        this.log.write("Game to " + player.name);
        player.game = 0;
        player.opposingPlayer.game = 0;
        player.set++;

        this.log.write("Set score: " + player.name + " " + player.set + " - " + player.opposingPlayer.name + " " + player.opposingPlayer.set);

        if (player.set >= 2) {
            this.winMatch(player);
        }
    };

    this.winMatch = function(player) {
        this.log.write("Match to " + player.name + "!");
        this.gameObj.setControlsDisabled(true);

        const modalInstance = this.gameObj.playAgainModal;
        if (modalInstance) {
            const winnerMessageEl = document.getElementById("matchWinnerMessage");
            if (winnerMessageEl) {
                winnerMessageEl.textContent = player.name + " wins the match!";
            }
            modalInstance.show();
        } else {
            this.log.write("Game Over. Thanks for playing! (Modal not found)");
        }
    };

    this.toggleOptionalColumns = function() {
        const ppEnabled = !!this.gameObj.rules.powerPoints;
        const racketEnabled = !!this.gameObj.rules.racketDamage;

        const ppHeader = document.getElementById("ppHeader");
        const p1pp = document.getElementById("player1PP");
        const p2pp = document.getElementById("player2PP");

        const racketHeader = document.getElementById("racketHeader");
        const p1Racket = document.getElementById("player1Damage");
        const p2Racket = document.getElementById("player2Damage");

        if (ppHeader) ppHeader.style.display = ppEnabled ? "" : "none";
        if (p1pp) p1pp.style.display = ppEnabled ? "" : "none";
        if (p2pp) p2pp.style.display = ppEnabled ? "" : "none";

        if (racketHeader) racketHeader.style.display = racketEnabled ? "" : "none";
        if (p1Racket) p1Racket.style.display = racketEnabled ? "" : "none";
        if (p2Racket) p2Racket.style.display = racketEnabled ? "" : "none";
    };

    this.draw = function() {
        const result = this.currentScore();

        const player1NameEl = document.getElementById("player1Name");
        if (player1NameEl) player1NameEl.textContent = this.player1.name;

        const player2NameEl = document.getElementById("player2Name");
        if (player2NameEl) player2NameEl.textContent = this.player2.name;

        const player1GameEl = document.getElementById("player1Game");
        if (player1GameEl) player1GameEl.textContent = result.player1.game;

        const player1SetEl = document.getElementById("player1Set");
        if (player1SetEl) player1SetEl.textContent = result.player1.set;

        const player2GameEl = document.getElementById("player2Game");
        if (player2GameEl) player2GameEl.textContent = result.player2.game;

        const player2SetEl = document.getElementById("player2Set");
        if (player2SetEl) player2SetEl.textContent = result.player2.set;

        const p1ppEl = document.getElementById("player1PP");
        if (p1ppEl) p1ppEl.textContent = this.player1.powerPoints;

        const p2ppEl = document.getElementById("player2PP");
        if (p2ppEl) p2ppEl.textContent = this.player2.powerPoints;

        const p1DamageEl = document.getElementById("player1Damage");
        if (p1DamageEl) p1DamageEl.textContent = this.player1.racket.damage;

        const p2DamageEl = document.getElementById("player2Damage");
        if (p2DamageEl) p2DamageEl.textContent = this.player2.racket.damage;

        this.toggleOptionalColumns();
    };
}

function Rally() {
    this.current = 0;
    this.previous = 0;
    this.difficulty = 0;

    this.add = function(difficulty) {
        this.previous = this.current;
        this.current = parseInt(difficulty, 10);
        this.difficulty = this.current + this.previous;
        return this.difficulty;
    };

    this.reset = function() {
        this.current = 0;
        this.previous = 0;
        this.difficulty = 0;
    };

    this.draw = function() {
        const difficultySpan = document.getElementById("currentShotDifficulty");
        if (difficultySpan) {
            difficultySpan.textContent = " has shot difficulty - " + this.difficulty;
        }
    };
}

function Log() {
    this.dom = document.getElementById("log");

    this.write = function(message) {
        if (!this.dom) {
            return;
        }

        this.dom.insertAdjacentHTML("beforeend", "<p>" + message + "</p>");
        this.dom.scrollTo({
            top: this.dom.scrollHeight,
            behavior: "smooth"
        });
    };
}

function Wimbledungeons(player1Name, player2Name, powerPoints, racketDamage, newServeModalInstance, playAgainModalInstance) {
    this.rules = {
        powerPoints: powerPoints,
        racketDamage: racketDamage
    };

    this.serveOptions = [5, 6, 7, 8, 9, 10];
    this.shotOptions = [
        { label: "Straight", difficulty: 3 },
        { label: "Topspin", difficulty: 5 },
        { label: "Slice", difficulty: 8 },
        { label: "Dropshot", difficulty: 10 }
    ];

    this.log = new Log();
    this.log.write("Building Game Object Please wait");

    this.dice = new Dice();
    this.player1 = new Player(player1Name);
    this.player2 = new Player(player2Name);
    this.player1.opposingPlayer = this.player2;
    this.player2.opposingPlayer = this.player1;

    this.currentPlayer = this.player1;
    this.currentServer = this.player1;
    this.phase = "serve";
    this.controlsDisabled = false;

    this.scoreboard = new Scoreboard(this.player1, this.player2, this);
    this.rally = new Rally();

    this.newServeModal = newServeModalInstance;
    this.playAgainModal = playAgainModalInstance;

    const p1ServingEl = document.getElementById("player1Serving");
    if (p1ServingEl) {
        p1ServingEl.innerHTML = "&times;";
    }

    this.setControlsDisabled = function(disabled) {
        this.controlsDisabled = disabled;
        this.draw();
    };

    this.awardPP = function(player, diceRoll) {
        if (!this.rules.powerPoints) {
            return;
        }

        let ppGained = 0;
        if (diceRoll === 20) {
            ppGained = 2;
        } else if (diceRoll >= 16) {
            ppGained = 1;
        }

        if (ppGained > 0) {
            player.powerPoints += ppGained;
            this.log.write(player.name + " gained " + ppGained + " Power Point(s)! Total: " + player.powerPoints);
        }
    };

    this.pressAdvantage = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            if (difficulty >= 20) {
                this.log.write(player.name + " tried to Press Advantage, but difficulty is already 20 or higher.");
                return difficulty;
            }

            player.powerPoints--;
            let newDifficulty = difficulty + 5;
            if (newDifficulty > 20) {
                newDifficulty = 20;
                this.log.write(player.name + " Pressed the Advantage! Difficulty increased to capped value of 20. PP left: " + player.powerPoints);
            } else {
                this.log.write(player.name + " Pressed the Advantage! Difficulty is now " + newDifficulty + ". PP left: " + player.powerPoints);
            }
            return newDifficulty;
        }

        return difficulty;
    };

    this.calmStorm = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            player.powerPoints--;
            const newDifficulty = Math.max(1, difficulty - 5);
            this.log.write(player.name + " Calmed the Storm! Difficulty is now " + newDifficulty + ". PP left: " + player.powerPoints);
            return newDifficulty;
        }

        return difficulty;
    };

    this.checkHit = function(diceroll, difficulty) {
        if (diceroll >= difficulty) {
            this.log.write("Hit! (Roll: " + diceroll + " vs Difficulty: " + difficulty + ")");
            return true;
        }

        this.log.write("Miss! (Roll: " + diceroll + " vs Difficulty: " + difficulty + ")");
        return false;
    };

    this.racketCheck = function(player, diceRoll) {
        if (!this.rules.racketDamage) {
            return false;
        }

        let damageTaken = 0;
        if (diceRoll === 1) {
            damageTaken = 2;
        } else if (diceRoll <= 5) {
            damageTaken = 1;
        }

        if (damageTaken > 0) {
            for (let i = 0; i < damageTaken; i++) {
                player.racket.damageRacket();
            }

            this.log.write("Racket damaged! Roll: " + diceRoll + ". Damage taken: " + damageTaken + ". Racket health: " + player.racket.damage);

            if (player.racket.damage <= 0) {
                player.racket = new Racket();
                this.log.write(player.name + "'s racket broke! Point lost. New racket provided.");
                return true;
            }
        }

        return false;
    };

    this.changeServer = function() {
        const p1ServingEl = document.getElementById("player1Serving");
        const p2ServingEl = document.getElementById("player2Serving");

        if (this.currentServer === this.player1) {
            this.currentServer = this.player2;
            if (p1ServingEl) p1ServingEl.innerHTML = "";
            if (p2ServingEl) p2ServingEl.innerHTML = "&times;";
        } else {
            this.currentServer = this.player1;
            if (p1ServingEl) p1ServingEl.innerHTML = "&times;";
            if (p2ServingEl) p2ServingEl.innerHTML = "";
        }
    };

    this.changePlayer = function() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
        this.log.write(this.currentPlayer.name + "'s turn.");
    };

    this.animateCourt = function(animationName) {
        const courtArea = document.getElementById("courtArea");
        if (!courtArea) {
            return;
        }

        const classesToClear = [
            "anim-serve-left",
            "anim-serve-right",
            "anim-return-left",
            "anim-return-right",
            "anim-miss-left",
            "anim-miss-right"
        ];

        for (let i = 0; i < classesToClear.length; i++) {
            courtArea.classList.remove(classesToClear[i]);
        }

        if (!animationName) {
            return;
        }

        void courtArea.offsetWidth;
        courtArea.classList.add(animationName);
    };

    this.playServeAnimation = function(server, success) {
        const isLeftServer = server === this.player1;
        if (success) {
            this.animateCourt(isLeftServer ? "anim-serve-left" : "anim-serve-right");
        } else {
            this.animateCourt(isLeftServer ? "anim-miss-right" : "anim-miss-left");
        }
    };

    this.playReturnAnimation = function(player, success) {
        const isLeftPlayer = player === this.player1;
        if (success) {
            this.animateCourt(isLeftPlayer ? "anim-return-right" : "anim-return-left");
        } else {
            this.animateCourt(isLeftPlayer ? "anim-miss-right" : "anim-miss-left");
        }
    };

    this.serve = function(serveDifficulty, pressAdvantage, calmStorm) {
        if (this.controlsDisabled) {
            return;
        }

        const diceRoll = this.dice.roll();
        this.log.write(this.currentServer.name + " serves. Dice Rolled a " + diceRoll);
        this.awardPP(this.currentServer, diceRoll);

        if (this.racketCheck(this.currentServer, diceRoll)) {
            this.log.write("Serve failed due to broken racket.");
            this.playServeAnimation(this.currentServer, false);
            this.scoreboard.addPoint(this.currentServer.opposingPlayer);
            this.changeServer();
            this.startNewServe();
            this.draw();
            return;
        }

        let difficulty = this.rally.add(parseInt(serveDifficulty, 10));

        if (calmStorm) {
            difficulty = this.calmStorm(this.currentServer, difficulty);
        }

        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentServer, difficulty);
        }

        const hitSuccess = this.checkHit(diceRoll, difficulty);

        if (!hitSuccess) {
            this.log.write(this.currentServer.name + " missed the serve.");
            this.playServeAnimation(this.currentServer, false);
            this.scoreboard.addPoint(this.currentServer.opposingPlayer);
            this.changeServer();
            this.startNewServe();
        } else {
            this.log.write(this.currentServer.name + " served successfully.");
            this.playServeAnimation(this.currentServer, true);
            this.currentPlayer = this.currentServer.opposingPlayer;
            this.phase = "rally";
        }

        this.draw();
    };

    this.continueRally = function(shotDifficulty, pressAdvantage, calmStorm) {
        if (this.controlsDisabled) {
            return;
        }

        const diceRoll = this.dice.roll();
        this.log.write(this.currentPlayer.name + " returns. Dice Rolled a " + diceRoll);
        this.awardPP(this.currentPlayer, diceRoll);

        if (this.racketCheck(this.currentPlayer, diceRoll)) {
            this.log.write("Return failed due to broken racket.");
            this.playReturnAnimation(this.currentPlayer, false);
            this.scoreboard.addPoint(this.currentPlayer.opposingPlayer);
            this.startNewServe();
            this.draw();
            return;
        }

        let difficulty = this.rally.add(parseInt(shotDifficulty, 10));

        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentPlayer, difficulty);
        }

        if (calmStorm) {
            difficulty = this.calmStorm(this.currentPlayer, difficulty);
        }

        const hitSuccess = this.checkHit(diceRoll, difficulty);

        if (!hitSuccess) {
            this.log.write(this.currentPlayer.name + " missed the return.");
            this.playReturnAnimation(this.currentPlayer, false);
            this.scoreboard.addPoint(this.currentPlayer.opposingPlayer);
            this.startNewServe();
        } else {
            this.log.write(this.currentPlayer.name + " returned successfully.");
            this.playReturnAnimation(this.currentPlayer, true);
            this.changePlayer();
            this.phase = "rally";
        }

        this.draw();
    };

    this.contiuneRally = this.continueRally;

    this.renderActionControls = function() {
        const actionControlsEl = document.getElementById("actionControls");
        const advancedRulesEl = document.getElementById("advancedRules");

        if (!actionControlsEl || !advancedRulesEl) {
            return;
        }

        if (this.controlsDisabled) {
            actionControlsEl.innerHTML = "<div class=\"alert alert-secondary mb-0\">Match over. Start a new game to continue.</div>";
            advancedRulesEl.innerHTML = "";
            return;
        }

        let actor = this.phase === "serve" ? this.currentServer : this.currentPlayer;

        let heading = "";
        let buttons = "";

        if (this.phase === "serve") {
            heading = actor.name + " to serve";
            for (let i = 0; i < this.serveOptions.length; i++) {
                const value = this.serveOptions[i];
                buttons += "<button type=\"button\" class=\"btn btn-success shot-btn\" data-action=\"serve\" data-difficulty=\"" + value + "\">Serve " + value + "</button>";
            }
        } else {
            heading = actor.name + " to return";
            for (let i = 0; i < this.shotOptions.length; i++) {
                const shot = this.shotOptions[i];
                buttons += "<button type=\"button\" class=\"btn btn-primary shot-btn\" data-action=\"return\" data-difficulty=\"" + shot.difficulty + "\">" + shot.label + " (" + shot.difficulty + ")</button>";
            }
        }

        actionControlsEl.innerHTML =
            "<div class=\"action-heading\">" + heading + "</div>" +
            "<div class=\"action-row\">" + buttons + "</div>";

        if (this.rules.powerPoints) {
            if (actor.powerPoints > 0) {
                advancedRulesEl.innerHTML =
                    "<div class=\"small text-muted\">Power Points: " + actor.powerPoints + "</div>" +
                    "<div class=\"form-check form-check-inline\">" +
                    "<input class=\"form-check-input\" type=\"checkbox\" id=\"pressAdvantage\" value=\"1\">" +
                    "<label class=\"form-check-label\" for=\"pressAdvantage\">Press Advantage</label>" +
                    "</div>" +
                    "<div class=\"form-check form-check-inline\">" +
                    "<input class=\"form-check-input\" type=\"checkbox\" id=\"calmStorm\" value=\"1\">" +
                    "<label class=\"form-check-label\" for=\"calmStorm\">Calm Storm</label>" +
                    "</div>";
            } else {
                advancedRulesEl.innerHTML = "<div class=\"small text-muted\">Power Points: 0</div>";
            }
        } else {
            advancedRulesEl.innerHTML = "";
        }
    };

    this.startNewServe = function() {
        this.phase = "serve";
        this.currentPlayer = this.currentServer;
        this.rally.reset();
        this.renderActionControls();
        this.draw();
    };

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

        this.currentServer = this.player1;
        this.currentPlayer = this.player1;
        this.phase = "serve";
        this.controlsDisabled = false;

        const p1ServingEl = document.getElementById("player1Serving");
        const p2ServingEl = document.getElementById("player2Serving");
        if (p1ServingEl) p1ServingEl.innerHTML = "&times;";
        if (p2ServingEl) p2ServingEl.innerHTML = "";

        this.dice.reset();
        this.startNewServe();
    };

    this.draw = function() {
        const currentPlayerEl = document.getElementById("currentPlayer");
        if (currentPlayerEl) {
            currentPlayerEl.textContent = this.phase === "serve" ? this.currentServer.name : this.currentPlayer.name;
        }

        this.renderActionControls();
        this.scoreboard.draw();
        this.rally.draw();
    };

    this.log.write("GameObject Built game ready");
}
