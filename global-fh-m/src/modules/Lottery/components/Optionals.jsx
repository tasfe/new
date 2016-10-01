/**
 * 任选直选单式  位 选择器
 */

import React, { Component, PropTypes } from 'react'
import Toggle from 'components/Toggles'
import betRulesAlgorithm from 'misc/betRulesAlgorithm'

class Optionals extends Component {
  static propTypes = {
    playMode: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }
  
  render () {
    let { playMode } = this.props
    
    return <div ref="optionals" className="combination-options">
      {playMode.optionals &&
      playMode.optionals.list &&
      playMode.optionals.list.map(item => {
        let props = {
          name: 'combineOption',
          type: 'checkbox',
          text: item.title,
          checked: item.checked,
          value: item.id,
          onClick: ::this.calculateCoefficient
        }
        return <Toggle data={item.id} key={window.keyGenerator()} config={props} />
      })}
    </div>
  }
  
  componentDidMount () {
    this.calculateCoefficient()
  }
  
  calculateCoefficient () {
    let { playMode, onChange } = this.props
    let coefficient = 1;
    let selectOptionals = [];

    if (playMode.optionals && playMode.optionals.list) {
      let $checkedList = $(this.refs.optionals).find('input[name=combineOption]').filter(':checked');
      let length = $checkedList.length;
      if(!_.isEmpty(playMode.optionals)) {
        coefficient = betRulesAlgorithm.optional(
          playMode.optionals.coefficient,
          length
        );
      }

      $checkedList.each(function(index, checked) {
        let $checked = $(checked);
        selectOptionals.push(Number($checked.val()));
      });
    }

    onChange(selectOptionals, coefficient)
  }
}

export default Optionals