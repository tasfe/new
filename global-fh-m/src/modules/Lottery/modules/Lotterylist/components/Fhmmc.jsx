import React, { Component, PropTypes } from 'react'
import WithStyles from 'with-style'
import styles from './Fhmmc.css'
import jquery from './jquery-1.7.2-min.js'
import easing from './easing.js'
//import animate from './jquery-animate-plugin.js'

@WithStyles(styles)
class Fhmmc extends Component {
  constructor (props) {
    super(props)

    this.state = {
      
    }
    this.isBegin = false;

  }

  componentDidMount() {
    
  }

  getStart () {
    var self = this;
    if(this.isBegin) return false;
    this.isBegin = true;
    $(".mmc-num").css('backgroundPositionY','-0.06rem');
    if(!$('.js-bc-mmc-start').hasClass('active')){
      $('.js-bc-mmc-start').addClass('active');
      //this.startAnimate();
      var result = this.numRand();
      var u = 0.56;
      var num_arr = (result+'').split('');
      console.log(result)
      $(".mmc-num").each(function(index){
        var _num = $(this);
        setTimeout(function(){
          _num.animate({ 
            'backgroundPositionY': ((u*60) - (u*num_arr[index])) + 1.16 + 'rem'
          },{
            duration: 6000+index*3000,
            easing: "easeInOutCirc",
            complete: function(){
              if(index==4) self.isBegin = false;
            }
          });
        }, index * 300);
      });
    }
  }

  numRand () {
    var x = 99999; //上限
    var y = 11111; //下限
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    return rand;
  }

  render () {

    return <div className="fh-mmc">
      <div className="mmc-content">
        <div className="js-bc-mmc-num-box mmc-num-box">
          <div className="mmc-num"></div>
          <div className="mmc-num"></div>
          <div className="mmc-num"></div>
          <div className="mmc-num"></div>
          <div className="mmc-num"></div>
        </div>
        <div className="js-bc-mmc-start mmc-bc-start" onClick={::this.getStart}></div>
      </div>
    </div>
  }
}

export default Fhmmc