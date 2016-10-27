import React, {Component, PropTypes} from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import WithStyles from 'with-style'
import styles from './Tab.css'
import { Provider } from 'react-redux'

@WithStyles(styles)
class Tab extends Component {

  static propTypes = {
    config: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.tabs = props.config.fields
    this.tabCount = this.tabs.length
    this.tabIndex = Number(_.getQuery('tabindex'))
  }

  changeTabBorderPosition () {
    let activePos = $('.tabs-header .active').position()
    $('.border').stop().css({
      left: activePos.left
    })
  }

  mountTabComponent (index) {
    index = index || (this.tabIndex || 0)
    let component = this.tabs[Number(index)].content
    let $$container = this.refs.tabContent;
    if (component) {
      unmountComponentAtNode($$container)
      render(
        <Provider store={this.context.store}>
          {component}
        </Provider>,
        $$container,
        () => {
          this.changeTabBorderPosition()
        }
      )
    }
  }

  componentWillMount () {
    this.tabs = this.props.config.fields;
    this.tabCount = this.tabs.length;
  }

  componentDidMount () {

    $('.tabs-header .border').css({
      width: $('.tabs-header li:eq(0)').width()
    })

    $('.tabs-header').off('click').on('click', 'a', e => {
      e.preventDefault()
      let $target = $(e.currentTarget)
      $('.tabs-header a').stop().parent().removeClass('active');
      $target.stop().parent().addClass('active')
      this.changeTabBorderPosition()

      this.tabIndex = $target.data('tabid')
      this.mountTabComponent(this.tabIndex)
    });

    $('.tabs-header').off('click.delegate')
      .on('click.delegate', '.waves-effect', function (e) {
        var rippleDiv = $('<div class="ripple" />'),
          rippleOffset = $(this).offset(),
          rippleY = e.pageY - rippleOffset.top,
          rippleX = e.pageX - rippleOffset.left,
          ripple = $('.ripple');
        rippleDiv.css({
          top: rippleY - ripple.height() / 2,
          left: rippleX - ripple.width()
        }).appendTo($(this));
        window.setTimeout(function () {
          rippleDiv.remove();
        }, 1500);
      });

  //  this.mountTabComponent(this.tabIndex)
    this.mountTabComponent()

  //左右滑动事件
    var tabsContent = $('.tabs-content');
    var tabsHeaderLi = $('.tabs-header li');


    var sX = 0;    // 手指初始x坐标
    var sY = 0;   // 手指初始y坐标
    var sLeft = 0; // 初始x方向位移
    var index = 0;
    var curLeft = 0; // 当前x方向位移
    var disX = 0;  // x方向滑动差值
    var disY = 0;  // y方向滑动差值

    tabsContent[0].addEventListener('touchstart', Touchstart, true);

    function Touchstart(e) {

      sX = e.changedTouches[0].pageX;
      sY = e.changedTouches[0].pageY;

      // 计算初始位移
      sLeft = tabsContent[0].style.transform ? -parseInt(/\d+/.exec(tabsContent[0].style.transform)) : 0;
      tabsContent[0].style.transition = 'none';

      tabsContent[0].addEventListener('touchend', Touchend, true);
    }

    function Touchend(e) {
      disX = e.changedTouches[0].pageX - sX;
      disY = e.changedTouches[0].pageY - sY;
      console.log('xxxxx'+disX)
      console.log('yyyyyy'+disY)

      if(disX <= 100 && disX >= -100) return
      if(Math.abs(disX) < Math.abs(disY)) return

      curLeft = sLeft + disX;
      tabsContent[0].style.transform = 'translateX(' + curLeft + 'px)';

      /*
      if (disX <= 100 && disX >= -100 ) {
        return;
      }*/
      if (disX > 100) {
        if (index != 0) {
          index -= 1;
        }
      }
      if (disX < -100) {
        if (index !=  tabsHeaderLi.length - 1) {
          index += 1;
        };
      };

      $('.tabs-header .border').css({
        left:(index)*245
      })

      $('.tabs-header li:eq('+index+') a').trigger('click');

      tabsContent[0].style.transition = '.5s';
      tabsContent[0].style.transform = 'translateX(' + -index*tabsHeaderLi[0].offsetWidth + 'px)';
    }

  }

  componentWillUnmount () {
    unmountComponentAtNode(this.refs.tabContent)
  }

  render() {

    let {fields,claName} = this.props.config;

    return (
      <div className={"tabs "+(claName||'')} >
        <div className="tabs-header">
          <div className="border"></div>
          <ul>
            {fields.map((item, index)  => {
              return <li
                key={window.keyGenerator()}
                className={cx({
                  active: index === (this.tabIndex || 0)
                })} data-id={item.id} >
                <a className="waves-effect btn waves-light btn-flat" data-tabid={index} >{item.pic && <img className="tab-itemImg" src={item.pic} />}{item.title}</a>
              </li>
            })}
          </ul>
        </div>
        <div ref="tabContent" className="tabs-content"></div>
      </div>
    )
  }
}

export default Tab
