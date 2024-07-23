const price = 1.87; 
const cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

const denomValue = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
};

document.getElementById('purchase-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const cash = parseFloat(document.getElementById('cash').value);
    const changeDueElem = document.getElementById('change-due');

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        changeDueElem.innerHTML = "Status: INSUFFICIENT_FUNDS";
    } else if (cash === price) {
        changeDueElem.innerHTML = "No change due - customer paid with exact cash";
    } else {
        const change = cash - price;
        const result = getChange(change, cid);

        if (result.status === "INSUFFICIENT_FUNDS") {
            changeDueElem.innerHTML = "Status: INSUFFICIENT_FUNDS";
        } else if (result.status === "CLOSED") {
            changeDueElem.innerHTML = `Status: CLOSED ${formatChange(result.change)}`;
        } else {
            changeDueElem.innerHTML = `Status: OPEN ${formatChange(result.change)}`;
        }
    }
});

function getChange(change, cid) {
    let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2);
    let changeArr = [];
    let remainingChange = change;

    if (Number(totalCid) < change) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    if (Number(totalCid) === change) {
        return { status: "CLOSED", change: cid.map(money => [money[0], money[1]]).filter(money => money[1] > 0) };
    }

    for (let i = cid.length - 1; i >= 0; i--) {
        const denom = cid[i][0];
        let denomTotal = cid[i][1];
        const denomValueUnit = denomValue[denom];
        let amount = 0;

        while (remainingChange >= denomValueUnit && denomTotal >= denomValueUnit) {
            remainingChange -= denomValueUnit;
            remainingChange = parseFloat(remainingChange.toFixed(2)); // avoid floating point precision issues
            denomTotal -= denomValueUnit;
            amount += denomValueUnit;
        }

        if (amount > 0) {
            changeArr.push([denom, amount]);
        }
    }

    if (remainingChange > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    
    return { status: "OPEN", change: changeArr };
}

function formatChange(changeArr) {
    return changeArr.map(denom => `${denom[0]}: $${denom[1].toFixed(2)}`).join(" ");
}
