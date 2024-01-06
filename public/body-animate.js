(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.cabello = function() {
	this.initialize(img.cabello);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,256,256);


(lib.m = function() {
	this.initialize(img.m);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1920,1920);


(lib.pie_2 = function() {
	this.initialize(img.pie_2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,600,470);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.an_TextInput = function(options) {
	this.initialize();
	this._element = new $.an.TextInput(options);
	this._el = this._element.create();
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,22);

p._tick = _tick;
p._handleDrawEnd = _handleDrawEnd;
p._updateVisibility = _updateVisibility;
p.draw = _componentDraw;



(lib.Símbolo74 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.pie_2();
	this.instance.setTransform(0,0,0.0686,0.0502);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo74, new cjs.Rectangle(0,0,41.2,23.6), null);


(lib.Símbolo73 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.pie_2();
	this.instance.setTransform(0,0,0.0671,0.0502);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo73, new cjs.Rectangle(0,0,40.3,23.6), null);


(lib.Símbolo72 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.cabello();
	this.instance.setTransform(44.2,0,0.1727,0.1602,0,0,180);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo72, new cjs.Rectangle(0,0,44.2,41), null);


(lib.Símbolo71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.m();
	this.instance.setTransform(8.75,26.4,0.0094,0.0108,0,155.0271,-24.9439);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo71, new cjs.Rectangle(0,0,25.2,26.4), null);


(lib.Símbolo70 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.m();
	this.instance.setTransform(16.4,26.4,0.0094,0.0108,-155.0271);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo70, new cjs.Rectangle(0,0,25.2,26.4), null);


(lib.Símbolo58 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgDiYQAJBigDBiQAAAGAAAGQAAAJgBAIQgBAcgBAbQgBAJgBAJQAAAEgBAD");
	this.shape.setTransform(0.3846,15.3);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo58, new cjs.Rectangle(-1,-1,2.8,32.6), null);


(lib.Símbolo57 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAEiYQgKBoAEBoQAAAJABAIQABAcACAbQAAAJABAJQAAAEABAD");
	this.shape.setTransform(0.3698,15.3);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo57, new cjs.Rectangle(-1,-1,2.8,32.6), null);


(lib.Símbolo56 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgDiYQABAQACARQAKCIgNCI");
	this.shape.setTransform(0.3797,15.325);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo56, new cjs.Rectangle(-1,-1,2.8,32.7), null);


(lib.Símbolo55 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAEiYQgCAQgBARQgKCIANCI");
	this.shape.setTransform(0.3657,15.325);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo55, new cjs.Rectangle(-1,-1,2.8,32.7), null);


(lib.Símbolo54 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAEiYQgKBpAEBoQAAAIABAIQABAcACAcQAAAJABAJQAAADABAD");
	this.shape.setTransform(0.3698,15.25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo54, new cjs.Rectangle(-1,-1,2.8,32.5), null);


(lib.Símbolo53 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgDiXQAHBSAABSQAAAWgBAXQAAAIgBAIQgBAcgBAbQgBAJgBAJQAAACAAAD");
	this.shape.setTransform(0.3765,15.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo53, new cjs.Rectangle(-1,-1,2.8,32.4), null);


(lib.Símbolo52 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgCiXQAAAPACAQQADAzABA0QAAAVAAAVQgBBAgGA/");
	this.shape.setTransform(0.375,15.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo52, new cjs.Rectangle(-1,-1,2.8,32.4), null);


(lib.Símbolo51 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAEiXQgCAPgBAQQgDAzgBA0QAAAVAAAVQABBAAGA/");
	this.shape.setTransform(0.4125,15.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo51, new cjs.Rectangle(-1,-1,2.8,32.4), null);


(lib.Símbolo50 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AABgjQgEAjAEAk");
	this.shape.setTransform(0.125,3.575);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo50, new cjs.Rectangle(-1,-1,2.3,9.2), null);


(lib.Símbolo49 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAAAkQAEgkgEgj");
	this.shape.setTransform(0.125,3.575);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo49, new cjs.Rectangle(-1,-1,2.3,9.2), null);


(lib.Símbolo48 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAlhZQAFCyhOAB");
	this.shape.setTransform(3.7178,8.975);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo48, new cjs.Rectangle(-1,-1,9.5,20), null);


(lib.Símbolo47 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgkhZQgFCyBOAB");
	this.shape.setTransform(3.7322,8.975);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo47, new cjs.Rectangle(-1,-1,9.5,20), null);


(lib.Símbolo41 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgIjdQACAGABAGQAKBIADBQQAAAIAAAIQAAAWAAAWQAAAggBAhQgCAqgDAsQgCAWgBAWQgCAMgBAM");
	this.shape.setTransform(0.85,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo41, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAIDeQgBgGgBgGQgBgEAAgFQgFgfgCggQgDgngCgpQAAgIAAgIQgBgUAAgUQAAgiACgjQABgqAEgsQABgWACgWQABgMACgM");
	this.shape.setTransform(0.85,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo40, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo39 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAIDeQgBgGgBgGQgBgEAAgFQgFgfgCggQgDgngCgpQAAgIAAgIQgBgTAAgUQAAgiACgkQABgqAEgsQABgWACgWQABgMACgM");
	this.shape.setTransform(0.85,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo39, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo38 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgIjdQACAGABAGQAKBIADBQQAAAIAAAIQAAAXAAAWQAAAggBAgQgCAqgDAsQgCAWgBAWQgCAMgBAM");
	this.shape.setTransform(0.85,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo38, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAJDeQgCgGgBgGQgJhIgEhQQAAgIAAgIQgBg1ACg4QACgqADgsQABgWACgWQABgGABgHQAAgFABgG");
	this.shape.setTransform(0.8469,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo37, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgIjdQACAGABAGQAJBIAEBQQAAAIAAAIQABA1gCA4QgCAqgDAsQgCAWgBAWQgCAMgBAM");
	this.shape.setTransform(0.8531,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo36, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AAJDeQgCgGgBgGQgJhIgEhQQAAgIAAgIQgBg1ACg4QACgqADgsQABgWACgWQABgGABgHQAAgFABgG");
	this.shape.setTransform(0.8469,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo35, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgIjdQACAGABAGQAJBIAEBQQAAAIAAAIQABA1gCA4QgCAqgDAsQgCAWgBAWQgCAMgBAM");
	this.shape.setTransform(0.8531,22.175);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo34, new cjs.Rectangle(-1,-1,3.7,46.4), null);


(lib.Símbolo25 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AACg/QgGBCAGA9");
	this.shape.setTransform(0.1875,6.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo25, new cjs.Rectangle(-1,-1,2.4,14.7), null);


(lib.Símbolo24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AgBg/QAGBCgGA9");
	this.shape.setTransform(0.1625,6.35);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo24, new cjs.Rectangle(-1,-1,2.3,14.7), null);


(lib.Símbolo19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AALkBQgLA/gFBDQgJBsAGB1QAEBAAHBEQACAOACAO");
	this.shape.setTransform(1.1137,25.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo19, new cjs.Rectangle(-1,-1,4.3,53.6), null);


(lib.Símbolo4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AhwBxIAAjhIDhAAIAADhg");
	this.shape.setTransform(11.25,11.25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,22.5,22.5);


(lib.Símbolo79 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo73();
	this.instance.setTransform(20.2,11.8,1,1,0,0,0,20.2,11.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo79, new cjs.Rectangle(0,0,40.3,23.6), null);


(lib.Símbolo78 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo74();
	this.instance.setTransform(20.6,11.8,1,1,0,0,0,20.6,11.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo78, new cjs.Rectangle(0,0,41.2,23.6), null);


(lib.Símbolo77 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo71();
	this.instance.setTransform(12.6,13.2,1,1,0,0,0,12.6,13.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo77, new cjs.Rectangle(0,0,25.2,26.4), null);


(lib.Símbolo76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo70();
	this.instance.setTransform(12.6,13.2,1,1,0,0,0,12.6,13.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo76, new cjs.Rectangle(0,0,25.2,26.4), null);


(lib.Símbolo75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.instance = new lib.Símbolo72();
	this.instance.setTransform(22.1,20.5,1,1,0,0,0,22.1,20.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo75, new cjs.Rectangle(0,0,44.2,41), null);


(lib.Símbolo60 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.p2 = new lib.Símbolo24();
	this.p2.name = "p2";
	this.p2.setTransform(0.1,6.4,1,1,0,0,0,0.1,6.4);

	this.timeline.addTween(cjs.Tween.get(this.p2).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo60, new cjs.Rectangle(-0.1,-0.1,0.6,13), null);


(lib.Símbolo59 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Capa_1
	this.p1 = new lib.Símbolo25();
	this.p1.name = "p1";
	this.p1.setTransform(0.1,6.4,1,1,0,0,0,0.1,6.4);

	this.timeline.addTween(cjs.Tween.get(this.p1).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Símbolo59, new cjs.Rectangle(-0.1,-0.1,0.6,13), null);


// stage content:
(lib.Curpohumanoprueba1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0];
	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		let root = this
		Mejillas = 1
		MejillasX = 50
		Cuello = 1
		CuelloX = 0.03
		Brazos = 1
		BrazosX = 0.05
		Pecho = 1
		PechoX = 0.03
		Estomago = 1
		EstomagoX = 0.05
		Piernas = 1
		PiernasX = 0.05
		
		
		this.MAM.addEventListener("click", plusM);
		
		this.MAC.addEventListener("click", plusC);
		
		this.MAB.addEventListener("click", plusB);
		
		this.MAP.addEventListener("click", plusP);
		
		this.MAE.addEventListener("click", plusE);
		
		this.MAE.addEventListener("click", plusE);
		
		this.MAPI.addEventListener("click", plusPI);
		
		
		
		function plusM() {
			var name = document.getElementById("cabezaInput").value;
			// 15 -> 30
			// 20 -> 40
			Mejillas = 1 +(name/50)
		    root.m1.x= 291 -(name/10)
			root.m2.x= 304 +(name/10)
			root.m1.scaleX= Mejillas
			root.m2.scaleX= Mejillas
			
		}
		
		function plusC() {
			var name = document.getElementById("cuelloInput").value;
			Cuello = 1 + (name/15)
			root.c1.x= 292.5 -(name/10)
			root.c2.x= 302 +(name/10)
			root.c1.scaleX= Cuello
			root.c2.scaleX= Cuello
		}
		
		function plusB() {
			var name = document.getElementById("brazosInput").value;
			Brazos = 1 + (name/15)
			root.b1.x= 265 -(name/10)
			root.b3.x= 265 -(name/10)
			root.b2.x= 273 +(name/10)
			root.b4.x= 273 +(name/10)
			root.b5.x= 323 -(name/10)
			root.b7.x= 323 -(name/10)
			root.b6.x= 331 +(name/10)
			root.b8.x= 331 +(name/10)
			root.b1.scaleX= Brazos
			root.b2.scaleX= Brazos
			root.b3.scaleX= Brazos
			root.b4.scaleX= Brazos
			root.b5.scaleX= Brazos
			root.b6.scaleX= Brazos
			root.b7.scaleX= Brazos
			root.b8.scaleX= Brazos
		}
		
		function plusP() {
			var name = document.getElementById("pechoInput").value;
			Pecho = 1 + (name/15)
			root.p1.x= 282 -(name/10)
			root.p2.x= 315 +(name/10)
			root.p1.scaleX= Pecho
			root.p2.scaleX= Pecho
		}
		
		function plusE() {
			var name = document.getElementById("estomagoInput").value;
			Estomago = 1 + (name/15)
			root.e1.x= 281 -(name/10)
			root.e2.x= 316 +(name/10)
			root.e1.scaleX= Estomago
			root.e2.scaleX= Estomago
		}
		
		
		function plusPI() {
			var name = document.getElementById("piernasInput").value;
			Piernas = 1 + (name/15)
			root.pi1.x= 280 -(name/10)
			root.pi3.x= 280 -(name/10)
			root.pi2.x= 293 +(name/10)
			root.pi4.x= 293 +(name/10)
			root.pi5.x= 304 -(name/10)
			root.pi7.x= 304 -(name/10)
			root.pi6.x= 317 +(name/10)
			root.pi8.x= 317 +(name/10)
			root.pi1.scaleX= Piernas
			root.pi2.scaleX= Piernas
			root.pi3.scaleX= Piernas
			root.pi4.scaleX= Piernas
			root.pi5.scaleX= Piernas
			root.pi6.scaleX= Piernas
			root.pi7.scaleX= Piernas
			root.pi8.scaleX= Piernas
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// capa
	this.instance = new lib.Símbolo79();
	this.instance.setTransform(286,244.8,1,1,0,0,0,20.2,11.8);

	this.instance_1 = new lib.Símbolo78();
	this.instance_1.setTransform(309.4,244.8,1,1,0,0,0,20.6,11.8);

	this.instance_2 = new lib.Símbolo77();
	this.instance_2.setTransform(328.3,146.75,1,1,0,0,0,12.6,13.2);

	this.instance_3 = new lib.Símbolo76();
	this.instance_3.setTransform(268.6,147.35,1,1,0,0,0,12.6,13.2);

	this.instance_4 = new lib.Símbolo75();
	this.instance_4.setTransform(294.9,37.5,1,1,0,0,0,22.1,20.5);

	this.MAE = new lib.Símbolo4("synched",0);
	this.MAE.name = "MAE";
	this.MAE.setTransform(127.55,212.8,1,1,0,0,0,11.2,11.2);

	this.MAPI = new lib.Símbolo4("synched",0);
	this.MAPI.name = "MAPI";
	this.MAPI.setTransform(223.1,213.6,1,1,0,0,0,11.2,11.2);

	this.MAP = new lib.Símbolo4("synched",0);
	this.MAP.name = "MAP";
	this.MAP.setTransform(223.1,146.15,1,1,0,0,0,11.2,11.2);

	this.piernasInput = new lib.an_TextInput({'id': 'piernasInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.piernasInput.name = "piernasInput";
	this.piernasInput.setTransform(185.75,212.65,0.3134,0.4144,0,0,0,50.1,11.1);

	this.estomagoInput = new lib.an_TextInput({'id': 'estomagoInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.estomagoInput.name = "estomagoInput";
	this.estomagoInput.setTransform(90.2,211.4,0.3134,0.4144,0,0,0,50.1,11.1);

	this.pechoInput = new lib.an_TextInput({'id': 'pechoInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.pechoInput.name = "pechoInput";
	this.pechoInput.setTransform(185.5,144.45,0.3134,0.4144,0,0,0,50.1,11.1);

	this.brazosInput = new lib.an_TextInput({'id': 'brazosInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.brazosInput.name = "brazosInput";
	this.brazosInput.setTransform(90.35,147.05,0.3134,0.4144,0,0,0,50.1,11.1);

	this.cuelloInput = new lib.an_TextInput({'id': 'cuelloInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.cuelloInput.name = "cuelloInput";
	this.cuelloInput.setTransform(185.2,78.15,0.3134,0.4144,0,0,0,50.1,11.1);

	this.cabezaInput = new lib.an_TextInput({'id': 'cabezaInput', 'value':'', 'disabled':false, 'visible':true, 'class':'ui-textinput'});

	this.cabezaInput.name = "cabezaInput";
	this.cabezaInput.setTransform(90.35,77.6,0.3134,0.4144,0,0,0,50.1,11.1);

	this.text = new cjs.Text("PIERNAS", "12px 'Times New Roman'");
	this.text.lineHeight = 15;
	this.text.lineWidth = 51;
	this.text.parent = this;
	this.text.setTransform(175.65,174.9);

	this.text_1 = new cjs.Text("ESTOMAGO", "12px 'Times New Roman'");
	this.text_1.lineHeight = 15;
	this.text_1.lineWidth = 67;
	this.text_1.parent = this;
	this.text_1.setTransform(73,174.9);

	this.text_2 = new cjs.Text("PECHO", "12px 'Times New Roman'");
	this.text_2.lineHeight = 15;
	this.text_2.lineWidth = 51;
	this.text_2.parent = this;
	this.text_2.setTransform(176.2,111.1);

	this.text_3 = new cjs.Text("BRAZOS", "12px 'Times New Roman'");
	this.text_3.lineHeight = 15;
	this.text_3.lineWidth = 51;
	this.text_3.parent = this;
	this.text_3.setTransform(79.95,111.55);

	this.text_4 = new cjs.Text("CUELLO", "12px 'Times New Roman'");
	this.text_4.lineHeight = 15;
	this.text_4.lineWidth = 51;
	this.text_4.parent = this;
	this.text_4.setTransform(176.2,45.45);

	this.text_5 = new cjs.Text("CABEZA", "12px 'Times New Roman'");
	this.text_5.lineHeight = 15;
	this.text_5.lineWidth = 51;
	this.text_5.parent = this;
	this.text_5.setTransform(79.95,45.45);

	this.p2 = new lib.Símbolo60();
	this.p2.name = "p2";
	this.p2.setTransform(314.6,81.95,1,1,0,0,0,0.1,6.4);

	this.p1 = new lib.Símbolo59();
	this.p1.name = "p1";
	this.p1.setTransform(281.75,81.3,1,1,0,0,0,0.1,6.4);

	this.b8 = new lib.Símbolo58();
	this.b8.name = "b8";
	this.b8.setTransform(330.7,121.3,1,1,0,0,0,0.4,15.3);

	this.b7 = new lib.Símbolo57();
	this.b7.name = "b7";
	this.b7.setTransform(322.4,121.3,1,1,0,0,0,0.4,15.3);

	this.b6 = new lib.Símbolo56();
	this.b6.name = "b6";
	this.b6.setTransform(330.55,88.25,1,1,0,0,0,0.4,15.3);

	this.b5 = new lib.Símbolo55();
	this.b5.name = "b5";
	this.b5.setTransform(322.2,88.25,1,1,0,0,0,0.4,15.3);

	this.b3 = new lib.Símbolo54();
	this.b3.name = "b3";
	this.b3.setTransform(264.7,121.3,1,1,0,0,0,0.4,15.2);

	this.b4 = new lib.Símbolo53();
	this.b4.name = "b4";
	this.b4.setTransform(273,121.3,1,1,0,0,0,0.4,15.2);

	this.b2 = new lib.Símbolo52();
	this.b2.name = "b2";
	this.b2.setTransform(272.85,88.5,1,1,0,0,0,0.4,15.2);

	this.b1 = new lib.Símbolo51();
	this.b1.name = "b1";
	this.b1.setTransform(264.45,88.5,1,1,0,0,0,0.4,15.2);

	this.c1 = new lib.Símbolo50();
	this.c1.name = "c1";
	this.c1.setTransform(292.5,57.9,1,1,0,0,0,0.1,3.6);

	this.c2 = new lib.Símbolo49();
	this.c2.name = "c2";
	this.c2.setTransform(302.1,57.95,1,1,0,0,0,0.1,3.6);

	this.m2 = new lib.Símbolo48();
	this.m2.name = "m2";
	this.m2.setTransform(303.45,43.95,1,1,0,0,0,3.7,9);

	this.m1 = new lib.Símbolo47();
	this.m1.name = "m1";
	this.m1.setTransform(291.15,43.95,0.92,1,0,0,0,3.7,9);

	this.MAB = new lib.Símbolo4("synched",0);
	this.MAB.name = "MAB";
	this.MAB.setTransform(127.95,149.45,1,1,0,0,0,11.2,11.2);

	this.pi8 = new lib.Símbolo41();
	this.pi8.name = "pi8";
	this.pi8.setTransform(316.15,208.05,1,1,0,0,0,0.8,22.2);

	this.pi7 = new lib.Símbolo40();
	this.pi7.name = "pi7";
	this.pi7.setTransform(303.35,208.15,1,1,0,0,0,0.8,22.2);

	this.pi3 = new lib.Símbolo39();
	this.pi3.name = "pi3";
	this.pi3.setTransform(280.55,208.05,1,1,0,0,0,0.8,22.2);

	this.pi4 = new lib.Símbolo38();
	this.pi4.name = "pi4";
	this.pi4.setTransform(293.35,207.95,1,1,0,0,0,0.8,22.2);

	this.pi1 = new lib.Símbolo37();
	this.pi1.name = "pi1";
	this.pi1.setTransform(280.35,161,1,1,0,0,0,0.8,22.2);

	this.pi2 = new lib.Símbolo36();
	this.pi2.name = "pi2";
	this.pi2.setTransform(292.9,160.6,1,1,0,0,0,0.8,22.2);

	this.pi5 = new lib.Símbolo35();
	this.pi5.name = "pi5";
	this.pi5.setTransform(303.15,161.1,1,1,0,0,0,0.8,22.2);

	this.pi6 = new lib.Símbolo34();
	this.pi6.name = "pi6";
	this.pi6.setTransform(315.7,160.7,1,1,0,0,0,0.8,22.2);

	this.e2 = new lib.Símbolo19();
	this.e2.name = "e2";
	this.e2.setTransform(315.6,111.95,1,0.8605,0,0,180,1.1,25.9);

	this.e1 = new lib.Símbolo19();
	this.e1.name = "e1";
	this.e1.setTransform(280.95,111.45,1,0.8605,0,0,0,1.1,25.9);

	this.MAC = new lib.Símbolo4("synched",0);
	this.MAC.name = "MAC";
	this.MAC.setTransform(222.55,79.55,1,1,0,0,0,11.2,11.2);

	this.MAM = new lib.Símbolo4("synched",0);
	this.MAM.name = "MAM";
	this.MAM.setTransform(128.75,78.25,1,1,0,0,0,11.2,11.2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.3,1,1).p("AlEAtQAWg9AvgNQAwgNAhgBQAhgCAaADQAZACACAAAFFAtQgWg8gvgNQgwgOghgBQghgBgaACQgZADgCAA");
	this.shape.setTransform(297.225,65.9469);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.MAM},{t:this.MAC},{t:this.e1},{t:this.e2},{t:this.pi6},{t:this.pi5},{t:this.pi2},{t:this.pi1},{t:this.pi4},{t:this.pi3},{t:this.pi7},{t:this.pi8},{t:this.MAB},{t:this.m1},{t:this.m2},{t:this.c2},{t:this.c1},{t:this.b1},{t:this.b2},{t:this.b4},{t:this.b3},{t:this.b5},{t:this.b6},{t:this.b7},{t:this.b8},{t:this.p1},{t:this.p2},{t:this.text_5},{t:this.text_4},{t:this.text_3},{t:this.text_2},{t:this.text_1},{t:this.text},{t:this.cabezaInput},{t:this.cuelloInput},{t:this.brazosInput},{t:this.pechoInput},{t:this.estomagoInput},{t:this.piernasInput},{t:this.MAP},{t:this.MAPI},{t:this.MAE},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(346,217,-5.100000000000023,39.60000000000002);
// library properties:
lib.properties = {
	id: 'D85F4DDA4BCE1240AC82ACC57A6E4937',
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/cabello.png", id:"cabello"},
		{src:"images/m.png", id:"m"},
		{src:"images/pie_2.png", id:"pie_2"},
		{src:"https://code.jquery.com/jquery-3.4.1.min.js", id:"lib/jquery-3.4.1.min.js"},
		{src:"components/sdk/anwidget.js", id:"sdk/anwidget.js"},
		{src:"components/ui/src/textinput.js", id:"an.TextInput"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['D85F4DDA4BCE1240AC82ACC57A6E4937'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
function _updateVisibility(evt) {
	var parent = this.parent;
	var detach = this.stage == null || this._off || !parent;
	while(parent) {
		if(parent.visible) {
			parent = parent.parent;
		}
		else{
			detach = true;
			break;
		}
	}
	detach = detach && this._element && this._element._attached;
	if(detach) {
		this._element.detach();
		this.dispatchEvent('detached');
		stage.removeEventListener('drawstart', this._updateVisibilityCbk);
		this._updateVisibilityCbk = false;
	}
}
function _handleDrawEnd(evt) {
	if(this._element && this._element._attached) {
		var props = this.getConcatenatedDisplayProps(this._props), mat = props.matrix;
		var tx1 = mat.decompose(); var sx = tx1.scaleX; var sy = tx1.scaleY;
		var dp = window.devicePixelRatio || 1; var w = this.nominalBounds.width * sx; var h = this.nominalBounds.height * sy;
		mat.tx/=dp;mat.ty/=dp; mat.a/=(dp*sx);mat.b/=(dp*sx);mat.c/=(dp*sy);mat.d/=(dp*sy);
		this._element.setProperty('transform-origin', this.regX + 'px ' + this.regY + 'px');
		var x = (mat.tx + this.regX*mat.a + this.regY*mat.c - this.regX);
		var y = (mat.ty + this.regX*mat.b + this.regY*mat.d - this.regY);
		var tx = 'matrix(' + mat.a + ',' + mat.b + ',' + mat.c + ',' + mat.d + ',' + x + ',' + y + ')';
		this._element.setProperty('transform', tx);
		this._element.setProperty('width', w);
		this._element.setProperty('height', h);
		this._element.update();
	}
}

function _tick(evt) {
	var stage = this.stage;
	stage&&stage.on('drawend', this._handleDrawEnd, this, true);
	if(!this._updateVisibilityCbk) {
		this._updateVisibilityCbk = stage.on('drawstart', this._updateVisibility, this, false);
	}
}
function _componentDraw(ctx) {
	if(this._element && !this._element._attached) {
		this._element.attach($('#dom_overlay_container'));
		this.dispatchEvent('attached');
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;