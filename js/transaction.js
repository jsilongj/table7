const identity = 'T4'
const token = "700db75c-822a-43c9-9008-949e66038386"

const header = {
  'identity': identity,
  'token': token,
}

const johnId = "1"
const johnAccount = "10"

// Returns a list of deposit accounts
async function getDepositAccounts(customerId) {
  try {
    const response = await fetch(`http://techtrek-api-gateway.ap-southeast-1.elasticbeanstalk.com/accounts/deposit/${customerId}`, {
      method: 'GET',
      headers: header,
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

async function getDepositAccountBalance(accountId, month, year) {
  try {
    const response = await fetch(
      `http://techtrek-api-gateway.ap-southeast-1.elasticbeanstalk.com/accounts/deposit/${accountId}/balance?month=${month}&year=${year}`, {
        method: 'GET',
        headers: header,
      }
    )
    return await response.json();
  } catch (error) {
    console.log(err);
  }
}

async function getTransactionsDetails(accountId, from, to) {
  try {
    const response = await fetch(
      `http://techtrek-api-gateway.ap-southeast-1.elasticbeanstalk.com/transactions/${accountId}?from=${from}&to=${to}`, {
      method: 'GET',
      headers: header,
    }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

function renderColumnChart(categorySpending) {
  const revenueColumnChart = new CanvasJS.Chart("revenue-column-chart", {
    animationEnabled: true,
    backgroundColor: "transparent",
    theme: "theme2",
    axisX: {
      labelFontSize: 14,
      valueFormatString: "MMM YYYY"
    },
    axisY: {
      labelFontSize: 14,
      prefix: "$"
    },
    toolTip: {
      borderThickness: 0,
      cornerRadius: 0
    },
    data: [
      {
        type: "column",
        yValueFormatString: "$###,###.##",
        dataPoints: [
          { x: new Date("1 Jan 2015"), y: 868800 },
          { x: new Date("1 Feb 2015"), y: 1071550 },
          { x: new Date("1 Mar 2015"), y: 1286200 },
          { x: new Date("1 Apr 2015"), y: 1106900 },
          { x: new Date("1 May 2015"), y: 1033800 },
          { x: new Date("1 Jun 2015"), y: 1017160 },
          { x: new Date("1 Jul 2015"), y: 1458000 },
          { x: new Date("1 Aug 2015"), y: 1165850 },
          { x: new Date("1 Sep 2015"), y: 1594150 },
          { x: new Date("1 Oct 2015"), y: 1501700 },
          { x: new Date("1 Nov 2015"), y: 1588400 },
          { x: new Date("1 Dec 2015"), y: 1648600 }
        ]
      }
    ]
  });

  revenueColumnChart.render();
}

function renderPieChart(categorySpending) {
  const productsRevenuePieChart = new CanvasJS.Chart("products-revenue-pie-chart", {
    animationEnabled: true,
    theme: "theme2",
    legend: {
      fontSize: 14
    },
    toolTip: {
      borderThickness: 0,
      content: "<span style='\"'color: {color};'\"'>{name}</span>: ${y} (#percent%)",
      cornerRadius: 0
    },
    data: [
      {
        indexLabelFontColor: "#676464",
        indexLabelFontSize: 14,
        legendMarkerType: "square",
        legendText: "{indexLabel}",
        showInLegend: true,
        startAngle:  90,
        type: "pie",
        dataPoints: categorySpending
      }
    ]
  });

  productsRevenuePieChart.render();
}

function renderTransactionHistory(transaction) {
  return `




  <tr>
    <td>${transaction.referenceNumber}</td>
    <td>${transaction.date} </td>
    <td>${transaction.amount} </td>
    <td>${transaction.tag} </td>
  </tr>`
}


$(function () {
  let totalSpending = 0;
  let categorySpending = [];
  let transactionList = "";

  getTransactionsDetails(10, '12-07-2019', '01-07-2020').then(transactionDetails => {
    let sum = 0;
    transactionDetails.reduce(function (res, transaction) {
      sum += parseInt(transaction.amount);
      transactionList += renderTransactionHistory(transaction);

      if (!res[transaction.tag]) {
        res[transaction.tag] = { name: transaction.tag, y: 0, legendText: transaction.tag };
        categorySpending.push(res[transaction.tag])
      }
      res[transaction.tag].y += parseInt(transaction.amount);
      return res;
    }, {});

    console.log(categorySpending[0]);
    console.log(sum);
    document.getElementById("total-spending").innerHTML = ` $ ${sum}`;
    document.getElementById("transactionHistory").innerHTML = document.getElementById("transactionHistory").innerHTML + transactionList;
    renderPieChart(categorySpending);
    renderColumnChart();
   });
});



