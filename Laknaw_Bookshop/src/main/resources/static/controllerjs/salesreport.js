const GenerateSalesReport = () => {
    let datalist = getajaxServiceRequest("/invoicereport/salesbydate?startdate=" + startDate.value + "&enddate=" + endDate.value + "&type=" + typeSelect.value)

    let salesDataList = new Array();
    let data = new Array();
    let label = new Array();

    for (const index in datalist) {
        // name,quantity atribute thiyena ob ekk hdla ekta array eke thiyena data set krnw
        let object = new Object()
        object.name = datalist[index][0]//1st array eke 1st eka
        object.quantity = datalist[index][1]//1st array eke 2nd eka
        salesDataList.push(object)

        data.push(datalist[index][1])
        label.push(datalist[index][0])
    }

    let displayColumnList = [
        { dataType: "text", propertyName: "name" },
        { dataType: "text", propertyName: "quantity" },
    ]
    fillDataIntoReportTable(salesReportTable, salesDataList, displayColumnList)

    //generate chart

    const ctx = document.getElementById('myChart');

    //chart eka destroy krnwa.mokada eka parak chart eka argena thawa parak chart eka gnna ona unoth gnna wenne chart eka destroy krla
    if (Chart.getChart(myChart) != undefined) {
        Chart.getChart(myChart).destroy();
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: '# of Amount',
                data: data,
                backgroundColor: generateHexColors(data.length),
                hoverOffset: 4,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    console.log(salesDataList);
}

const printSalesReport = () => {

    const ctx = document.getElementById('myChart');


    let newTab = window.open();
    // let printView = "<head><title>Print User Report</title><link rel='stylesheet' href='resources/bootstrap-5.2.3/css/bootstrap.min.css'></head>"
    //     + "<body>" + "<h1>User report>/h1><br><img src='" + ctx.toDataURL() + "'/>"



    newTab.document.write(
        ''
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + salesReportTable.outerHTML + "<img src='" + ctx.toDataURL() + "'/>" +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}