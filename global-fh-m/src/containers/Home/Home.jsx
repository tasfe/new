import React from 'react'
import Page from 'base-page'
import withStyles from 'with-style'
import styles from './Home.css'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import 'lib/js/tiny-slider.min'
import ticketConfig from 'misc/ticketConfig'

import bannerImg from 'images/banner-1.jpg'

@connect(
  state => ({title: state.toolbar.title}),
  { setTitle }
)
@withStyles(styles)
class Home extends Page {

  constructor () {
    super()
    this.state = {
      ticktetInfo : [1,10,21,14,6,18]
    }
    this.TimmerList = [];
    console.log(innerWidth);

    this.pixelValue = 0.4 * (100 * innerWidth / 320)
    console.log('rem',100 * innerWidth / 320);
    this.deg = 2 * Math.PI * 0.38 * (100 * innerWidth / 320)
  }

  componentDidMount () {
    this.loaded()

    this.props.setTitle('精彩推荐');

    tinySlider({
      container: document.querySelector('.slider'),
      items: 1,
      responsive: false,
      touch: true,
      dots: false,
      nav: false,
      autoplay: true
    })

    ajax({
      url: '/ticket/ticketmod/getticketcustomized.json',
    }, resp => {
      this.setState({
        ticktetInfo: resp.root || [1,10,21,14,6,18]
      })

      this.countDownTicket(this.state.ticktetInfo)

    }, err => {
      window.Alert({
        content: err.msg || '获取热门彩种失败！'
      });
    })

  }

  countDownTicket (ticktets) {
    _(this.TimmerList).each(function(timmer){
      clearInterval(timmer);
    });
    var self = this;
    _(ticktets).each(function(item){
      (function (item) {
        ajax({
          url: '/ticket/ticketmod/getticketendtime.json',
          data: {ticketId: item},
          abort: false
        }, resp => {
          var leftSecond = resp.root.dataList[0] && resp.root.dataList[0].leftSeconds;
          var totalSeconds = resp.root.dataList[0] && resp.root.dataList[0].totalSeconds;
          if(leftSecond){
            var timmer1;
            timmer1 = setInterval(function() {
              self.renderCountdown(leftSecond,item,totalSeconds)
              if(--leftSecond < 0){
                clearInterval(timmer1);
                self.getNextTicketStat(item);
              }
            }, 1000);
            self.TimmerList.push(timmer1);
          }

        }, err => {
          // window.Alert({
          //   content: err.msg || '获取倒计时信息失败！'
          // });
        })
      })(item)
    })
  }

  getNextTicketStat (id) {
    var self = this;
    ajax({
      url: '/ticket/ticketmod/getticketendtime.json',
      data: {ticketId: id},
      abort: false
    }, resp => {
      var leftSecond = resp.root.dataList[0] && resp.root.dataList[0].leftSeconds;
      var totalSeconds = resp.root.dataList[0] && resp.root.dataList[0].totalSeconds;
      // var cId = 'js-sec-circle'+id;
      // var circle = document.getElementById(cId);
      // $(circle).attr('transform','rotate(-90 117 117)');
      // $(circle).attr('-webkit-transform','rotate(-90 117 117)');
      // $(circle).attr('-moz-transform','rotate(-90 117 117 ');
      // $(circle).attr('-ms-transform','rotate(-90 117 117');
      // $(circle).attr('-o-transform','rotate(-90 117 117');
      if(leftSecond){
        let timmer2;
        timmer2 = setInterval(function() {
          self.renderCountdown(leftSecond,id,totalSeconds)
          leftSecond--;
          if(leftSecond < 0){
            clearInterval(timmer2);
            self.getNextTicketStat(id);
          }
        }, 1000);
        self.TimmerList.push(timmer2);
      }
    }, err => {
      // window.Alert({
      //   content: err.msg || '获取倒计时信息失败！'
      // });
    })

  }

  renderCountdown (leftTime,id,totalSeconds) {
    var self = this
    var e = leftTime / totalSeconds * this.deg;
    var cId = 'js-sec-circle'+id;
    var n = document.getElementById(cId);
    // if(n){
    //   n.style.strokeDashoffset = e - this.deg;
    // }
    var hours = Math.floor(leftTime/(60*60));
    var minutes = Math.floor((leftTime%(60*60))/60);
    var seconds = leftTime%60;
    $('.js-bc-countdown[data-id="'+ id +'"]').find('.count_h').html(self.checkTime(hours));
    $('.js-bc-countdown[data-id="'+ id +'"]').find('.count_m').html(self.checkTime(minutes));
    $('.js-bc-countdown[data-id="'+ id +'"]').find('.count_s').html(self.checkTime(seconds));

  }



  checkTime (i){
    if (i<10){i="0" + i}
     return i
  }

  render () {

    let cxy = this.remToPx(0.4);
    let svgwh = this.remToPx(0.8);
    let cr = this.remToPx(0.37);
    let cbg = this.remToPx(0.03);
    let cbr = this.remToPx(0.03);
    
    return (
      <div className="home container-fluid">
        <ul className="slider">
          <li>
            <img src={bannerImg} alt="我是图片" />
          </li>
          <li>
            <img src={bannerImg} alt="我是图片" />
          </li>
          <li>
            <img src={bannerImg} alt="我是图片" />
          </li>
        </ul>
        <div className="hot-ticket">
          <div className="hot-t-title">
            <div className="title-lf"><span className="hot-t-icon"></span><span>热门彩种</span></div>
            <a href="#/tc/set" className="title-rt">自定义</a>
          </div>
          <div className="hot-t-con">
            <ul className="lottery-list">
              { 
                this.state.ticktetInfo && this.state.ticktetInfo.map((item, index) => {
                  var data = ticketConfig.getComplete(+item) && ticketConfig.getComplete(+item).info;
                  if(data){
                    return <li key={index} className="lottery-item">
                      <a href={`#/lottery/${item}`}>
                        {data.badge == 'hot'? <div className="item-badge badge-hot">火 爆</div> : ''}
                        {data.badge == 'recommend'? <div className="item-badge badge-sunshine">推 荐</div> : ''}
                        <div className="lottery-img">
                          <img src={data.img } />
                          <svg className="alert-circle" width={svgwh} height={svgwh}>
                            <circle
                              cx={cxy} cy={cxy} r={cr}
                              fill="transparent" stroke="#e3494c"
                              strokeWidth={cbr}>
                            </circle>
                            <circle id={`js-sec-circle${item}`} className="alert-sec-circle"
                                    cx={cxy} cy={cxy} r={cr}
                                    style={{strokeDasharray: this.deg}} fill="transparent" stroke="#d2d2d2"
                                    strokeWidth={cbg} transform={`rotate(-90 ${this.pixelValue} ${this.pixelValue})`}>
                            </circle>
                          </svg>
                        </div>
                        <div className="lottery-txt">
                          <p className="lottery-t">倒计时</p>
                          <div className="js-bc-countdown lottery-cd" data-id={`${item}`}>
                            <span className="count_h">00</span>:<span className="count_m">00</span>:<span className="count_s">00</span>
                          </div>
                        </div>
                      </a>
                    </li>
                  }else{
                    return ''
                  }

                })
              }
            </ul>
          </div>
        </div>
        {//屏蔽真人入口
          // <Link className="home-gc" to="/"><img src="images/banner-gc.png" /></Link>
        }
      </div>
    )
  }

}

export default Home
