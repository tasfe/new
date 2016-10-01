import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Dpc.css'
import tblstyles from 'components/Table/Table.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
@WithStyles(tblstyles)
class Dpc extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--玩法介绍')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">低频彩玩法介绍</h3>
        <div className="hlep-playintro">
          <p>1.3D彩</p>
          <p>一个3位自然数为投注号码的彩种，投注者从000-999的数字中选择一个3位数进行投注。</p>
          <p>P5/P3</p>
          <p>
            P3投注区分为百位、千位和万位，各位置号码范围为0～9。P5投注区分为个位、十位、百位、千位和万位，各位号码范围为0～9。 每期从各位上开出1个号码作为中奖号码，即开奖号码为5位数。
          </p>
          <p>下列是繁华世界在线娱乐3D 彩和P3/P5的开奖具体时间及奖期规则介绍：</p>
          <table className="table table-bordered text-align-center tbl-ssc">
            <thead>
            <tr>
              <th>彩系</th>
              <th>彩种</th>
              <th>说明</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="2">低频</td>
                <td>3D</td>
                <td>
                  <div>销售时间：00:00－20:20</div>
                  <div>开奖频率：1天</div>
                  <div>每日期数：共1期</div>
                </td>
              </tr>
              <tr>
                <td>P3/P5</td>
                <td>
                  <div>销售时间：00:00－20:20</div>
                  <div>开奖频率：1天</div>
                  <div>每日期数：共1期</div>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table table-bordered tbl-ssc">
            <colgroup>
              <col width="10%"/>
              <col width="15%"/>
              <col width="15%"/>
              <col width="30%"/>
              <col width="25%"/>
            </colgroup>
            <thead>
              <tr>
                <th>玩法群</th>
                <th>玩法组</th>
                <th>玩法</th>
                <th>玩法说明</th>
                <th>中奖示例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan="7">三星</td>
                <td rowSpan="3">三星直选</td>
                <td rowSpan="1">直选复式</td>
                <td rowSpan="1">从百位、十位、个位中选择一个3位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：选择123，开奖号码为是123，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">直选单式</td>
                <td rowSpan="1">手动输入一个3位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：手动输入123，开奖号码为是123，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">直选和值</td>
                <td rowSpan="1">所选数值等于开奖号码的三个数字相加之和，即为中奖。</td>
                <td rowSpan="1">如：选择6，开奖号码为123、141、114、006、060等任意一个和值为6的结果，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="4">三星组选</td>
                <td rowSpan="1">组三</td>
                <td rowSpan="1">从0-9中任意选择2个数字组成两注，所选号码与开奖号码相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：选择12（展开为122，212，221 和 112、121、211），开奖号码为212 或 121，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">组六</td>
                <td rowSpan="1">从0-9中任意选择3个号码组成一注，所选号码与开奖号码相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：选择123（展开为123，132，231，213，312，321），开奖号码为321，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">组选和值</td>
                <td rowSpan="1">所选数值等于开奖号码的三个数字相加之和，即为中奖。</td>
                <td rowSpan="1">如：选择6，开奖号码为114中组三奖，开奖号码为015中组六奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">混合组选</td>
                <td rowSpan="1">手动输入购买号码，3个数字为一注，开奖号码符合组三或组六均为中奖。</td>
                <td rowSpan="1">如：选择123、455，开奖号码为321即中组六奖，开奖号码为545即中组三奖。</td>
              </tr>
              <tr>
                <td rowSpan="8">二星</td>
                <td rowSpan="4">二星直选</td>
                <td rowSpan="1">前二直选复式</td>
                <td rowSpan="1">从百位和十位上至少各选1个号码，所选号码与开奖号码百位、十位相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：选择号码34，开出34*即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">前二直选单式</td>
                <td rowSpan="1">手动输入一个2位数号码组成一注，所选号码与开奖号码的百位、十位相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：手动输入12，开奖号码为是12*，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">后二直选复式</td>
                <td rowSpan="1">从十位和个位上至少各选1个号码，所选号码与开奖号码的十位、个位相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：选择号码34，开出*34，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">后二直选单式</td>
                <td rowSpan="1">手动输入一个2位数号码组成一注，所选号码与开奖号码的十位、个位相同，且顺序一致，即为中奖。</td>
                <td rowSpan="1">如：手动输入12，开奖号码为是*12，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="4">二星组选</td>
                <td rowSpan="1">前二组选复式</td>
                <td rowSpan="1">从0-9中选2个号码组成一注，所选号码与开奖号码的百位、十位相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：百位选择7，十位选择8，开奖号码78*或87*，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">前二组选单式</td>
                <td rowSpan="1">手动输入购买号码，2个数字为一注，所选号码与开奖号码的百位、十位相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：手动输入12，开奖号码为是21*或12*，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">后二组选复式</td>
                <td rowSpan="1">从0-9中选2个号码组成一注，所选号码与开奖号码的十位、个位相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：十位选择7，个位选择8，开奖号码*78或*87，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">后二组选单式</td>
                <td rowSpan="1">手动输入购买号码，2个数字为一注，所选号码与开奖号码的十位、个位相同，顺序不限，即为中奖。</td>
                <td rowSpan="1">如：手动输入12，开奖号码为是*21或者*12，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">定位胆</td>
                <td rowSpan="1">定位胆</td>
                <td rowSpan="1">定位胆</td>
                <td rowSpan="1">从百位、十位、个位任意1个位置或多个位置上选择1个号码，所选号码与相同位置上的开奖号码一致，即为中奖。</td>
                <td rowSpan="1">如：定百位为3，开奖号码为3**，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="2">不定位</td>
                <td rowSpan="2">不定位</td>
                <td rowSpan="1">一码不定位</td>
                <td rowSpan="1">从0-9中选择1个号码，每注由1个号码组成，只要开奖结果中包含所选号码，即为中奖。</td>
                <td rowSpan="1">如：选择一码不定位4，开出4**、*4*、**4，即为中奖。</td>
              </tr>
              <tr>
                <td rowSpan="1">二码不定位</td>
                <td rowSpan="1">从0-9中选择2个号码，每注由2个号码组成，只要开奖结果中包含所选2个号码，即为中奖。</td>
                <td rowSpan="1">如：选择二码不定位45，开出45*、54*、*54、*45、5*4、4*5，即为中奖。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

module.exports = Dpc