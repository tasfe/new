/**
 * 用于监控 `view` 的状态，当`view`在DOM树中渲染(rendered)以及展现(shown)之后，
 * 每次 re-rendered 时，都会触发 "dom:refresh" 事件
 */
Base.MonitorDOMRefresh = function(view) {

  /**
   * 当`view`已经展现之后触发
   */
  function handleShow() {
    view._isShown = true;
    triggerDOMRefresh();
  }

  /**
   * 当`view`已经re-render之后触发
   */
  function handleRender() {
    view._isRendered = true;
    triggerDOMRefresh();
  }

  // 触发 "dom:refresh" 事件，以及调用 onDomRefresh 方法
  function triggerDOMRefresh() {
    if (view._isShown && view._isRendered && Base.isNodeAttached(view.el)) {
      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('dom:refresh');
      }
    }
  }

  view.on({
    show: handleShow,
    render: handleRender
  });
};