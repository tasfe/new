import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Aboutus.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Aboutus extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="">
        <p>
          <img src="images/banner-3.png" alt="图片" width="100%" />
        </p>
        <div className="padding-h-sm aboutus">
          <p>
            繁华世界在线娱乐是业内最具影响力的在线娱乐平台之一，繁华世界在线娱乐持有菲律宾合法经营牌照，与菲律宾博彩牌照管理机构GICC 建立了长期合作伙伴关系。
          </p>
          <p>
            带给客户高质量的产品、服务、娱乐和收益是我们永恒的宗旨。在越来越热络的在线娱乐市场中，不断地求新求变，寻找最新的创意，秉持最好的服务，给用户最大化的利益回报，力争跻身于行业领先行列，一直是我们追逐的目标。
          </p>
          <p>
            繁华世界在线娱乐平台凭借稳固的硬件设备、资深的软硬件开发技术团队，经验丰富的市场营销团队和专业的客服团队，建立了全面而完善的组织体系，确保用户无时无刻享受到最优质的在线娱乐服务。
          </p>
          <p>
            我们恪守“以客户需求为己任”的宗旨，以力求创新，不断完善的精神，开拓多元化的在线娱乐业务。繁华世界在线娱乐拥有行业领先的技术实力，为用户娱乐提供跨平台一站式解决方案，同时具备网页版、以及手机app供客户体验（PC、IOS、Android）。采用更安全可靠的云服务器架构，银行级加密系统，保障游戏运行中的高速、稳定、安全。凭借多年对线上市场的丰富经验，不断创新发展，深入研究，更是将细节做到尽善尽美以满足广大用户的极致体验。我们承诺在每一个细节上都能让大家体会到我们的诚意和用心。
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Aboutus