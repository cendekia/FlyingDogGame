game.module(
    'game.scenes'
)
.require(
    'engine.scene'
)
.body(function() {

SceneGame = game.Scene.extend({
    backgroundColor: 0xb2dcef,
    gapTime: 1500,
    gravity: 2000,
    score: 0,
    cloudSpeedFactor: 1,

    init: function() {
        this.world = new game.World(0, this.gravity);
        
        this.addParallax(400, 'parallax1.png', -50);
        this.addParallax(550, 'parallax2.png', -100);
        this.addParallax(650, 'parallax3.png', -200);

        this.addCloud(100, 100, 'cloud1.png', -50);
        this.addCloud(300, 50, 'cloud2.png', -30);

        this.logo = new Logo();

        this.addCloud(650, 100, 'cloud3.png', -50);
        this.addCloud(700, 200, 'cloud4.png', -40);

        this.addParallax(700, 'bushes.png', -250);
        this.gapContainer = new game.Container();
        this.stage.addChild(this.gapContainer);
        this.addParallax(800, 'ground.png', -300);

        this.player = new Player();
        
        var groundBody = new game.Body({
            position: { x: game.system.width / 2, y: 850 },
            collisionGroup: 0
        });
        var groundShape = new game.Rectangle(game.system.width, 100);
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);

        this.scoreText = new game.BitmapText(this.score.toString(), { font: 'Pixel' });
        this.scoreText.position.x = game.system.width / 2 - this.scoreText.textWidth / 2;
        this.stage.addChild(this.scoreText);

        var text = new game.Sprite('madewithpanda.png', game.system.width / 2, game.system.height - 48, {
            anchor: { x: 0.5, y: 0 }
        });
        this.stage.addChild(text);

        game.audio.musicVolume = 0.2;
        game.audio.playMusic('music');
    },

    spawnGap: function() {
        this.addObject(new Gap());
    },

    addScore: function() {
        this.score++;
        this.scoreText.setText(this.score.toString());
        game.audio.playSound('score');
    },

    addCloud: function(x, y, path, speed) {
        var cloud = new Cloud(path, x, y, { speed: speed });
        this.addObject(cloud);
        this.stage.addChild(cloud);
    },

    addParallax: function(y, path, speed) {
        var parallax = new game.TilingSprite(path);
        parallax.position.y = y;
        parallax.speed.x = speed;
        this.addObject(parallax);
        this.stage.addChild(parallax);
    },

    mousedown: function(event) {
        if (this.ended) return;

        if (game.device.mobile && !event.originalEvent.changedTouches) return;

        if (this.player.body.mass === 0) {
            game.analytics.event('play');
            this.player.body.mass = 1;
            this.logo.remove();
            this.addTimer(this.gapTime, this.spawnGap.bind(this), true);
        }
        this.player.jump();
    },

    showScore: function() {
        var box = new game.Sprite('gameover.png', game.system.width / 2, game.system.height / 2, { anchor: { x: 0.5, y: 0.5 }});

        var highScore = parseInt(game.storage.get('highScore')) || 0;
        if (this.score > highScore) game.storage.set('highScore', this.score);

        var highScoreText = new game.BitmapText(highScore.toString(), { font: 'Pixel' });
        highScoreText.position.x = 27;
        highScoreText.position.y = 43;
        box.addChild(highScoreText);

        var scoreText = new game.BitmapText('0', { font: 'Pixel' });
        scoreText.position.x = highScoreText.position.x;
        scoreText.position.y = -21;
        box.addChild(scoreText);

        game.scene.stage.addChild(box);

        this.restartButton = new game.Sprite('restart.png', game.system.width / 2, game.system.height / 2 + 250, {
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0, y: 0 },
            interactive: true,
            mousedown: function() {
                game.analytics.event('restart');
                game.system.setScene(SceneGame);
            }
        });

        if (this.score > 0) {
            var time = Math.min(100, (1 / this.score) * 1000);
            var scoreCounter = 0;
            this.addTimer(time, function() {
                scoreCounter++;
                scoreText.setText(scoreCounter.toString());
                if (scoreCounter >= game.scene.score) {
                    this.repeat = false;
                    if (game.scene.score > highScore) {
                        game.audio.playSound('highscore');
                        var newBox = new game.Sprite('new.png', -208, 59);
                        box.addChild(newBox);
                    }
                    game.scene.showRestartButton();
                }
            }, true);
        }
        else {
            this.showRestartButton();
        }
    },

    showRestartButton: function() {
        var tween = new game.Tween(this.restartButton.scale)
            .to({ x: 1, y: 1 }, 200)
            .easing(game.Tween.Easing.Back.Out);
        tween.start();
        this.stage.addChild(this.restartButton);
    },

    gameOver: function() {
        var i;
        this.cloudSpeedFactor = 0.2;
        this.ended = true;
        this.timers.length = 0;
        for (i = 0; i < this.objects.length; i++) {
            if (this.objects[i].speed) this.objects[i].speed.x = 0;
        }
        for (i = 0; i < this.world.bodies.length; i++) {
            this.world.bodies[i].velocity.set(0, 0);
        }

        this.addTimer(500, this.showScore.bind(this));

        game.audio.stopMusic();
        game.audio.playSound('explosion');
    }
});

});
