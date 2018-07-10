#Wimbeldungeon

After watching

[![Wimbledungeons: Tabletop Tennis 🎾🎲- CLIFF RICHARD IS CANONICALLY UNCONSCIOUS](http://img.youtube.com/vi/KAd9xVOqBMs/0.jpg)](http://www.youtube.com/watch?v=KAd9xVOqBMs)

I decided to make the game played in javascript

Rules are:

##Wimbledungeons

###by Jonathon Astles

Players select which type of shot they will play, with more difficult shots requiring a higher roll to succeed. When returning a shot, players must beat the difficulty threshold for their opponent's shot added to the shot they have selected.

| Shots | Difficulty threshold |
| ----- | ---------------------|
| Straight | 3 |
| Topspin | 5 |
| Slice | 8 |
| Dropshot | 10 |

When serving, the server can decide how risky to play their serve (i.e. how fast/close to the net). As such they can determine any skill threshold between 5 and 10. Service alternates between games as for normal tennis or for a single game service alternates between shots. Unlike regular tennis, players are not given a second serve.

Standard Tennis scoring applies with 40-40 leading to Deuce, advantage etc.

Doubles can be played. Rules apply as for singles plus the player returning the shot chooses which opponent to aim for.

An example section of a game goes as follows:

Player 1 serves choosing a serve difficulty of 8. They roll a 16 and therefore succeed. Player 2 must now return and chooses to return it straight, they must now roll at least an 11 (serve=8 plus straight return=3). They roll a 15 and therefore succeed. Player 1 must now return and chooses to give it topspin. They must now roll 8 (Straight=3 plus topspin return=5). They roll a 7 and lose the point. Game is now 15-0 to player 2.

Player 2 serves at 5. Rolls a 4, losing the point. The game is now 15-15.

Player 1 serves again at 6. Succeeds by rolling 9. Player 2 returns with a dropshot so must roll at least 16 (serve=6 plus dropshot return=10). They roll an 18. Player 1 returns with a slice and must roll at least 18 (dropshot=10 plus slice return=8). They roll a 7 and lose the point. Game is now 30-15 to player 2.

Etc.

For more advanced rules:

Rackets have a point of damage added if a player rolls a 5 or less. If a critical failure is rolled (i.e. 1) then two points of damage are added. After three points of damage a racket breaks and that player loses the point. A new racket is then given to the player and the game continues.

Any roll above 15 gives the player a point of power. A critical success (i.e. 20) gives the player two points of power. Power can be spent to either reduce the threshold of your return by 5 (Calm in the Storm) or increase the threshold of opponents return by 5 (Press the Advantage). Reducing the threshold can be used even if the threshold has been raised by the use of power. Increasing the threshold is capped at 20. i.e. a natural 20 will still always return a shot. Power is gained even if the player doesn’t return the shot. I.e. rolls a 16 against an 18 


This code is licensed under the GNU GPL see LICENSE.md