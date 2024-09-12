import React from 'react'
import { Card , Row } from 'antd'
import Button from '../Button/button'
import './style.css'
const card = ({
  totalBalance,
  income,
  expense,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset
}) => {
  return (
    <div>
      <Row className='my-row'>
        <Card bordered={true} className='my-card'>
          <h2>Current Balance</h2>
          <p>Rs{totalBalance}</p>
          <Button text = 'Reset Balance' blue={true}/>
        </Card>

        <Card bordered={true} className='my-card'>
          <h2>Total income</h2>
          <p>Rs{income}</p>
          <Button text = 'Add income' blue={true} onClick={ showIncomeModal} />
        </Card>

        <Card bordered={true} className='my-card'>
          <h2>Total expense</h2>
          <p>Rs{expense}</p>
          <Button text = 'Add Expense' blue={true} onClick={showExpenseModal}/>
        </Card>

      
      </Row>
    </div>
  )
}

export default card
