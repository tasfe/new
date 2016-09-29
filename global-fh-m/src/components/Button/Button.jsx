import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Button.css'


@WithStyles(styles)
class Button extends Component {
  constructor (props) {
    super(props)

    let idPrefix = props.config.id || 'btn'
    this.id = idPrefix + '_' + window.keyGenerator()
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.object
  }

  componentDidMount () {
    $(`#${this.id}`)
      .off('click')
      .on('click', function (e) {
        let rippleDiv = $('<div class="ripple" />'),
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
        }, 800);
      });
  }

  componentWillUnmount () {
    $(`#${this.id}`).off('click')
  }

  render() {

    let {config, data, ...other} = this.props;
    let props = {
      type: 'button',
      id: this.id,
      className: 'waves-effect btn ' + (config.className || ''),
      ...other
    }

    if (data) {
      for (var x in data) {
        props[`data-${x}`] = data[x]
      }
    }

    return config.link ?
      <a href={config.link} {...props}>{config.text}</a> :
      <button {...props}>{config.text}</button>
  }

}

export default Button