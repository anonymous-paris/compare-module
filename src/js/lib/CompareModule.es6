import MouseEvent from "@anonymous-paris/core-js/lib/anonymous/events/MouseEvent";
import Css from "@anonymous-paris/core-js/lib/anonymous/utils/Css";
import Stage from "@anonymous-paris/core-js/lib/anonymous/core/Stage.js";
import Number from "@anonymous-paris/core-js/lib/anonymous/utils/Number.js";

export default class CompareModule
{
	constructor($dom)
	{
		this._$dom = $dom;
		this._$layers = this._$dom.children('.overlay-container').children();
		this._$grabContainer = this._$dom.children('.grabs');
		
		this._w = this._$dom.width();
		this._h = this._$dom.height();

		this._EASE = 0.3;
		this._MAXGAP = 30;

		this._init();
	}

	destroy()
	{
		this._$grabs.off();
		Stage.$document.off(MouseEvent.MOVE + '.CompareModule');
		Stage.$document.off(MouseEvent.UP + '.CompareModule');
	}
	
	resize()
	{
		let ratio = this._$dom.width() / this._w ;
		
		this._widthList = this._widthList.map(function(item){
			return item * ratio;
		});
		
		this._owidthList = this._owidthList.map(function(item){
			return item * ratio;
		});
		
		this._w = this._$dom.width();
		this._h = this._$dom.height();

		for (var i = this._widthList.length - 1; i >= 0; i--)
		{
			let $layer = this._$layers.eq(i);
			let grab = this._grabList[this._$layers.length - i - 1];
			
			$layer.css({clip: 'rect(0,'+ this._widthList[i] +'px,'+ this._h +'px, 0)'});
			Css.transform(grab, 'translate3d('+ (this._widthList[i] | 0) +'px,0,0)');
		}
	}

	_init()
	{
		this._grabList = [];
		this._widthList = [];

		for (var i = 0; i < this._$layers.length; i++)
		{
			this._widthList[i] = (this._w / this._$layers.length) * (this._$layers.length - i);
			
			this._$layers.eq(i).css({clip: 'rect(0,'+ this._widthList[i] +'px,'+ this._h +'px, 0px)'});

			if (i)
			{
				let span = document.createElement('span');
					span.classList.add('grab');
					span.appendChild(document.createElement('span'));

				Css.transform(span, 'translate3d('+ ((this._w / this._$layers.length) * i | 0) +'px,0,0)');

				this._$grabContainer.append(span);
				this._grabList.push(span);
			}
		}

		this._owidthList = this._widthList.slice();
		this._$grabs = this._$grabContainer.children();

		this._initEvents();
	}

	_initEvents()
	{
		this._$grabs.on(MouseEvent.DOWN, this._onGrabDown.bind(this));
	}

	_onGrabDown(e)
	{
		this._$dom.addClass('grabbing');

		let index = this._$layers.length - this._grabList.indexOf(e.currentTarget) - 1;
		this._setMovingSlide(index);

		Stage.$document.on(MouseEvent.MOVE + '.CompareModule', this._onGrabMove.bind(this));
		Stage.$document.on(MouseEvent.UP + '.CompareModule', this._onGrabUp.bind(this));
	}

	_onGrabMove(e)
	{
		e.preventDefault();

		let width = e.pageX - this._$currentLayer.offset().left;

        this._widthList[this._currentIndex] = width;

		this._constrainLayer();
	}

	_onGrabUp()
	{
		this._$dom.removeClass('grabbing');

		Stage.$document.off(MouseEvent.MOVE + '.CompareModule');
		Stage.$document.off(MouseEvent.UP + '.CompareModule');
	}

	_setMovingSlide(index)
	{
		this._currentIndex = index;
	
		this._$currentLayer = this._$layers.eq(this._currentIndex);

		this._currentMaxWidth = this._w - this._MAXGAP;
		this._currentMinWidth = this._MAXGAP;

		if (this._currentIndex !== 1)
			this._currentMaxWidth = this._widthList[this._currentIndex - 1] - this._MAXGAP;
		if (this._currentIndex < this._grabList.length)
			this._currentMinWidth = this._widthList[this._currentIndex + 1] + this._MAXGAP;
	}

	_constrainLayer()
	{
		let clampedWidth = this._widthList[this._currentIndex].clamp(this._currentMinWidth, this._currentMaxWidth);
		let gap = this._widthList[this._currentIndex] - clampedWidth;

		this._widthList[this._currentIndex] = clampedWidth;

		if (this._currentIndex !== 1 && gap > 0 && gap > this._MAXGAP / 2 + 1)
			this._setMovingSlide(--this._currentIndex);
		else if (this._currentIndex < this._grabList.length && gap < 0 && gap < -this._MAXGAP / 2 - 1)
			this._setMovingSlide(++this._currentIndex);

	}

	update()
	{
		if (this._currentIndex)
		{
			for (var i = this._widthList.length - 1; i >= 0; i--)
			{
				let gap = this._widthList[i] - this._owidthList[i];
				let $layer = this._$layers.eq(i);
				let grab = this._grabList[this._$layers.length - i - 1];

				if ( (gap > 0 && gap > 0.02) || (gap < 0 && gap < -0.02) )
				{
					this._owidthList[i] += gap * this._EASE;
					
					$layer.css({clip: 'rect(0,'+ this._owidthList[i] +'px,'+ this._h +'px, 0)'});
					Css.transform(grab, 'translate3d('+ (this._owidthList[i] | 0) +'px,0,0)');
				}
				else if(gap)
				{
					this._owidthList[i] = this._widthList[i]; 
					
					$layer.css({clip: 'rect(0,'+ this._widthList[i] +'px,'+ this._h +'px, 0)'});
					Css.transform(grab, 'translate3d('+ (this._widthList[i] | 0) +'px,0,0)');
				}
			}
		}
	}
}
