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
    console.log(activePos);
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
    var self = this;

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


  //���һ����¼�
    var tabsContent = $('.tabs-content');
    var tabsHeaderLi = $('.tabs-header li');
    console.log('tabsContent'+tabsContent);

    var sX = 0;    // ��ָ��ʼx����
    var sY = 0;   // ��ָ��ʼy����
    var sLeft = 0; // ��ʼx����λ��
    var sRight = 0;// ��ʼy����λ��
    var index = 0;
    var curLeft = 0; // ��ǰλ��
    var disX = 0;  // ������ֵ
    tabsContent[0].addEventListener('touchstart', Touchstart, true);

    function Touchstart(e) {
      e.preventDefault();
      sX = e.changedTouches[0].pageX;
      sY = e.changedTouches[0].pageY;

      console.log('start x : '+sX);
      console.log('start y : '+sY);

      //if(sY > sX) return
      
      // �����ʼλ��

      sLeft = tabsContent[0].style.transformX ? -parseInt(/\d+/.exec(tabsContent[0].style.transformX)[0]) : 0;
      sRight = tabsContent[0].style.transformY ? -parseInt(/\d+/.exec(tabsContent[0].style.transformY)[0]) : 0;

      console.log('start movediatance'+sLeft);
      tabsContent[0].style.transition = 'none';

      tabsContent[0].addEventListener('touchmove', Touchmove, true);
      tabsContent[0].addEventListener('touchend', Touchend, true);
    }

    function Touchmove(e) {
      disX = e.changedTouches[0].pageX - sX;
      curLeft = sLeft + disX;
      tabsContent[0].style.transform = 'translateX(' + curLeft + 'px)';
    }

    function Touchend(e) {
      var tabIndex = $('.tabs-header li.active a').data('tabid');

      if (disX > 100) {

        if (index != 0) {
          index -= 1;

          $('.tabs-header .border').css({
            left:(index)*245
          })

         $('.tabs-header li:eq('+index+') a').trigger('click');

        }
      }
      if (disX < -100) {

        if (index !=  tabsHeaderLi.length - 1) {
          index += 1;

          $('.tabs-header .border').css({
            left:(index)*245
          })

          $('.tabs-header li:eq('+index+') a').trigger('click');

        };
      };
      tabsContent[0].style.transition = '.5s';
      tabsContent[0].style.transform = 'translateX(' + -index*tabsHeaderLi[0].offsetWidth + 'px)';
    }



  }

  componentWillUnmount () {
    unmountComponentAtNode(this.refs.tabContent)
  }

  render() {

    let {fields} = this.props.config;

    return (
      <div className="tabs">
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
