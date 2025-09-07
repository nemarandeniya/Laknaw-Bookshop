//create  function for get service request
const getajaxServiceRequest = (url) => {
    let getServiceResponce;

    $.ajax(url, {
        contentType: "application/json",
        type: "GET",
        async: false,
        success: function (data) {
            console.log("Success " + data);
            getServiceResponce = data;//assign response data to getServiceResponce
        },
        error: function (resData) {
            console.log("Error " + resData);
            getServiceResponce = [];//set getServiceResponce to a empty array
        }
    });
    return getServiceResponce;
}

const fillDataIntoSelect = (fieldId, message, dataList, propertyname, selectedValue) => {
    fieldId.innerHTML = "";//clear any options inside html elements

    //add default massage
    if (message != '') {
        const msgOption = document.createElement("option");
        msgOption.innerText = message;
        msgOption.selected = "selected";
        msgOption.disabled = "disabled";
        fieldId.appendChild(msgOption);
    }
    //create options and add to the select field
    dataList.forEach((element) => {
        const option = document.createElement("option");

        option.value = JSON.stringify(element);
        option.innerText = element[propertyname];

        //check for selected value
        if (selectedValue == element[propertyname]) {
            option.selected = true;
        }

        //add option to the select field
        fieldId.appendChild(option);
    });
}
const fillDataIntoSelectTwo = (fieldId, message, dataList, propertyname1, propertyname2) => {
    fieldId.innerHTML = "";//clear any options inside html elements

    //add default massage
    if (message != '') {
        const msgOption = document.createElement("option");
        msgOption.innerText = message;
        msgOption.selected = "selected";
        msgOption.disabled = "disabled";
        fieldId.appendChild(msgOption);
    }
    //create options and add to the select field
    dataList.forEach((element) => {
        const option = document.createElement("option");

        option.value = JSON.stringify(element);

        const value1 = element[propertyname1];

        let value2 = "";

        if (propertyname2.includes(".")) {
            let parts = propertyname2.split(".");
            value2 = element;
            for (let part of parts) {
                value2 = value2 ? value2[part] : ""
            }
        } else {
            value2 = element[propertyname2];
        }

        option.innerText = value1 + "(" + value2 + ")";
        //check for selected value
        // if (selectedValue == element[propertyname]) {
        //     option.selected = true;
        // }

        //add option to the select field
        fieldId.appendChild(option);
    });
}
//send http request to a server
const getHTTPAjaxRequest = (url, method, ob) => {
    let serviceResponce;

    $.ajax(url, {
        type: method,
        contentType: "application/json",
        data: JSON.stringify(ob),
        async: false,
        success: function (data) {
            console.log(" Success " + data);
            serviceResponce = data;
        },
        error: function (resData) {
            console.log(" Fail" + resData);
            serviceResponce = resData;
        }
    });
    return serviceResponce;

    // URL: "/employee" - This is the URL to which the AJAX request is being sent.
    // Type: "POST" - This specifies the HTTP method used for the request.
    // ContentType: "application/json" - This specifies the content type of the data being sent in the request body. In this case, it's JSON data.
    // Data: JSON.stringify(employee) - This converts the employee object into a JSON string, which is then sent as the request body.
    // Async: false - This option makes the AJAX request synchronous, meaning that JavaScript execution will pause until the request completes.
    // Success: This is a callback function that will be executed if the request is successful. It takes data as a parameter, which represents the response from the server. In this case, it logs "success" followed by the response data to the console and assigns the response data to the variable postServiceResponce.
    // Error: This is a callback function that will be executed if the request encounters an error. It takes resData as a parameter, which represents the error response from the server. In this case, it logs "Fail" followed by the error response data to the console and assigns the error response data to the variable postServiceResponce.
}

//generate random colors for report
function generateHexColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colors.push(randomColor)
    }
    return colors;
}

//Sweet alert function
const sweetAlert = (title, text, icon, showCancelBtn, confirmText, cancelBtnText) => {

    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: showCancelBtn,
        confirmButtonText: confirmText,
        cancelButtonText: cancelBtnText
    })
}

//print functions
const printDataBtn = (modelTableId) => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
        '<div class="text-center">' +
        '<img src="resources/image/Laknaw.jpg" style="height: 100px; width: 100px; border-radius: 50%; margin-top: 10px;">' +
        '</div>'
        + '<div class="d-flex justify-content-center">' +
        modelTableId.outerHTML +
        '</div>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printTableBtn = (tableId, title) => {

    const newTab = window.open();
    newTab.document.write(
        '<html><head>' +
        '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
        ' <link rel="stylesheet" href="resources/fontawesome-free-6.4.2/css/all.css" />' +
        '</head>' +
        '<body class="text-center">' +
        '<div class="container mt-3">' +
        //logo
        '<div class="row">' +
        '<div class="col-12 text-center">' +
        '<img src="resources/image/Laknaw.jpg" style="height: 100px; width: 100px; border-radius: 50%; margin-top: 10px;">' +
        '</div>' +
        '</div>' +
        //title
        '<div class="row mb-3">' +
        '<div class="col-12 text-center">' +
        '<h2 class="fw-bold">' + title + '</h2>' +
        '</div>' + '</div>'
        //table
        + tableId.outerHTML +
        '</div>' +
        '<script> $(".modify-button").css("display","none")</script>' +
        '</body>' +
        '</html>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const calculateSumOfLinePrices = () => {

    let total = 0;//line prices wla sum eka store krnne methana
    //class name eken line prices select kragena hama element ekk through loop wenw
    document.querySelectorAll('.line-price').forEach(element => {
        //element.textContent --> kiynne text inside <td>,parse float eken eka decimal number ekk krnw
        total += parseFloat(element.textContent) || 0//text eka empty or number ekk newe nm enne NaN.error avoid krgnna ona nisa 0 krnwa
    })

    textTotalAmount.value = total.toFixed(2)
    textTotalAmount.classList.add('is-valid')

    return total;
}












//current date eka aragena eka string ekkta harawnwa. ethkota enne mehema '2025-07-26T05:02:15.457Z'
//itapsse eka T akuren split krama element 2 ka array ekk hedenwa.eke palaweni element eka gnnwa.["2025-07-26","05:02:15.457Z"]
//  const today = new Date().toISOString().split('T')[0]
