window.addEventListener("load", () => {

    // privilegeByRole();
})

// const privilegeByRole = () => {
//     privileges = getajaxServiceRequest("/privilegeByRole")
//     privilegegrant = document.getElementsByClassName("privilegegrant")

//     let hasSelectPrivilede = false;
//     privileges.forEach((element) => {
//         if (element.selpriv === true) {
//             hasSelectPrivilede = true
//         }
//     })

//     if (hasSelectPrivilede) {
//         for (let i = 0; i < privilegegrant.length; i++) {
//             privilegegrant[i].classList.remove("d-none")
//         }
//     }
// }

let invoiceChart;
let pOrderChart;

let dataList = getajaxServiceRequest("/invoicereport/salesforlastmonth")

let data = new Array();
let label = new Array();

for (const index in dataList) {

    label.push(dataList[index][0])
    data.push(dataList[index][1])
}
const ctx = document.getElementById('myDashboardInvoiceChart');
if (invoiceChart) {
    invoiceChart.destroy()
}
invoiceChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: '# quantity',
            data: data,
            backgroundColor: [
                'rgba(235, 54, 96, 1)',
                'rgb(54, 162, 235)',
                'rgba(249, 159, 91, 1)',
                'rgba(182, 255, 86, 1)'
            ],
            hoverOffset: 4,
            borderWidth: 1
        }]
    },
    options: {
        // indexAxis: 'y',
        plugins: {
            title: {
                display: true,
                text: 'Item Sales (Last Month) ',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 30
                },
                color: '#333'
            },
        }
    }

});
let orderdataList = getajaxServiceRequest("/invoicereport/bysixmonth")

let data2 = new Array();
let label2 = new Array();

for (const index in orderdataList) {

    label2.push(orderdataList[index][0])
    data2.push(orderdataList[index][1])
}
const ctx2 = document.getElementById('myDashboardPorderChart');
if (pOrderChart) {
    pOrderChart.destroy()
}
pOrderChart = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: label2,
        datasets: [{
            label: '# amount',
            data: data2,
            backgroundColor: [
                'rgba(0, 128, 128, 1)',
                'rgba(3, 13, 90, 1)',
                'rgba(73, 93, 182, 1)',
                '	rgba(0, 66, 130, 1)',
            ],
            hoverOffset: 4,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Purchase Orders (Last 6 Month) ',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 30
                },
                color: '#333'
            },
            legend: {
                display: true,
                position: "right",
                labels: {
                    color: '#333',
                    font: {
                        size: 13
                    }
                }
            }
        }
    }

});

//get customer count 
// for month
const monthInvoiceCount = getajaxServiceRequest("/invoice/monthInvoiceCount")
const customerCount = document.getElementById('customerCount')
customerCount.innerText = monthInvoiceCount
// for today
const todayInvoiceCount = getajaxServiceRequest("/invoice/todayInvoiceCount")
const todayCustomerCount = document.getElementById('todayCustomerCount')
todayCustomerCount.innerText = todayInvoiceCount

//get employee count 

const currentEmployeeCount = getajaxServiceRequest("/employee/employeeCount")
const employeeCount = document.getElementById('staffCount')
employeeCount.innerText = currentEmployeeCount

const notAvailableItems = getajaxServiceRequest("/item/listByAvailableQuantity")
const lowStock = document.getElementById('lawstock')
const stockNote = document.getElementById('stockNote')
if (notAvailableItems.length != 0) {
    stockLevelIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-2"
         style="color: #ffd22dff; width: 40px; height: 40px; border-radius: 50%; background-color: #f9f9f4ff; display: inline-flex; align-items: center; justify-content: center;"></i>`
    lowStock.innerText = notAvailableItems.length;
    stockNote.innerText = "Items Low in stock!";
} else {
    stockLevelIcon.innerHTML = `<i class="fa-solid fa-circle-check me-2 xl"
        style="color: #0bdd9d; width: 40px; height: 40px; border-radius: 50%; background-color: #f4f7e6; display: inline-flex; align-items: center; justify-content: center;"></i>`
    stockNote.innerText = "Stock level is fine";
    lowStock.innerText = "";

}

//get module list by role
let moduleList = getajaxServiceRequest("/module/listByLoggedUser")
for (let i = 0; i < moduleList.length; i++) {
    const moduleid = moduleList[i];
    const module = document.getElementById(moduleid)
    if (module) {
        module.classList.add("d-none")
    }
}

function userProfileModal() {
    console.log("ddd");

    $('#modelUserProfile').modal('show');
    // const modal = new bootstrap.Modal(document.getElementById('modelUserProfile'));
    // modal.show();
}

