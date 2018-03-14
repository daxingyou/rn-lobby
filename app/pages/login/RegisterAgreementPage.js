import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, ScrollView, Dimensions } from 'react-native'
import HeaderToolBar from '../../components/HeadToolBar'
import ButtonIos from '../../components/ButtonIos'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
const CONTENTS = [
  {
    button: `一、相关定义`,
    list: [
      {
        title: `1.用户`,
        content: `指在${Config.platformName}注册登记，并得到${Config.platformName}在认可，有资格享受${Config.platformName}服务的注册会员。`,
      },
      {
        title: `2.购彩`,
        content: `指注册的用户可在本站购买彩票，并且对所购买的彩票拥有完整的奖金获得权利。`,
      },
      {
        title: `3.用户资料`,
        content: `指用户在注册时提供的个人信息，包括：用户名、注册帐户密码、银行卡帐号、用户真实姓名等。`,
      },
    ],
  },
  {},
  {
    button: `三、用户权利`,
    list: [
      {
        title: `1.用户`,
        content: `用户有权随时查询用户资料，并可对用户名、用户真实姓名以外的信息进行修改。`,
      },
      {
        title: `2.免费使用权`,
        content: `用户有权免费使用${Config.platformName}的彩票投注系统以及免费获得彩票资讯。`,
      },
      {
        title: `3.彩票查询权`,
        content: `用户通过${Config.platformName}购彩成功后，有权免费在${Config.platformName}查询所购买的彩票的状态。`,
      },
      {
        title: `4.奖金获得权`,
        content: `用户通过${Config.platformName}购彩成功的，若彩票中奖，用户有权获得相应奖金。`,
      },
      {
        title: `5.帐户核查权`,
        content: `用户可以随时对帐户进行资金余额核查。`,
      },
      {
        title: `6.申请提款权`,
        content: `用户在任何时间都可对自己的余额申请提款，${Config.platformName}在核对用户资金来源正常的情况下，在收到提款请求3个工作日内将用户预付款中需提取的款项转帐到用户注册的银行账户上。用户提款转帐所产生的银行费用由用户承担。 当用户余额小于转帐所需的银行费用时，请及时联系客服处理`,
      },
    ],
  },
  {
    button: `四、用户义务`,
    list: [
      {
        title: `1.全面遵守本协议的义务`,
        content: `在注册登记成为${Config.platformName}用户之前，须认真阅读、理解本协议各条款，一经注册成功即视为同意本协议全部条款，用户有义务全面遵守本协议。`,
      },
      {
        title: `2.如实提供用户资料义务`,
        content: `为保障用户的合法权益，避免在中奖时出现用户注册资料与真实情况不符导致兑奖不能等情况，请用户按照真实、全面、准确的原则提供用户资料。因用户资料不真实、不全面、不准确造成不能兑奖、不能提款等情况，由用户承担全部责任。`,
      },
      {
        title: `3.对应注册义务`,
        content: `严禁任何形式的重复注册及多次恶意注册，因此而造成的一切后果，由用户自行承担。同时，为保证用户的安全性，用户应以一个银行卡帐号对应一个用户真实姓名名，因银行卡帐号与用户真实姓名不能一一对应而产生的不利后果，由用户自行承担。`,
      },
      {
        title: `4.保持用户名义务`,
        content: `为保护用户帐户的安全性，用户名、用户真实姓名、银行卡号一经注册确认后，不得再行更改。`,
      },
      {
        title: `5.保护帐户资料义务`,
        content: `用户帐户资料包括用户密码、个人帐号以及用户帐 号操作所需的资料。用户务必对其帐户资料自行保密，以免帐号资料被盗用或篡改。因用户保护不周导致帐户资料被盗用或篡改而给用户造成的任何损失及法律责任由用户自行承担。`,
      },
      {
        title: `6.遵守网络安全管理的义务`,
        content: `
          用户不得利用${Config.platformName}制作,复制和传播下列信息：
          一、煽动抗拒、破坏宪法和法律、行政法规实施的.
          二、煽动颠覆国家政权,推翻社会主义制度的.
          三、煽动分裂国家、破坏国家统一的.
          四、煽动民族仇恨、民族歧视，破坏民族团结的.
          五、捏造或者歪曲事实,散布谣言,扰乱社会秩序的.
          六、宣扬迷信、淫秽、色情、赌博、暴力、凶杀、恐  怖、教唆犯罪的.
          七、公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的.
          八、损害国家机关信誉的.
          九、其他违反宪法、法律、行政法规、行政规章、地方性法规的行为.`,
      },
    ],
  },
  {
    button: `五、CP的权力`,
    list: [
      {
        title: `1.管理用户帐户的权利`,
        content: `如果用户提供的资料包含有第四条第3款多次恶意注册信息或第7款所列信息，${Config.platformName}保留冻结其用户账户、注销其用户帐户或者限制其使用全部或部分服务内容的权利。一经发现用户利用${Config.platformName}制作、复制和传播的信息明显属于第三条第7款所列信息之一的，${Config.platformName}将立即采取屏蔽信息、发出警告、直至关闭用户帐户等措施。`,
      },
      {
        title: `2.修改本协议条款的权利`,
        content: `${Config.platformName}有权在必要时修改协议条款，协议条款一旦发生变动，将会在${Config.platformName}相关页面上提示或公告修改内容。如果不同意所改动的内容，用户可以主动取消获得的服务。如果用户继续享用服务，则视为接受服务条款的变动。${Config.platformName}保留随时修改或中断服务而不需知照用户的权利。主要包括以下情况：
一、增加或减少彩票品种${Config.platformName}的彩票品种以当期可以实现购买的品种为准，长期或临时增加或减少彩票品种均不需事先告知用户。
二、调整彩票销售截止时间的权利。${Config.platformName}有权根据彩票种类和当期销售情况调整彩票销售截止时间，而不需事先告知用户。`,
      },
      {
        title: `3.用户向${Config.platformName}提出购彩请求`,
        content: `${Config.platformName}有权从其余额提取请求购彩所需的款项金额。`,
      },
      {
        title: `4.兑奖、领取奖金、分配奖金的权利和义务`,
        content: `在彩票中奖情况下，由${Config.platformName}根据中奖比例计算出的中奖金额，直接汇入中奖用户。`,
      },
      {
        title: `5.制止公款购彩的权利`,
        content: `${Config.platformName}有权拒绝非个人资金通过${Config.platformName}购买彩票，一旦发现有款项自非个人帐户资金转入用户预付款帐户，${Config.platformName}有权采取强行将款项退回原帐户、终止协议等措施。${Config.platformName}并将向有关管理机关报告。`,
      },
      {
        title: `6.制止未满18周岁的未成年人购买彩票的权利`,
        content: `如未成年人提供虚假用户资料冒充成年人的，其在${Config.platformName}进行的一切彩票购买行为将自始无效，由此给${Config.platformName}及其本人造成的损失以及不能领奖的后果均由该未成年人及其法定代理人承担。`,
      },
    ],
  },
  {
    button: `六、CP的义务`,
    list: [
      {
        title: `1.用户帐户资料保护义务`,
        content: `${Config.platformName}对用户帐户资料提供最大限度的安全保护。当${Config.platformName}用户涉嫌盗用他人第三方支付渠道（如：银联、微信、支付宝等）帐户资金，或涉嫌其第三方支付渠道帐户被盗用的，应涉嫌被盗用人或第三方支付公司的要求，在其承诺仅将用户资料用于涉嫌盗用事件并予以保密的前提下，${Config.platformName}将向请求方提供涉嫌盗用人的用户资料。${Config.platformName}用户同意放弃在此情况下向多彩彩票追究任何责任的权利`,
      },
      {
        title: `2.公布中奖情况的义务`,
        content: `在官方彩票发行和销售机构发布中奖结果后，${Config.platformName}以官方彩票发行机构和销售机构公布的中奖情况为准。`,
      },
      {
        title: `3.转帐义务`,
        content: `在达到一定投注量情况下，用户在任何时间都可对自己的余额申请提款，${Config.platformName}在核对用户资金来源正常的情况下，在收到提款请求3个工作日内将用户需提取的款项转帐到用户注册的银行账户上`,
      },
    ],
  },
  {
    button: `七、协议成立、变更和终止`,
    list: [
      {
        title: ``,
        content: `1.因网络故障、超过指定购买时间、金额不足等原因，未能完成购彩的。${Config.platformName}将返还用户预付资金。`,
      },
      {
        title: ``,
        content: `2.${Config.platformName}有权对本协议条款进行变更而无需事先通知用户。`,
      },
      {
        title: ``,
        content: `3.任何一方未能履行本协议规定的任何义务，且在收到另一方发出更正通知15日内未能改正错误的，均被视为自动放弃本协议，协议同时终止。`,
      },
      {
        title: ``,
        content: `4.一经发现公款购彩嫌疑、未成年人购彩嫌疑等本协议禁止的情况，${Config.platformName}有权立即终止协议。`,
      },
    ],
  },
  {
    button: `八、免责条款`,
    danger: `发生下列情况时，${Config.platformName}不予承担任何法律责任：`,
    list: [
      {
        title: `1.用户资料泄露`,
        content: `由于用户将密码告知他人或与他人共享注册帐户，或由于用户的疏忽，由此导致的任何个人资料泄露，以及由此产生的纠纷。
无论何种原因导致的用户资料未授权使用、修改，用户密码、个人帐号或注册信息被未授权篡改、盗用而产生的一切后果。`,
      },
      {
        title: `2.不可抗力及不可预见的情势发生`,
        content: `不可抗力和不可预见情势包括：自然灾害、政府行为、罢工、战争等；黑客攻击、计算机病毒侵入或发作、政府管制、彩票发行和销售机构的原因、彩票出票机或服务的故障、网络故障、国家政策变化、法律法规之变化等。因不可抗力和不可预见情势造成：暂时性关闭，用户资料或购彩指令泄露、丢失、被盗用、被篡改，购彩失败，多彩彩票未能收到购彩指令等，以及由此产生的纠纷。
因不可抗力和不可预见的情势造成本协议不能履行的。`,
      },
      {
        title: `3.用户原因或第三方原因造成损失`,
        content: `由于用户自身原因、或违反法律法规，以及第三方的原因，造成用户无法使用多彩彩票服务或产生其他损失的。`,
      },
      {
        title: `4.用户购彩而产生的损失`,
        content: `用户根据本协议进行购彩而发生的直接、间接、偶然、特殊及继起的损害。`,
      },
      {
        title: `5.用户使用链接或下载资料产生的损害`,
        content: `由于使用与${Config.platformName}链接的其它网站，或者使用通过多彩票下载或取得的资料，造成用户资料泄露、用户电脑系统损坏等情况及由此而导致的任何争议和后果。`,
      },
    ],
  },
  {
    button: `九、合同组成`,
    list: [
      {
        title: ``,
        content: `      ${Config.platformName}主页以及其他页面有关（包括但不限于）会员注册流程、变更流程、购彩流程、会员支付与结算、相关奖励、会员服务等运营内容的细则以及法律声明均为本协议的有效组成部分，是对本协议的解释扩充，与本协议有着相同的法律效力。`,
      },
      {
        title: ``,
        content: `      用户资料隐私保护、网站禁止行为、网站知识产权保护等约定详见《法律声明》。`,
      },
    ],
  },
]

const SecondItem = () => {
  return (
    <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
      <View style={[styles.button, { paddingVertical: 10 }]}>
        <Text style={{ fontSize: 16, color: `#FFF` }}>二、本协议服务范围</Text>
      </View>
      <View style={[styles.agreementWrap, { backgroundColor: `rgba(255,251, 237, 1)` }]}>
        <Text style={[styles.agreementText]}>{`提供购彩平台`}</Text>
      </View>
      <View style={[styles.agreementWrap, { backgroundColor: `rgba(255,251, 237, .8)` }]}>
        <Text style={styles.agreementText}>{`提供彩票相关资讯`}</Text>
      </View>
      <View style={[styles.agreementWrap, { backgroundColor: `rgba(255,251, 237, .6)` }]}>
        <Text style={styles.agreementText}>{`提供彩票信息交互平台`}</Text>
      </View>
      <View style={[styles.agreementWrap, { backgroundColor: `rgba(255,251, 237, .4)` }]}>
        <Text style={styles.agreementText}>{`提供在线预付支付结算服务`}</Text>
      </View>
      <View style={[styles.agreementWrap, { backgroundColor: `rgba(255,251, 237, .3)` }]}>
        <Text style={styles.agreementText}>{`本协议服务范围不包括向注册会员提供
电脑终端及其附属设备、网络和通信等资源`}</Text>
      </View>
    </View>
  )
}

const windowWidth = Dimensions.get(`window`).width

export default class RegisterAgreementPage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={`开户协议`}
          leftIcon={`back`}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <ScrollView>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, color: `#FF4600` }}>导言:</Text>
            <Text style={{ fontSize: 14, color: `#875900`, lineHeight: 25 }}>{`欢迎您使用CP提供的${Config.platformName}平台服务!
本协议是您与CP公司之间关于您使用${Config.platformName}平台服务所订立的协议，为使用${Config.platformName}平台服务，您应当阅读并遵守《CP开户协议》等规则。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。除非您已阅读并接受本协议所有条款，否则您无权使用${Config.platformName}平台服务。您的下载、安装、使用、登录等行为即视为您已阅读并同意本协议的约束。您保证您在使用本服务时已满18周岁，且具有完全的民事行为能力。`}</Text>
          </View>
          <Image source={require(`../../src/img/img_agreement_head.png`)} style={{ height: 58, width: windowWidth }} />
          <View style={{ backgroundColor: `#FFE082` }}>
            {
              CONTENTS.map((item, index) => {
                if (index === 1) {
                  return <SecondItem key={`content${index}`} />
                }
                return (
                  <View key={`content${index}`} style={{ flex: 1, paddingHorizontal: 10, marginBottom: 10 }}>
                    <View style={styles.button}>
                      <Text style={{ fontSize: 16, color: `#FFF` }}>{item.button}</Text>
                    </View>
                    <View style={{ backgroundColor: `#FFF`, borderRadius: 6, padding: 10 }}>
                      {
                        item.danger ? <Text style={{ color: Config.baseColor, fontSize: 14, fontWeight: `bold`, marginBottom: 5 }}>{item.danger}</Text> : null
                      }
                      {
                        item.list.map((listItem, i) => {
                          return (
                            <View key={`list${i}`} style={{ marginBottom: 5 }} >
                              {
                                listItem.title !== `` ? <Text style={{ color: `#555`, fontSize: 15, fontWeight: `bold`, marginBottom: 5 }}>{listItem.title}</Text> : null
                              }
                              <Text style={{ color: `#666`, fontSize: 14, lineHeight: 23 }}>{listItem.content}</Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  </View>
                )
              })
            }
          </View>
          <Text style={{ textAlign: `center`, color: `#FF4000`, fontSize: 16, fontWeight: `800`, marginVertical: 10 }}>注意事项</Text>
          <Text style={{ marginHorizontal: 20, fontSize: 14, lineHeight: 20, color: `#BD7002` }}>{`1、禁止未满18周岁(未成年)者在本站注册。同时不提倡学生购买彩票，其中也包括在校大学生。
2、为确保您的购买申请能及时成功提交，请您务必在当期购买申请前有足够款项在您的账号。
3、在使用网络支付平台时请注意：无论使何种网络支付系统时都将收取一定的手续费。
4、请确认您的电子邮箱地址为长期使用之有效邮箱。并随时留意查收本站的邮件。
5、有任何疑问请及时与我们取得联系。`}</Text>
          <Text style={{ textAlign: `center`, color: `#BD7002`, fontSize: 14 }} >提醒：购买彩票有风险，在线投注需谨慎</Text>

          <ButtonIos
            containerStyle={styles.confirmBtn}
            styleTextLeft={[{ fontSize: 20, color: `#FFF` }]}
            text='确认'
            onPress={() => {Sound.stop();Sound.play();this.props.navigation.goBack()}}/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({ // FBD553   FFEaa1
  container: {
    flex: 1,
    backgroundColor: `#FBD553`,
  },
  button: {
    backgroundColor: Config.baseColor,
    borderRadius: 12,
    padding: 8,
    width: windowWidth * 3 / 5,
    marginBottom: 10,
    shadowColor: `#000`,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  agreementWrap: {
    padding: 8,
    borderRadius: 5,
  },
  agreementText: {
    fontSize: 17,
    color: `#D1A74D`,
    textAlign: `center`,
  },
  confirmBtn: {
    paddingVertical: 12,
    alignItems: `center`,
    backgroundColor: Config.baseColor,
    borderRadius: 4,
    marginHorizontal: 20,
    marginVertical: 40,
  },
})
