define(function(require, exports, module) {

  $.widget('gl.pagination', {

    options: {
      namespace: 'glPagination',
      pageIndex: 0,
      pageSize: 10,
      maxPaginationNum: 6,
      onPaginationChange: _.noop,
      totalSize: 0
    },

    _create: function() {
      if (this.options.totalSize !== -1) {
        this._initPagination(this.options.totalSize);
      }

      this._bindEvents();
    },

    _bindEvents: function() {
      var events = {
        'click .pagination li': this.paginationClickHandler,
        'click .js-wt-grid-btn-go-to': this.gotoPageSubmitHandler,
        'keypress .js-wt-grid-curt-page': this.gotoPageHandler
      };

      this._on(events);
    },

    //common APIs

    update: function(totalSize, pageIndex, options) {
      options = options || {};

      if (!_.isUndefined(totalSize)) {
        this.options.totalSize = totalSize;
        options.initPagination = true;
      }

      if (options.initPagination || pageIndex) {
        this._initPagination(this.options.totalSize, Number(pageIndex));
      }
    },

    clean: function() {
      this.element.addClass('hidden');

      return this;
    },

    _initPagination: function(totalSize, pageIndex) {
      pageIndex = pageIndex || 0;
      totalSize = totalSize || 0;

      var pageSize = this.options.pageSize,
        totalPage = Math.ceil(totalSize / pageSize),
        pageIndexs = totalPage,
        html = [],
        i,
      //最小区间
        minSphere,
      //最大区间
        maxSphere,
        size = 0;

      //
      if (totalSize === 0) {
        // return;
      }

      //maxSphere,
      minSphere = pageIndex - Math.floor(_(this.options.maxPaginationNum).div(2));
      minSphere = minSphere > 0 ? minSphere : 0;

      maxSphere = pageIndex + Math.ceil(_(this.options.maxPaginationNum).div(2)) +
        (Math.floor(_(this.options.maxPaginationNum).div(2)) - pageIndex + minSphere) - 1;
      maxSphere = maxSphere > (totalPage - 1) ? (totalPage - 1) : maxSphere;

      if (pageIndexs <= this.options.maxPaginationNum) {
        size = pageIndexs;
      } else {
        size = this.options.maxPaginationNum;
      }

      html.push('<div class="clearfix">');

      html.push('<div class="pull-right vertical-middle">');

      html.push('<div class="inline-block m-right-xs">共 <span class="total-size">' + totalSize + '</span> 条记录</span></div>');

      html.push('<nav class="inline-block vertical-top m-right-xs">');
      html.push('<ul class="pagination">');

      if (pageIndex > 0) {
        html.push('<li class="pagination-pre" data-pageIndex="prev"><a href="javascript:void(0)">&lt;</a></li>');
      } else {
        html.push('<li class="pagination-pre disabled" data-pageIndex="prev"><a href="javascript:void(0)">&lt;</a></li>');
      }

      for (i = minSphere; i <= maxSphere; ++i) {
        html.push('<li data-pageIndex="' + i + '"');
        if (i === pageIndex) {
          html.push(' class="active" ');
        }
        html.push('><a href="javascript:void(0)">' + (i + 1) + '</a></li>');
      }

      if (pageIndex < totalPage - 1) {
        html.push('<li class="pagination-next" data-pageIndex="next" data-maxPageIndex="' + pageIndexs + '"><a href="javascript:void(0)">&gt;</a></li>');
      } else {
        html.push('<li class="pagination-next disabled" data-pageIndex="next" data-maxPageIndex="' + pageIndexs + '"><a href="javascript:void(0)">&gt;</a></li>');
      }

      html.push('</ul>');
      html.push('</nav>');

      html.push('<div class="inline-block vertical-middle">跳转 <span class="inline-block">');
      html.push('<input value="' + (pageIndex + 1) + '" data-cur-page="' + pageIndex + '" class="input-sm form-control width-xs js-wt-grid-curt-page" style"line-height: 24px;">');
      html.push('</span> / <span class="total-page">' + totalPage + '</span>页 ');
      html.push('<button class="js-wt-grid-btn-go-to btn btn-sm btn-default vertical-bottom">确定</button>');
      html.push('</div>');

      html.push('</div>');

      this.element.html(html.join('')).removeClass('hidden');
    },

    //event handlers

    paginationClickHandler: function(e) {
      var $paginationItem = $(e.currentTarget),
        pageIndex = $paginationItem.attr('data-pageIndex');

      if ($paginationItem.hasClass('disabled')) {
        return;
      }

      if (pageIndex === 'prev') {
        --this.options.pageIndex;
      } else if (pageIndex === 'next') {
        ++this.options.pageIndex;
      } else {
        this.options.pageIndex = pageIndex;
      }

      this.options.onPaginationChange(this.options.pageIndex);

      return false;
    },

    gotoPageSubmitHandler: function(e) {
      if (this.options.totalSize) {
        var $gotoInput = this.element.find('.js-wt-grid-curt-page');

        var gotoPageIndex = Number($gotoInput.val());

        this._gotoPage(gotoPageIndex);
      }

      return false;
    },

    gotoPageHandler: function(e) {
      if (13 === e.keyCode) {
        if (this.options.totalSize) {
          var gotoPageIndex = Number(e.target.value);

          this._gotoPage(gotoPageIndex);
        }

        return false;
      }
    },

    _gotoPage: function(gotoPageIndex) {
      // 如果输入 非法字符，负值或大于最大值的数值 还原之前的值 并阻止刷新
      if (!gotoPageIndex || gotoPageIndex < 0) {
        gotoPageIndex = 1;
      } else if (gotoPageIndex > Math.ceil(this.options.totalSize / this.options.pageSize)) {
        gotoPageIndex = Math.ceil(this.options.totalSize / this.options.pageSize);
      }

      this.options.onPaginationChange(gotoPageIndex - 1);
    }
  });

  module.exports = $.gl.pagination;

});
