/*!
 * NecoiFlip jQuery Plugin v1.1
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

var NecoiFlip;

(function($) {

/**
 * String.prototype.trim()
 */
if(!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g,'');
    };
}

/**
 * NecoiFlip 객체
 * @class
 * @param targetContainer
 * @param options
 * @constructor
 */
NecoiFlip = function(targetContainer, options) {
	"use strict";
	
	var targetList = $(targetContainer);
	var targetElements = $(targetList).children();

	var options = jQuery.extend({
		prevSelector: null,
		nextSelector: null,
		triggerEvent: "click",
		defaultCallback: null,
		customShowElement: null,
        startElement: 1,
		autoMapping: false,
		autoStart: false,
		autoDirection: "next",
		autoHoverPause: true,
		autoDelayTime: 4000,
        beforeInit: null,
		afterInit: null
	}, options);
	
	var self = this;

	var currentElement = options.startElement;
	var totalCount = targetElements.size();

	var _init = function() {
        // trigger beforeInit
        if(options.beforeInit && options.beforeInit instanceof Function) {
            options.beforeInit.apply(self);
        }

		// bind auto flip
		if(options.autoStart) {
			auto.startInterval();
			auto.bindEvents();
		}

		// bind click to prev/next selector
		var triggerEventName = $.map(options.triggerEvent.split(","), function(v) { return v.trim() + ".necoiFlip"; }).join(" ");

		if(options.prevSelector) {
			$(options.prevSelector).bind(triggerEventName, function(e) {
				self.prev();
			});
		}

		if(options.nextSelector) {
			$(options.nextSelector).bind(triggerEventName, function(e) {
				self.next();
			});
		}

		// auto map children
		if(options.autoMapping) {
			targetElements.each(function(i, v) {
				$(this).bind(triggerEventName, function(e) {
					self.showElement(i + 1);
				});
			});
		}

		// trigger afterInit
		if(options.afterInit && options.afterInit instanceof Function) {
			options.afterInit.apply(self);
		}
	};

	var auto = {
		intervalObj: null,
		mouseOverStatus: "leave",

		bindEvents: function() {
			targetList
				.bind("mouseenter.necoiFlip", auto.enterEvent)
				.bind("mouseleave.necoiFlip blur.necoiFlip", auto.leaveEvent);

			targetElements.find("a")
				.bind("focus.necoiFlip", auto.enterEvent)
				.bind("blur.necoiFlip", auto.leaveEvent);
		},

		enterEvent: function(e) {
			if(auto.mouseOverStatus == "over") {
				return;
			}

			auto.mouseOverStatus = "over";
			auto.stopInterval();
		},

		leaveEvent: function(e) {
			if(auto.mouseOverStatus == "leave") {
				return;
			}

			auto.mouseOverStatus = "leave";
			auto.startInterval();
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

	this.getTargetList = function() {
		return targetList;
	};

	this.getTargetElements = function() {
		return targetElements;	
	};

    this.setCurrentElementNo = function(no) {
        currentElement = no;
    };

    this.getCurrentElementNo = function() {
        return currentElement;
    };

	this.getTotalCount = function() {
		return totalCount;
	};
	
	this.prev = function (callback) {
		var step = step || 1;
        var element;

		if (currentElement == 1) {
            element = totalCount;
		} else {
            element = currentElement - step;
		}

		self.showElement(element, callback);

		return false;
	};

	this.next = function (callback) {
		var step = step || 1;
        var element;

		if (currentElement == totalCount) {
            element = 1;
		} else {
            element = currentElement + step;
		}

		self.showElement(element, callback);

		return false;
	};

	this.showElement = function (element, callback) {
		currentElement = element || 1;
		callback = callback || options.defaultCallback;

        if(options.autoStart && options.autoHoverPause && auto.mouseOverStatus == "leave") {
            auto.resetInterval();
        }

		if(options.customShowElement && options.customShowElement instanceof Function) {
			options.customShowElement.apply(self, [currentElement, callback]);

			return false;
		}

		self.getTargetElements().eq(currentElement - 1).show().siblings().hide();

		if(callback && callback instanceof Function) {
			callback.apply(self);
		}

		return false;
	};

	_init();

	NecoiFlip.action[targetList.attr("id") || Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)] = this;
};

NecoiFlip.action = {};



$.fn.necoiFlip = function(options) {
	if (this.length <= 0) {
		return null;
	}

	var maps = [];

	this.each(function(i, v) {
		v.necoiFlip = new NecoiFlip(v, options);

		maps.push(v.necoiFlip);
	});

	return this.necoiFlip = maps;
};

})(jQuery);
