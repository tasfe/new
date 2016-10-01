import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import WithStyles from 'with-style'
import styles from './OpLottery.css'
import ticketConfig from 'misc/ticketImgConfig'
import styles2 from 'components/Button/Button.css'
@WithStyles(styles)
@WithStyles(styles2)

class OpLottery extends Component {
  constructor () {
    super();

    let idPrefix = 'opl';
    this.id = idPrefix + '_' + window.keyGenerator()
  }

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let { data } = this.props;
    let config = ticketConfig.get(+data.ticketId) || {}
    
    return (
      <div className={data.itemClass}>
        <Link className="waves-effect btn btn-red waves-light lottery-bet-btn" to={`/lottery/${data.ticketId}`}>立即投注</Link>
        <Link to={{
          pathname: `/lottery/${data.ticketId}/oh`,
          state: {
            id: data.ticketId
          }
        }} >
          <div className="lottery-pic">
            <img src={config.img} />
          </div>
          <div className="lottery-openContent">
            <div className="lottery-title">{config.ticketName || ''}</div>
            <div  className="lottery-open-outer">
            {data.history.map((item, index) => {
              return <div key={index} className="lottery-open-more">
                <div className="lottery-plan-more">第{item.ticketPlanId || ''}期</div>
                <div className="lottery-result-more">
                  {
                    item.ticketResult? item.ticketResult.split(",").map(openNum => {
                      return <div className="lottery-result-openNum" key={window.keyGenerator()}>{openNum}</div>;
                    }) : ''
                  }
                </div>
              </div>
            })}
            </div>
          </div>
          {/*<div className="link-mark"></div>*/}
        </Link>
      </div>
    )


  }
}

export default OpLottery