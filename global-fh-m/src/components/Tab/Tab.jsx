import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Tab.css'
//import SwipeableViews from 'react-swipeable-views'


@WithStyles(styles)
class Tab extends Component {

  constructor () {
    super()

    this._data = {};

    //this.style = {
    //  slide: {
    //    padding: 15,
    //    minHeight: 200
    //  },
    //  slideStyle: {
    //    height: '100%'
    //  }
    //};
    //this.state = {
    //  slideIndex: 0
    //};
  }

  static propTypes = {
    config: PropTypes.object.isRequired
  }

  //handleChange = (value) => {
  //  this.setState({
  //    slideIndex: value
  //  })
  //};

  componentDidMount () {
    var self = this;

    var activePos = $('.tabs-header .active').position();
    var count = $('.tabs-header li').length;
    var tabItems = $('.tabs-header ul li');
    var tabCurrentItem = tabItems.filter('.active');

    $('.tabs-header li').css({
      width: $('.tabs-header ul').width() / count
    });

    function changePos() {
      activePos = $('.tabs-header .active').position();
      $('.border').stop().css({
        left: activePos.left,
        width: ($('.tabs-header ul').width() / count)
      });
    }

    changePos();
    //var tabHeight = $('.tab.active').height();

    //function animateTabHeight() {
      //tabHeight = $('.tab.active').height();
      //$('.tabs-content').stop().css({ height: tabHeight + 'px' });
    //}
    //animateTabHeight();

    function changeTab() {
      var getTabId = $('.tabs-header .active a').data('tabid');
      $('.tab').stop().fadeOut(300, function () {
        $(this).removeClass('active');
      }).hide();
      $('.tab[id=' + getTabId + ']').stop().fadeIn(300, function () {
        $(this).addClass('active');
        //animateTabHeight();
      });

    }

    $('.tabs-header').on('click', 'a', function (e) {
      e.preventDefault();
      var tabId = $(this).data('tabid');
      $('.tabs-header a').stop().parent().removeClass('active');
      $(this).stop().parent().addClass('active');
      changePos();
      tabCurrentItem = tabItems.filter('.active');
      $('.tab').stop().fadeOut(300, function () {
        $(this).removeClass('active');
      }).hide();
      $('.tab[id="' + tabId + '"]').stop().fadeIn(300, function () {
        $(this).addClass('active');
        //animateTabHeight();
      });
      //self.handleChange(tabId);
    });

    $('.waves-effect').on('click', function (e) {
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

  }

  render() {

    let {fields} = this.props.config;

    return (
    <div className="tabs">
      <div className="tabs-header">
        <div className="border"></div>
        <ul>
          {fields.map((item, index)  => {
            return <li className={cx({
                    active: index === 0
                    })}>
                    <a className="waves-effect btn waves-light btn-flat" data-tabid={index} >{item.title}</a>
                  </li>
          })}
        </ul>
      </div>
      <div className="tabs-content">

          {fields.map((item, index) => {
            return <div id={index} className={cx({
                    active: index === 0,
                    tab: true
                    })}>{item.content}</div>

          })}

      </div>
    </div>
    )
  }
}

export default Tab