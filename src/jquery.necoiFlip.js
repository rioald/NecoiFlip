/*!
 * NecoiFlip jQuery Plugin v1.0
 * http://lab.zzune.com
 * https://github.com/rioald/NecoiFlip
 *
 * for Suyeon Kim(Necoiuzu), hadly working on wownet 2013
 *
 * Copyright (c) 2013 zune-seok Moon (zune rioald).
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Wed May 20 01:09:10 2013 +0900
 */

 var NecoiFlip = {
  action: {}
 };

(function($) {

NecoiFlip.model = function(targetContainer, options) {
	"use strict";
	
	var targetList = $(targetContainer);
	var targetElements = $(targetList).children();

	var options = jQuery.extend({
		prevSelector: null,
		nextSelector: null,
		autoStart: false,
		autoDirection: "next",
		autoHoverPause: true,
		autoDelayTime: 4000
	}, options);
	
	var self = this;

	var currentElement = 1;
	var totalCount = targetElements.size();

	var _init = function() {
		// bind auto flip
		if(options.autoStart) {
			auto.startInterval();
			auto.bindEvents();
		}

		// bind click to prev/next selector
		if(options.prevSelector) {
			$(options.prevSelector).bind("click.necoiFlip", function(e) {
				self.prev();

				if(options.autoStart) {
					auto.resetInterval();
				}
			});
		}

		if(options.nextSelector) {
			$(options.nextSelector).bind("click.necoiFlip", function(e) {
				self.next();

				if(options.autoStart) {
					auto.resetInterval();
				}
			});
		}

		if(options.afterInit && options.afterInit instanceof Function) {
			options.afterInit.apply(self);
		}
	};

	var auto = {
		intervalObj: null,
		mouseOverStatus: "leave",

		bindEvents: function() {
			targetList.bind("mouseover.necoiFlip", function(e) {
				if(auto.mouseOverStatus == "over") {
					return;
				}

				auto.mouseOverStatus = "over";
				auto.stopInterval();
			});

			targetList.bind("mouseleave.necoiFlip", function(e) {
				if(auto.mouseOverStatus == "leave") {
					return;
				}

				auto.mouseOverStatus = "leave";
				auto.startInterval();
			});
		},

		startInterval: function() {
			auto.intervalObj = setInterval(function() {
				if(options.autoDirection == "prev") {
					self.prev();
				} else if(options.autoDirection == "next") {
					self.next();
				}
			}, options.autoDelayTime);
		},

		stopInterval: function() {
			clearInterval(auto.intervalObj);
		},

		resetInterval: function() {
			auto.stopInterval();
			auto.startInterval();
		}
	};

	this.getCurrentElement = function() {
		return currentElement;
	};

	this.getTotalCount = function() {
		return totalCount;
	};
	
	this.prev = function (callback) {
		var step = step || 1;

		if (currentElement == 1) {
			currentElement = totalCount;
		} else {
			currentElement = currentElement - step;
		}

		self.showElement(currentElement, callback);

		return false;
	};

	this.next = function (callback) {
		var step = step || 1;

		if (currentElement == totalCount) {
			currentElement = 1;
		} else {
			currentElement = currentElement + step;
		}

		self.showElement(currentElement, callback);

		return false;
	};

	this.showElement = function (element, callback) {
		element = element || 1;

		targetElements.eq(element - 1).show().siblings().hide();

		if(callback && callback instanceof Function) {
			callback.apply(self);
		}
	};

	_init();

	NecoiFlip.action[targetList.attr("id") || Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)] = this;
};



$.fn.necoiFlip = function(options) {
	if (this.length <= 0) {
		return null;
	}

	var maps = [];

	this.each(function(i, v) {
		v.necoiFlip = new NecoiFlip.model(v, options);

		maps.push(v.necoiFlip);
	});

	return this.necoiFlip = maps;
};

})(jQuery);
