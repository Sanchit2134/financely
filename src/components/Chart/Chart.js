import React from "react";
import { Line, Pie } from "@ant-design/charts";

const Chart = ({ sortedTransaction }) => {

  const data = sortedTransaction.map((item) => {
    return {
      year: item.date,
      value: item.amount,
    };
  });

  const spendingData = sortedTransaction
    .filter((item) => item.type === "expense")
    .map((item) => {
      return {
        tag: item.tag,
        amount: item.amount,
      };
    });

    //To keep a track of or keep a stored amount of data while we iterate over the array
    const finalSpendingData = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if(!acc[key]){ 
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }else{
            acc[key].amount += obj.amount;
        }
        return acc;
    }, {}) // added initial value here

    const newSpendings = [
        {tag: "Food", amount: 0},
        {tag: "education", amount: 0},
        {tag: "Office", amount: 0},
    ];

    spendingData.forEach((item) => {
        if(item.tag == "food"){
            newSpendings[0].amount += item.amount;
        }else if(item.tag == "education"){
            newSpendings[1].amount += item.amount;
        }
        else{
            newSpendings[2].amount += item.amount;
        }
    });

  const config = {
    data: data,
    width: 400,
    autofit: true,
    xField: "date",
    yField: "amount",
  };

  const SpendinConfig = {
    data:  Object.values(newSpendings),
    width: 400,
    angleField: "amount",
    colorField: "tag",
  };

  let chart;
  let pieChart;

  return (
    <div className="chart-wrapper">
      <div>
        <h2>Transaction Chart</h2>
        <Line
          {...config}
          onReady={(chartInstance) => {
            chart = chartInstance;
          }}
        />
      </div>  
      <div>
        <h2>Your Spending</h2>
        <Pie
          {...SpendinConfig}
          onReady={(chartInstance) => {
            pieChart = chartInstance;
          }}
        />  
      </div>
    </div>
  );
};
export default Chart;




