import React, { Component } from 'react'
import { Card, Col, Row, Layout, Alert, message, Button } from 'antd';

import Common from './Common';

class Employer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { payroll, web3 } = this.props;
    const updateInfo = (error, result) => {
      if (!error) {
        this.checkEmployee();
      }
    }

    this.getPaidEvt = payroll.GetPaid(updateInfo);

    this.checkEmployee();
  }

  componentWillUnmount() {
    this.getPaidEvt.stopWatching();
  }

  checkEmployee = () => {
    const { payroll, account, web3 } = this.props;
    web3.eth.getBalance(account, (err, result)=>{
      this.setState({
        balance: web3.fromWei(result.toNumber())
      });
    });
    payroll.employees.call(account, {from: account}).then(value=>{
      this.setState({
        salary: web3.fromWei(value[1].toNumber()),
        lastPaidDate: new Date(value[2].toNumber() * 1000).toString()
      });
    });
  }

  getPaid = () => {
    const { payroll, account, web3 } = this.props;
    payroll.getPaid({from: account}).then(res=>{
      message.info('You have been paied!');
    });
  }

  renderContent() {
    const { salary, lastPaidDate, balance } = this.state;

    if (!salary || salary === '0') {
      return   <Alert message="你不是员工" type="error" showIcon />;
    }

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="薪水">{salary} Ether</Card>
          </Col>
          <Col span={8}>
            <Card title="上次支付">{lastPaidDate}</Card>
          </Col>
          <Col span={8}>
            <Card title="帐号金额">{balance} Ether</Card>
          </Col>
        </Row>

        <Button
          type="primary"
          icon="bank"
          onClick={this.getPaid}
        >
          获得酬劳
        </Button>
      </div>
    );
  }

  render() {
    const { account, payroll, web3 } = this.props;

    return (
      <Layout style={{ padding: '0 24px', background: '#fff' }}>
        <Common account={account} payroll={payroll} web3={web3} />
        <h2>个人信息</h2>
        {this.renderContent()}
      </Layout >
    );
  }
}

export default Employer
