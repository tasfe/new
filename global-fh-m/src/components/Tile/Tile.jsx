import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Tile.css'

@WithStyles(styles)

class Tile extends Component {
  constructor (props) {
    super(props)

    let idPrefix = props.config.id || 'tile'
    this.id = idPrefix + '_' + window.keyGenerator()
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  componentDidMount () {
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
      }, 1000);
    });
  }

  render() {

    let {config, tileStyle} = this.props;

    return <div className={config.onclick? 'tile waves-effect waves-light' : 'tile'} style={tileStyle} onClick={::this.clickEvent}>
            <div className="tile-title">{config.title}</div>
            <div className="tile-content">{config.content}</div>
          </div>
  }

  clickEvent () {
    if (this.props.config.onclick && _.isFunction(this.props.config.onclick)) {
        this.props.config.onclick();
    }
  }

}

export default Tile