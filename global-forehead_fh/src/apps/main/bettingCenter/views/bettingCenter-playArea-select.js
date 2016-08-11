"use strict";

var betRulesAlgorithm = require('bettingCenter/misc/betRulesAlgorithm');

var BettingCenterPlayAreaView = Base.ItemView.extend({

  template: '',

  positionTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-position.html')),

  playItemsTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-items.html')),

  events: {
    'change .js-bc-playArea-position-item': 'positionChooseHandler',
    'click .js-bc-select-item': 'selectNumberHandler',
    'click .js-bc-select-op': 'selectOperateHandler'
  },

  initialize: function () {
    this.options.selectOptionals = [];
    this.options.rowsResult = [];
  },

  onRender: function() {
    var html = [];

    if(this.options.optionals && this.options.optionals.list) {
      html.push(this.positionTpl({
        optionals: this.options.optionals.list
      }));
    }

    html.push('<div class="">' + _(this.options.list).map(function(item) {
      item.hasOp = _(item.op).some();
      return item.isShow ? this.playItemsTpl({
        limit: _(item.limits).pluck('name').join(' '),
        limitProps: _(item.limits).map(function(limit) {
          return _(limit.data).map(function(val, prop) {
            return 'data-' + limit.name + '-' + prop + '="' + val + '"';
          });
        }).join(' '),
        row: item
      }) : '';
    }, this).join('') + '</div>');

    this.$el.html(html.join(''));

    this.$playAreaPosition = this.$('.js-bc-playArea-position');
    this.$rows = this.$('.js-bc-playArea-items');

    this.calculateCoefficient();
  },

  statisticsLottery: function() {
    var count = 0;

    this.options.rowsResult = _(this.options.list).map(function(item) {
      var selected = [];

      if (item.isShow) {
        selected = _(this.$rows.filter('.js-bc-playArea-items-' + item.id).find('.js-bc-select-item.active')).map(function(item) {
          return $(item).data('num');
        });
      }

      return selected;
    }, this);

    //如果系数不存在，根本无需计算
    if (this.options.coefficient) {
      //任选玩法需要去掉没有选值的行，便于复选计算
      if (this.options.algorithmProps && this.options.algorithmProps.coefficient) {
        count = Math.round(_(this.options.coefficient).mul(this.options.algorithm.call(
          this.options,
          _(this.options.rowsResult).filter(function(rowResult) {
            return !_.isEmpty(rowResult);
          })) || 0));
      } else {
        count = Math.round(_(this.options.coefficient).mul(this.options.algorithm.call(this.options, this.options.rowsResult) || 0));
      }
    }

    this.trigger('statistic', count);
  },

  calculateCoefficient: function() {
    var coefficient = 1;
    var selectOptionals = [];

    var $checkedList = this.$playAreaPosition.find('input[name=optional]').filter(':checked');
    var length = $checkedList.length;
    if(!_.isEmpty(this.options.optionals)) {
      coefficient = betRulesAlgorithm.optional(
        this.options.optionals.coefficient,
        length
      );
    }

    $checkedList.each(function(index, checked) {
      var $checked = $(checked);
      selectOptionals.push(Number($checked.val()));
    });

    this.options.selectOptionals = selectOptionals;
    this.options.coefficient = coefficient;
  },

  //common APIs

  getBetting: function() {
    return {
      rowsResult: this.options.rowsResult,
      selectOptionals: this.options.selectOptionals,
      format: this.options.format,
      formatToNum: this.options.formatToNum || false // PK10大小单双文字数字转换标示
    };
  },

  empty: function() {
    this.options.rowsResult = [];
    this.$el.find('.js-bc-select-item,.js-bc-select-op').removeClass('active');
    this.trigger('statistic', 0);
  },

  create: function(createTimes) {
    var results = [];
    if (this.options.coefficient) {
      results = _(createTimes).times(this.options.create, this.options);
      _(results).each(function(result) {
        result.statistics = Math.round(_(this.options.coefficient).mul(result.statistics));
        result.selectOptionals = this.options.selectOptionals;
      }, this);
    }

    return results;
  },

  //event handlers

  positionChooseHandler: function(e) {
    this.calculateCoefficient();
    this.statisticsLottery();
  },

  selectNumberHandler: function(e) {
    var $target = $(e.currentTarget);
    var $parent = $target.closest('.js-bc-playArea-items');
    this._selectNumber($target, $parent);
  },

  _selectNumbers: function($targets, $parent) {
    var self = this;

    $targets.each(function(index, target) {
      self._selectNumber($(target), $parent);
    });
  },

  _selectNumber: function($target, $parent) {
    var data = $target.data();
    var active = $target.hasClass('active');

    //横向不允许冲突/超过最大选择数
    if (!active && $target.hasClass('conflict-x')) {
      if (!data.conflictXNum || data.conflictXNum === 1) {
        $target.closest('.bc-select-item').siblings().find('.js-bc-select-item').removeClass('active');
      } else {
        var $actives = $parent.find('.js-bc-select-item.active');
        if ($actives.length >= data.conflictXNum) {
          $actives.eq(0).removeClass('active');
        }
      }
    }

    //纵向不允许冲突
    if (!active && $target.hasClass('conflict-y')) {
      this.$rows.not($parent).find('.js-bc-select-item[data-num=' + data.num + ']').removeClass('active');
    }

    $target.toggleClass('active');

    $target.closest('.js-bc-playArea-items').find('.js-bc-select-op').removeClass('active');

    this.updateRowTitle($target);

    //当是任选并且没有任选位置时，每次改变重新计算系数
    if (this.options.optionals && !this.options.optionals.list) {
      this.calculateCoefficient();
    }

    this.statisticsLottery();
  },

  updateRowTitle: function($target) {
    var $row = $target.closest('.js-bc-playArea-items');
    $row.find('.tab-title').toggleClass('active', !!$row.find('.js-bc-select-item').filter('.active').length);
  },

  selectOperateHandler: function(e) {
    var $target = $(e.currentTarget);
    var $playArea = $target.closest('.js-bc-playArea-items');
    var $itemsToolbars = $playArea.find('.js-be-playArea-items-toolbar');
    var op = $target.data('op');
    var $items = $itemsToolbars.find('.js-bc-select-item');

    switch (op) {
      case 'all':
        $items.removeClass('active');
        this._selectNumbers($items, $playArea);
        //$items.removeClass('active').trigger('click');
        break;
      case 'big':
        this._selectNumbers($items.removeClass('active').filter(':gt(4)'), $playArea);
        //$items.removeClass('active').filter(':gt(4)').trigger('click');
        break;
      case 'small':
        this._selectNumbers($items.removeClass('active').filter(':lt(5)'), $playArea);
        //$items.removeClass('active').filter(':lt(5)').trigger('click');
        break;
      case 'odd':
        if ($items.eq(0).data('num') % 2) {
          this._selectNumbers($items.removeClass('active').filter(':even'), $playArea);
          //$items.removeClass('active').filter(':even').trigger('click');
        } else {
          this._selectNumbers($items.removeClass('active').filter(':odd'), $playArea);
          //$items.removeClass('active').filter(':odd').trigger('click');
        }
        break;
      case 'even':
        if ($items.eq(0).data('num') % 2) {
          this._selectNumbers($items.removeClass('active').filter(':odd'), $playArea);
          //$items.removeClass('active').filter(':odd').trigger('click');
        } else {
          this._selectNumbers($items.removeClass('active').filter(':even'), $playArea);
          //$items.removeClass('active').filter(':even').trigger('click');
        }
        break;
      case 'clear':
        $items.removeClass('active');
        break;
    }

    this.updateRowTitle($target);
    //$target.addClass('active').siblings().removeClass('active');

    this.statisticsLottery();
  }
});

module.exports = BettingCenterPlayAreaView;
