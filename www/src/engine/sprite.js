/**
    @module sprite
    @namespace game
**/
game.module(
    'engine.sprite'
)
.require(
    'engine.renderer'
)
.body(function() {
'use strict';

/**
    http://www.goodboydigital.com/pixijs/docs/classes/Sprite.html
    @class Sprite
    @constructor
    @param {String} id
    @param {Number} [x]
    @param {Number} [y]
    @param {Object} [settings]
**/
game.Sprite = PIXI.Sprite.extend({
    debugDraw: true,

    init: function(id, x, y, settings) {
        if (typeof id === 'string') {
            id = game.paths[id] || id;
            id = game.Texture.fromFrame(id);
        }
        this._super(id);

        game.merge(this, settings);

        if (typeof x === 'number') this.position.x = x;
        if (typeof y === 'number') this.position.y = y;

        // auto bind touch events for mobile
        if (game.device.mobile && !this.tap && this.click) this.tap = this.click;
        if (game.device.mobile && !this.touchmove && this.mousemove) this.touchmove = this.mousemove;
        if (game.device.mobile && !this.touchstart && this.mousedown) this.touchstart = this.mousedown;
        if (game.device.mobile && !this.touchend && this.mouseup) this.touchend = this.mouseup;
        if (game.device.mobile && !this.touchendoutside && this.mouseupoutside) this.touchendoutside = this.mouseupoutside;
    },

    setTexture: function(id) {
        if (typeof id === 'string') {
            id = game.paths[id] || id;
            id = game.Texture.fromFrame(id);
        }
        this._super(id);
    },

    /**
        Remove sprite from it's parent.
        @method remove
    **/
    remove: function() {
        if (this.parent) this.parent.removeChild(this);
    },

    addChild: function(obj) {
        this._super(obj);
        if (game.debugDraw && obj.interactive) game.debugDraw.addSprite(obj);
    },

    /**
        Add sprite to container.
        @method addTo
        @param {game.Container} container
    **/
    addTo: function(container) {
        container.addChild(this);
        return this;
    }
});

/**
    Spine animation.
    @class Spine
    @constructor
    @param {String} id
    @param {Object} [settings]
**/
game.Spine = PIXI.Spine.extend({
    init: function(id, settings) {
        this._super(game.paths[id] || id);
        game.merge(this, settings);
    },

    /**
        Play animation.
        @method play
        @param {String} anim Name of animation.
        @param {Boolean} loop Animation looping.
        @param {Boolean} after Start after current animation.
    **/
    play: function(anim, loop, after) {
        if (after) this.state.addAnimationByName(anim, !!loop);
        else this.state.setAnimationByName(anim, !!loop);
    },

    /**
        Mix two animations for smooth transition.
        @method mix
        @param {String} from Animation name to mix from.
        @param {String} to Animation name to mix to.
        @param {Number} value Percent of mix.
    **/
    mix: function(from, to, value) {
        this.stateData.setMixByName(from, to, value / 100);
    }
});

/**
    Sprite container.
    http://www.goodboydigital.com/pixijs/docs/classes/DisplayObjectContainer.html
    @class Container
**/
game.Container = PIXI.DisplayObjectContainer.extend({
    debugDraw: true,
    
    /**
        Remove container from it's parent.
        @method remove
    **/
    remove: function() {
        if (this.parent) this.parent.removeChild(this);
    },

    /**
        Add object to container.
        @method addChild
    **/
    addChild: function(obj) {
        this._super(obj);
        if (game.debugDraw && obj.interactive && obj.debugDraw) game.debugDraw.addSprite(obj);
    },

    addTo: function(container) {
        container.addChild(this);
        return this;
    }
});

game.Texture = PIXI.Texture.extend();
game.Texture.fromImage = function(id, crossorigin) {
    id = game.paths[id] || id;
    return PIXI.Texture.fromImage(id, crossorigin);
};
game.Texture.fromCanvas = PIXI.Texture.fromCanvas;
game.Texture.fromFrame = PIXI.Texture.fromFrame;

/**
    Tiling sprite.
    http://www.goodboydigital.com/pixijs/docs/classes/TilingSprite.html
    @class TilingSprite
    @constructor
    @param {String|game.Texture} texture
    @param {Number} width
    @param {Number} height
    @param {Object} [settings]
**/
game.TilingSprite = PIXI.TilingSprite.extend({
    speed: { x: 0, y: 0 },

    init: function(path, width, height, settings) {
        path = game.paths[path] || path;
        var texture = path instanceof PIXI.Texture ? path : PIXI.Texture.fromFrame(this.path || path);
        this._super(texture, width || texture.width, height || texture.height);
        game.merge(this, settings);
    },

    update: function() {
        this.tilePosition.x += this.speed.x * game.system.delta;
        this.tilePosition.y += this.speed.y * game.system.delta;
    },

    addTo: function(container) {
        container.addChild(this);
        return this;
    }
});

/**
    Sprite animation.
    http://www.goodboydigital.com/pixijs/docs/classes/MovieClip.html
    @class Animation
    @constructor
    @param {Array} textures
**/
game.Animation = PIXI.MovieClip.extend({
    init: function() {
        var frames = Array.prototype.slice.call(arguments);

        var textures = [];
        for (var i = 0; i < frames.length; i++) {
            textures.push(game.Texture.fromImage(frames[i]));
        }

        this._super(textures);
    }
});

});
