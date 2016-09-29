require('./index.scss');

$.widget('gl.tendency', {

	template: require('./index.html'),

	_create: function () {
		$('.js-trend').append(_(this.template).template()());
		this._bindEvent();

		$('.js-tendency-title li').on('click',function () {
			$('.js-tendency-title li').removeClass('sd');
			$(this).addClass('sd');
			if ($(this).data('id') == 4) {
				$('.js-tendencyContentB1').addClass('hidden');
				$('.js-tendencyContentB2').removeClass('hidden');
				$('.js-tendencyContentB3').addClass('hidden');
			}
			else if($(this).data('id') == 6){
				$('.js-tendencyContentB1').addClass('hidden');
				$('.js-tendencyContentB2').addClass('hidden');
				$('.js-tendencyContentB3').removeClass('hidden');
			}
			else{
				$('.js-tendencyContentB1').removeClass('hidden');
				$('.js-tendencyContentB2').addClass('hidden');
				$('.js-tendencyContentB3').addClass('hidden');
			}
		})

		$('.js-tendency-title2 li').on('click',function () {
			$('.js-tendency-title2 li').removeClass('sd');
			$(this).addClass('sd');
		})
	},

	_bindEvent: function () {
	    var self = this;
	    //绑定事件
	    this._on({
	      //'click .js-page5submit': 'infoSubmit'//设置成功
	    });
	}
});

module.exports = $.gl.tendency;