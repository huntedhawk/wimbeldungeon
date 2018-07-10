function racket() {
    this.damage = 5;
    this.damageRacket = function () {
        this.damage --;
        return this.damage;
    }
}
function player(name,teamName) {
    this.name = name;
    this.racket = new racket();
    this.powerPoints = 0;
    this.team = teamName;
}
function team(teamName) {
    this.name = teamName;
    this.game = 0;
    this.set = 0;
    this.players = [];
    this.addPlayer = function (name) {
        this.players.push(new player(name,this.name))
    }
}
var diceTemp;
function dice() {
    this.roll = function () {
        result =  Math.floor(Math.random()*20+1);
        diceTemp = this;
        diceTemp.die.addClass('rolling');
        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(function () {
            diceTemp.die.removeClass('rolling')
            diceTemp.rollTo(result);
        },3000);
        return result;
    }
    this.die = $('.die');
    this.sides = 20;
    this.rollTo = function () {
        clearTimeout(this.timeoutId);
        this.die.attr('data-face',result);

    }
    this.reset = function () {
        this.die.data('face',null).removeClass('rolling');
    }
}
function scoreboard() {

    this.currentScore = function (team1,team2) {
        var result = {
            team1:{
                game:team1.game,
                set:team1.set
            },
            team2:{
                game:team2.game,
                set:team2.set
            }
        };
        return result;

    };
    this.addPoint = function(servingteam,oposingteam)
    {
        servingteam.game = servingteam.game + 10;
        console.log('point to ' + servingteam.name);
        if(servingteam.game >= 40 && servingteam.game >= oposingteam.game+20)
        {
            servingteam.set++;
            console.log('Game point to ' + servingteam.name);
            servingteam.game = 0;
            oposingteam.game = 0;

        }
        if(servingteam.set >= 6 && servingteam.set > oposingteam.set+2)
        {
            console.log('Match to ' + servingteam.name);
        }



    }

}
function Wimbledungeons(powerPoints,racketDamage) {


    this.rules = {
        powerPoints:powerPoints,
        racketDamage:racketDamage
    };
    this.dice = new dice();
    this.team1 = new team('team1');
    this.team2 = new team('team2');
    this.scoreboard = new scoreboard(this.team1,this.team2);
    this.rally = 0;
    this.awardPP = function (player,diceRoll) {
        if(diceRoll == 20)
        {
            player.powerPoints++;
        }
        if(diceRoll >= 16)
        {
            player.powerPoints++;
            console.log("Power Points awarded to " + player.name);
        }
    }
    this.pressAdvantage = function (player,difficulty) {
        if(this.rules.powerPoints && player.powerPoints > 0)
        {
            difficulty = difficulty+5;
            player.powerPoints--;
            console.log('Advanated pressed difficulty is now ' + difficulty)

        }
        return difficulty;

    };
    this.checkHit = function (diceroll,difficulty) {
        if(diceroll == 20)
        {
            console.log('Critical success nat 20')
            return true;
        }
        else if(diceroll >= difficulty)
        {
            console.log('hit the ball');
            return true;
        }
        else
        {
            console.log('missed the ball');
            return false;
        }

    };
    this.calmStorm = function (player,difficulty) {
        if(this.rules.powerPoints && player.powerPoints > 0)
        {
            difficulty = difficulty-5;
            player.powerPoints--;
            console.log('Storm Calmed difficulty is now ' + difficulty);
        }
        return difficulty;

    };
    this.racketCheck = function (player,diceRoll) {
        if(diceRoll <= 5 && this.rules.racketDamage)
        {
            player.racket.damageRacket();
            console.log('racket damaged racket is now at ' + player.racket.damage);
            if(player.racket.damage < 1)
            {
                player.racket = new racket();
                console.log('racket broke new racket given to player and point missed');
                return true;
            }
            return false;

        }
        else
        {
            return false;
        }
    };
    this.serve = function (serveDifficulty,shotDifficulty,servingPlayer,opossingPlayer,calmStorm) {
        var diceRoll = this.dice.roll();
        console.log('Dice Rolled a ' + diceRoll);
        this.awardPP(servingPlayer,diceRoll);
        this.rally = serveDifficulty + shotDifficulty;
        difficulty = this.rally;
        if(calmStorm)
        {
            difficulty = this.calmStorm(servingPlayer,difficulty);
        }
        if(this.racketCheck(servingPlayer,diceRoll))
        {

            return false
        }
        result = this.checkHit(diceRoll,difficulty);
        if(!result)
        {
            this.scoreboard.addPoint(this[opossingPlayer.team],this[servingPlayer.team]);
        }

        return result;
    };
    this.contiuneRally = function (shotDifficulty,servingPlayer,opossingPlayer,pressAdvantage,calmStorm) {
        var diceRoll = this.dice.roll();
        console.log('Dice Rolled a ' + diceRoll);
        var difficulty = this.rally + shotDifficulty;
        this.rally = difficulty;
        if(pressAdvantage)
        {
            difficulty = this.pressAdvantage(servingPlayer,difficulty);

        }
        if(calmStorm)
        {
            difficulty = this.calmStorm(servingPlayer,difficulty);
        }
        result = this.checkHit(diceRoll,difficulty);
        if(!result)
        {
            this.scoreboard.addPoint(this[opossingPlayer.team],this[servingPlayer.team]);
        }

        return result;
    }
};
