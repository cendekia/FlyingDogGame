game.module(
    'game.main'
)
.require(
    'engine.physics',
    'engine.particle',
    'game.assets',
    'game.objects',
    'game.scenes'
)
.body(function() {

game.start();

});
