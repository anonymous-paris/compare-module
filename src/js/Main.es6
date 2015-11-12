"use strict";

// dependencies
import $ from "@anonymous-paris/core-js/lib/zepto/zepto";

import RequestAnimationFrame from "@anonymous-paris/core-js/lib/anonymous/utils/RequestAnimationFrame";

import {CompareModule} from "../../index.js";

class Main
{
	constructor()
	{
		this._compareModule = new CompareModule($('.compare-module'));
		
		$(window).resize($.proxy(this._onResize, this));
		this._onResize();
	}

	/**
	 * Drawing on requestAnimationFrame
	 */
	update()
	{
		this._compareModule.update();
	}

	/**
	 * Triggered on window resize
	 */
	_onResize()
	{
	}
}

/**
 * Let's roll
 */
$(document).ready(function()
{
	var main = new Main();

	(function tick()
	{
		main.update();
		window.requestAnimationFrame(tick);
	})();
});