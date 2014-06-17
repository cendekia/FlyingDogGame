game.module(
    'game.assets'
)
.require(
    'engine.audio'
)
.body(function() {

game.addAsset('sprites.json');
game.addAsset('font.fnt');

game.addAudio('audio/explosion.m4a', 'explosion');
game.addAudio('audio/jump.m4a', 'jump');
game.addAudio('audio/score.m4a', 'score');
game.addAudio('audio/highscore.m4a', 'highscore');
game.addAudio('audio/music.m4a', 'music');

});
