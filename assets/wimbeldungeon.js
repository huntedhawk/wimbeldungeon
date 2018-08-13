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
    $("#dice-mat").html(
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
    this.roll = function() {
        let result = Math.floor(Math.random() * 20 + 1);
        this.rollTo(result);
        return result;
    };
    this.die = $(".die");
    this.sides = 20;
    this.rollTo = function(result) {
        this.die.attr("data-face", result);
    };
    this.reset = function() {
        this.die.data("face", null).removeClass("rolling");
    };
}
function Scoreboard(player1,player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.log = new Log();
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
        switch (player.game) {
            case 0:
                player.game = 15;
                break;
            case 15:
                player.game = 30;
                break;
            case 30:
                player.game = 40;
                break;
            case 40:
                player.game = "Advantage";
                if (player.opposingPlayer.game === "Advantage") {
                    player.opposingPlayer.game = 40;
                }
                break;
            case "Advantage":
                player.game = 0;
                player.opposingPlayer.game = 0;
                player.set++;
                this.log.write('game to ' + player.name);
                break;
        }
        this.log.write("point to " + player.name);

        if (player.set === 2) {
            this.log.write("Match to " + player.name);
            this.player1.game = 0;
            this.player1.set = 0;
            this.player1.match = 0;
            this.player2.game = 0;
            this.player2.set = 0;
            this.player1.racket = new Racket();
            this.player2.racket = new Racket();
            }
    };
    this.draw = function () {
        let result = this.currentScore()
        $('#player1Name').html(this.player1.name);
        $('#player2Name').html(this.player2.name);
        $('#player1Game').html(result.player1.game);
        $('#player1Set').html(result.player1.set);
        $('#player2Game').html(result.player2.game);
        $('#player2Set').html(result.player2.set);

    }
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
        $('#currentShotDifficulty').html(" has shot difficulty - " + this.difficulty);
    }
}
function Log() {
    this.dom = $('#log');
    this.write = function (message) {
        this.dom.append("<p>" + message + "</p>");
        let height = this.dom.get(0).scrollHeight;
        this.dom.animate({
            scrollTop:height
        },500)
    }

}
function Wimbledungeons(player1Name,player2Name,powerPoints, racketDamage) {
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
    this.scoreboard = new Scoreboard(this.player1,this.player2);
    this.scoreboard.currentPlayer = this.currentPlayer;
    this.rally = new Rally();
    $('#player1Serving').html('&times;');
    this.awardPP = function(player, diceRoll) {
        if (diceRoll == 20) {
            player.powerPoints++;
        }
        if (diceRoll >= 16) {
            player.powerPoints++;
            this.log.write("Power Points awarded to " + player.name);
        }
    };
    this.pressAdvantage = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            difficulty = difficulty + 5;
            player.powerPoints--;
            this.log.write("Advanated pressed difficulty is now " + difficulty);
        }
        return difficulty;
    };
    this.checkHit = function(diceroll, difficulty) {
        if (diceroll === 20) {
            this.log.write("Critical success nat 20");
            return true;
        } else if (diceroll >= difficulty) {
            this.log.write("hit the ball");
            return true;
        } else {
            this.log.write("missed the ball");
            return false;
        }
    };
    this.calmStorm = function(player, difficulty) {
        if (this.rules.powerPoints && player.powerPoints > 0) {
            difficulty = difficulty - 5;
            player.powerPoints--;
            this.log.write("Storm Calmed difficulty is now " + difficulty);
        }
        return difficulty;
    };
    this.racketCheck = function(player, diceRoll) {
        if (diceRoll <= 5 && this.rules.racketDamage) {
            player.racket.damageRacket();
            this.log.write("racket damaged racket is now at " + player.racket.damage);
            if (player.racket.damage < 1) {
                player.racket = new Racket();
                this.log.write("racket broke new racket given to player and point missed");
                return true;
            }
            return false;
        } else {
            return false;
        }
    };
    this.changeServer = function () {
        if(this.currentServer === this.player1)
        {
            this.currentServer = this.player2;
            $('#player2Serving').html('&times;');
            $('#player1Serving').html('');
        }
        else
        {
            this.currentServer = this.player1;
            $('#player1Serving').html('&times;');
            $('#player2Serving').html('');
        }
    };
    this.changePlayer = function () {
        if(this.currentPlayer === this.player1)
        {
            this.currentPlayer = this.player2;
            this.scoreboard.currentPlayer = this.player2;
        }
        else
        {
            this.currentPlayer = this.player1;
            this.currentPlayer = this.player1;
        }
    };
    this.serve = function(
        serveDifficulty,
        pressAdvantage,
        calmStorm
    ) {

        this.rally = new Rally();
        const diceRoll = this.dice.roll();
        this.log.write("Dice Rolled a " + diceRoll);
        this.awardPP(this.currentServer, diceRoll);
        let difficulty = this.rally.add(serveDifficulty);
        if (calmStorm) {
            difficulty = this.calmStorm(this.currentServer, difficulty);
        }
        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentPlayer, difficulty);
        }
        if (this.racketCheck(this.currentServer, diceRoll)) {
            return false;
        }
        let result = this.checkHit(diceRoll, difficulty);
        if (!result) {
            this.scoreboard.addPoint(this.currentServer.opposingPlayer);
            $('#continueRally').prop('disabled',true);
            $('#newServe').on('hidden.bs.modal',function (e) {
                gameObj.startNewServe();

            })
            this.changeServer();
        }
        this.currentPlayer = this.currentServer;
        this.changePlayer();
        this.draw();
    };
    this.contiuneRally = function(
        shotDifficulty,
        pressAdvantage,
        calmStorm
    ) {
        const diceRoll = this.dice.roll();
        this.log.write("Dice Rolled a " + diceRoll);
        let difficulty = this.rally.add(shotDifficulty);
        if (pressAdvantage) {
            difficulty = this.pressAdvantage(this.currentPlayer, difficulty);
        }
        if (calmStorm) {
            difficulty = this.calmStorm(this.currentPlayer, difficulty);
        }
        let result = this.checkHit(diceRoll, difficulty);
        if (!result) {
            this.scoreboard.addPoint(this.currentPlayer.opposingPlayer);
            $('#continueRally').prop('disabled',true);
            this.changeServer();
            this.startNewServe();
        }
        this.changePlayer();
        this.draw();
    };
    this.startNewServe = function () {
        $('#newServe').off('hidden.bs.modal');
        $('#newServe').find('.modal-title').html(this.currentServer.name + ' serving');
        $('#newServe').modal({backdrop:'static',keyboard:false});
        $('#continueRally').prop('disabled',false);
    };
    this.draw = function () {
        $('#advancedRules').html('');
        $('#serveAdanced').html('');
        if(this.rules.powerPoints)
        {
            $('#advancedRules').append('<input type=checkbox id=pressAdvantage><label for="pressAdvantage">Press the advantage</label><br><input type="checkbox" id="calmStorm"><label for="calmStorm">Calm the storm</label>');
            $('#serveAdanced').append('<input type=checkbox id=pressAdvantageServe><label for="pressAdvantageServe">Press the advantage</label><br><input type="checkbox" id="calmStormServe"><label for="calmStormServe">Calm the storm</label>');
        };

        $('#currentPlayer').html(this.currentPlayer.name);
        this.scoreboard.draw();
        this.rally.draw();
    };
    this.log.write('GameObject Built game ready');
}
