window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Invoice")

    //enable select2 library
    // $('.form-select').select2(
    //     { theme: "bootstrap-5" }
    //     // {dropdownParent: $('')}
    // );

    refreshInvoiceTable();
    refreshInvoiceForm();
});

const refreshInvoiceTable = () => {
    invoice = getajaxServiceRequest("/invoice/alldata")

    const displayColumnList = [
        { dataType: "text", propertyName: "invoiceNumber" },
        { dataType: "function", propertyName: getCustomerNo },
        { dataType: "function", propertyName: getPaymentType },
        { dataType: "text", propertyName: "invoiceDate" },
        { dataType: "text", propertyName: "total_amount" },
    ];

    fillDataIntoTable2(invoiceTable, invoice, displayColumnList, printInvoice, userPrivilege)
    $("#invoiceTable").dataTable();
}

const getCustomerNo = (ob) => {
    return ob.customer_id.customerNumber;
}

const getPaymentType = (ob) => {
    return ob.paymentType_id.name;
}



const refreshInvoiceForm = () => {
    invoice = new Object()
    invoice.invoiceHasItemList = new Array()

    invoiceFormId.reset();

    paymentMethod = getajaxServiceRequest("/paymenttype/alldata")
    fillDataIntoSelect(selectPaymentmethod, "Select Payment Type", paymentMethod, "name")

    cardType = getajaxServiceRequest("/cardtype/alldata")
    fillDataIntoSelect(selectCardType, "Select Card Type", cardType, "name")

    customer = getajaxServiceRequest("/customer/alldata")
    fillDataIntoSelect(selectCustomer, "Select Customer", customer, "customerName")



    refreshInvoiceInnerForm();
}

const refreshInvoiceInnerForm = (ob) => {

    invoiceHasItem = new Object();

    btnItemUpdate.classList.add("d-none")
    btnItemAdd.classList.remove("d-none");

    category = getajaxServiceRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", category, "name")

    subCategory = getajaxServiceRequest("/subcategory/alldata");
    fillDataIntoSelect(selectSubCategory, "Select Sub Category", subCategory, "name")

    items = getajaxServiceRequest("/item/alldata")
    fillDataIntoSelect(selectItem, "Select Item", items, "itemname")


    selectSalesPrice.value = "";
    selectItem.value = "";
    textQty.value = "";
    textDiscount.value = "";
    textLinePrice.value = "";
    textDiscount.value = "";

    //clear input field's valditions
    selectCategory.classList.remove('is-valid')
    selectSubCategory.classList.remove('is-valid')
    selectItem.classList.remove('is-valid')
    selectSalesPrice.classList.remove('is-valid')
    textQty.classList.remove('is-valid')
    textLinePrice.classList.remove('is-valid')
    textDiscount.classList.remove('is-valid')

    //refresh inner invoiceItem table
    const displayInnerTableColumnList = [
        { dataType: "function", propertyName: getItemName },
        { dataType: "function", propertyName: getSalesPrice },
        { dataType: "text", propertyName: "quantity" },
        { dataType: "decimal", propertyName: "discount" },
        { dataType: "decimal", propertyName: "line_price" },
    ];

    fillDataIntoInnerTable(invoiceInnerTable, invoice.invoiceHasItemList, displayInnerTableColumnList, refillInvoiceItemInnerForm, deleteInvoiceItemInnerForm)
}

const getSalesPriceByItem = () => {
    pricebyItem = getajaxServiceRequest("/inventory/listByItem/" + JSON.parse(selectItem.value).id);
    fillDataIntoSelect(selectSalesPrice, "Select Sales Price", pricebyItem, "sales_price")
    console.log(pricebyItem);

    // selectSalesPrice.value = parseFloat(pricebyItem[0].sales_price).toFixed(2)
    // selectSalesPrice.classList.add('is-valid')

}

const filterItemByExistence = () => {
    selectedItem = JSON.parse(selectItem.value)

    //selected item ekw id eka pricelistitems eke thiyenwda blnw ekin eka
    let extIndex = invoice.invoiceHasItemList.map(invitem => invitem.item_id.id).indexOf(selectedItem.id)

    if (extIndex > -1) {
        Swal.fire({
            title: "item already exists.please select another..!",
            text: errors,
            icon: "error"
        });
        refreshInvoiceInnerForm()
    } else {
        getSalesPriceByItem()
    }
}

const getItemName = (ob) => {
    return ob.item_id.itemname;
}

const getSalesPrice = (ob) => {
    return ob.inventory_id.sales_price;
}

const filtersubCategorybyCategory = () => {
    // query param
    subCategoriesByCategory = getajaxServiceRequest("/subcategory/listbycategory?categoryid=" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect(selectSubCategory, "Select Sub-Category", subCategoriesByCategory, "name")
}

const filterItembySubCategory = () => {
    // path param
    itemBySubCategory = getajaxServiceRequest("/item/listBysubCategory/" + JSON.parse(selectSubCategory.value).id);
    console.log(itemBySubCategory);

    fillDataIntoSelect(selectItem, "Select Item", itemBySubCategory, "itemname")
}


const handleCustomerTypeChange = () => {
    const customerType = JSON.parse(selectCustomer.value).customerName
    const loyaltyPointRow = document.getElementById('loyaltyPointRow');

    loyaltyPointRow.classList.remove("d-none")

    if (customerType == "Walk-In-Customer") {
        loyaltyPointRow.classList.add("d-none")
    } else {
        loyaltyPointRow.classList.remove("d-none")

        const loyaltyPoint = getajaxServiceRequest("/customer/loyaltiPointById/" + JSON.parse(selectCustomer.value).id)

        textLoyaltyPoint.placeholder = parseFloat(loyaltyPoint).toFixed(2)
    }

}


const handlePaymentMethodChange = () => {

    const method = JSON.parse(selectPaymentmethod.value).name
    const chequeColumn = document.getElementById('cardTypeId');
    const transferColumn = document.getElementById('transactionNoId');
    const cardpaymentNoRow = document.getElementById('cardPaymentNoRow');
    console.log(method);

    //Unhide everything first
    //eka method ekk select klama unnecessary eka hide wenw.but aphu wena method ekk select kalama eka show wenne na
    // mokda api d-none eka add kra witharai nisa.eka nisa mulinma okkoma hide krnw.ethkota function eka call wena wena
    // parata mulinma okkoma unhide wela itpsse necessary ewa method eka anuwa hide wenwa 
    cardpaymentNoRow.classList.remove("d-none")
    transferColumn.classList.remove("d-none")
    chequeColumn.classList.remove("d-none")
    let paidAmount;

    if (method === 'cash') {
        cardpaymentNoRow.classList.add("d-none")

        textPaidAmount.classList.remove('is-valid')
        textPaidAmount.disabled = ""
        textPaidAmount.value = "";
    } else if (method === 'card') {
        cardpaymentNoRow.classList.remove("d-none")

        //card net amount eka paid amount ekata set krnw
        paidAmount = parseFloat(document.getElementById('textNetAmount').value)
        textPaidAmount.value = paidAmount.toFixed(2)
        textPaidAmount.classList.add('is-valid')
        textPaidAmount.disabled = "disabled"

        getBalance();
    } else {
        // method eka select nttn
        cardpaymentNoRow.classList.add("d-none")
    }
}



const getNetAmount = () => {
    const loyaltyRedeem = parseFloat(document.getElementById('textLoyaltyPoint').value)
    const totalAmount = parseFloat(document.getElementById('textTotalAmount').value)

    //loyalty point adu krnne nattn loyalty point eka 0 danwa(nttn null watenne) nttn dana loyalty point gana total amount eken adu krnwa
    const safeLoyaltyPoints = isNaN(loyaltyRedeem) ? 0 : loyaltyRedeem
    const netAmount = totalAmount - safeLoyaltyPoints
    invoice.loyalty_points = safeLoyaltyPoints
    console.log(safeLoyaltyPoints)
    console.log(netAmount);


    invoice.net_amount = netAmount
    textNetAmount.value = parseFloat(netAmount).toFixed(2)
    textNetAmount.classList.add('is-valid')
    console.log(JSON.stringify(invoice));
}

const getBalance = () => {

    paidAmount = parseFloat(document.getElementById('textPaidAmount').value);

    const netAmount = parseFloat(document.getElementById('textNetAmount').value);
    // const balance = JSON.parse(document.getElementById('textBalance').value);
    invoice.paid_amount = paidAmount.toFixed(2)

    const balance = paidAmount - netAmount;
    textBalance.value = parseFloat(balance).toFixed(2)
    invoice.balance = parseFloat(textBalance.value).toFixed(2)
    textBalance.classList.add('is-valid')
}

const getlinePrice = () => {
    const salesPricejsonOb = JSON.parse(document.getElementById('selectSalesPrice').value);
    const salesPrice = parseFloat(salesPricejsonOb.sales_price);
    const discountPercentage = parseFloat(document.getElementById('textDiscount').value);
    const quantity = parseInt(document.getElementById('textQty').value);

    const calulateDiscount = parseFloat(salesPrice * discountPercentage)

    if (textQty.value > 0) {
        const totalPrice = salesPrice * quantity;
        const totalDiscount = totalPrice * discountPercentage
        //blnwa discount eka NaN da kiyla Nan nm 0 dnwa nttn discount price eka dnwa
        //mehema dnne discount eka parsefloat klama value ekk nttn enne Nan kiyla.ethkota calculation eka krnna ba
        //parseFloat-->converts string to a number 
        const safeDiscount = isNaN(totalDiscount) ? 0 : totalDiscount

        const linePrice = (totalPrice) - safeDiscount;
        invoiceHasItem.line_price = linePrice;
        invoiceHasItem.discount = safeDiscount



        textLinePrice.value = parseFloat(linePrice).toFixed(2);
        textLinePrice.classList.add('is-valid')

        //textqty eke value eka user correct kroth waradila thibila eke thibba invalid class eka ain krnw
        textQty.classList.remove('is-invalid')
    } else {
        console.log("ddddd");

        invoiceHasItem.quantity = null
        invoiceHasItem.line_price = null

        textQty.classList.add('is-invalid')
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";

    }
}

const getDiscount = () => {

    const discountdata = getajaxServiceRequest("/seasonaldiscount/getdiscount/" + JSON.parse(selectCategory.value).id)
    //textDiscount
    console.log(discountdata);

    const today = new Date()
    const startDate = new Date(discountdata[0].startDate)
    const endDate = new Date(discountdata[0].endDate)

    if (startDate <= today && today <= endDate) {
        console.log("jjj");

        const discountPercentage = discountdata[0].discount_percentage
        const discount = discountPercentage / 100
        console.log(discount);

        textDiscount.value = discount
        textDiscount.classList.add('is-valid')
        // invoiceHasItem.discount = textDiscount.value
    } else {
        console.log("kk");

        textDiscount.value = "0.00"
        textDiscount.classList.remove('is-valid')
        invoiceHasItem.discount = 0

    }
}

const SumOfLinePrices = () => {

    let total = 0;//line prices wla sum eka store krnne methana
    //class name eken line prices select kragena hama element ekk through loop wenw
    document.querySelectorAll('.line-price').forEach(element => {
        //element.textContent --> kiynne text inside <td>,parse float eken eka decimal number ekk krnw
        total += parseFloat(element.textContent) || 0//text eka empty or number ekk newe nm enne NaN.error avoid krgnna ona nisa 0 krnwa
    })

    textTotalAmount.value = total.toFixed(2)
    textTotalAmount.classList.add('is-valid')
    invoice.total_amount = document.getElementById('textTotalAmount').value

    getNetAmount()
    return total;
}

const refillInvoiceItemInnerForm = (ob, index) => {

    innerFormIndex = index

    invoiceHasItem = JSON.parse(JSON.stringify(ob))
    oldinvoiceHasItem = JSON.parse(JSON.stringify(ob))

    items = getajaxServiceRequest("/item/alldata")
    fillDataIntoSelect(selectItem, "Select Item", items, "itemname", invoiceHasItem.item_id.itemname)

    pricebyItem = getajaxServiceRequest("/inventory/listByItem/" + JSON.parse(selectItem.value).id);
    fillDataIntoSelect(selectSalesPrice, "Select Sales Price", pricebyItem, "sales_price", ob.inventory_id.sales_price)

    category = getajaxServiceRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", category, "name", ob.category_id.name)

    subCategoriesByCategory = getajaxServiceRequest("/subcategory/listbycategory?categoryid=" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect(selectSubCategory, "Select Sub-Category", subCategoriesByCategory, "name", ob.subcategory_id.name)

    itemBySubCategory = getajaxServiceRequest("/item/listBysubCategory/" + JSON.parse(selectSubCategory.value).id);
    fillDataIntoSelect(selectItem, "Select Item", itemBySubCategory, "itemname", invoiceHasItem.item_id.itemname)

    selectItem.disabled = "disabled"

    textQty.value = parseFloat(invoiceHasItem.quantity)
    textDiscount.value = parseFloat(invoiceHasItem.discount)
    textLinePrice.value = parseFloat(invoiceHasItem.line_price)

    btnItemUpdate.classList.remove("d-none")
    btnItemAdd.classList.add("d-none");
}

const deleteInvoiceItemInnerForm = (ob) => {

    let userConfirm = window.confirm("Are You sure to remove following item..?")
    if (userConfirm) {
        let extIndex = invoice.invoiceHasItemList.map(invoiceitem => invoiceitem.item_id.id).indexOf(ob.item_id.id)
        if (extIndex != -1) {
            invoice.invoiceHasItemList.splice(extIndex, 1);
        }
        refreshInvoiceInnerForm()
        calculateSumOfLinePrices();
    }

}

const updateInvoiceItemInnerForm = () => {
    console.log(invoiceHasItem);
    console.log(invoice.invoiceHasItemList);

    if (invoiceHasItem.quantity != oldinvoiceHasItem.quantity) {
        let userConfirm = window.confirm("Are you sure to update following item..!")
        if (userConfirm) {
            invoice.invoiceHasItemList[innerFormIndex] = invoiceHasItem
            refreshInvoiceInnerForm();
            calculateSumOfLinePrices();
            window.alert("Item update successfully..!")
        }
    } else {
        window.alert("form hasn't any changes..!")
    }
}

const submitInvoiceInnerForm = () => {


    console.log(invoiceHasItem);
    console.log(invoice.invoiceHasItemList);

    Swal.fire({
        title: "Are you sure to add following item..!",
        text: invoiceHasItem.item_id.itemname,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Item add successfully..!",
                icon: "success"
            });
            invoice.invoiceHasItemList.push(invoiceHasItem)
            refreshInvoiceInnerForm();
            SumOfLinePrices();
        }
    })
}


const getErrors = () => {
    let errors = ""
    // if (invoice.supplier_id == null) {
    //     errors = errors + "Please select supplier..!";
    // }
    // if (purchaseorder.required_date == null) {
    //     errors = errors + "Please select required date..!";
    // }
    // if (purchaseorder.total_amount == null) {
    //     errors = errors + "Please enter total amount..!";
    // }
    // if (purchaseorder.purchaseOrderHasItemList.length == 0) {
    //     errors = errors + "Please select order item..!";
    // }

    return errors;
}



const invoiceSubmitButton = () => {
    console.log("Full invoice:", JSON.stringify(invoice));
    let errors = getErrors();

    if (errors) {
        Swal.fire({
            title: "Form has following error...",
            text: errors,
            icon: "error"
        });
    }

    Swal.fire({
        title: "Are you sure to Add following invoice",
        text: invoice.invoiceNumber,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/invoice", "POST", invoice)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshInvoiceForm();
                invoiceFormId.reset();
                refreshInvoiceTable();
                // printInvoice(invoice);
            } else {
                Swal.fire({
                    title: "Fail to submit invoice form ",
                    text: postServiceResponce,
                    icon: "error"
                });
            }
        }
    })
}

const printInvoice = (ob) => {
    const tBody = document.getElementById('itemTableBody')
    tBody.innerHTML = '';

    ob.invoiceHasItemList.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                       <td>${item.item_id.itemname}</td>
                       <td>${item.inventory_id.sales_price.toFixed(2)}</td>
                       <td>${item.quantity}</td>
                       <td>${item.line_price.toFixed(2)}</td>
                       `;
        tBody.appendChild(tr)
    });


    if (ob.customer_id.id === 1) {
        loyaltyredeemtr.classList.add("d-none")
        pointDetailsId.classList.add("d-none")
        tdTotalAmount.innerHTML = ob.total_amount.toFixed(2);
        tdNetAmount.innerHTML = ob.net_amount.toFixed(2);
        tdPaidAmount.innerHTML = ob.paid_amount.toFixed(2);
        invoiceDateId.innerHTML = ob.invoiceDate
        tdBalance.innerHTML = ob.balance.toFixed(2);
        ThankId.innerText = "Thank You for shopping with us!\n Visit again!"
    } else {
        tdTotalAmount.innerHTML = ob.total_amount.toFixed(2);
        tdLoyaltyRedeem.innerHTML = ob.loyalty_points.toFixed(2);
        tdNetAmount.innerHTML = ob.net_amount.toFixed(2);
        tdPaidAmount.innerHTML = ob.paid_amount.toFixed(2);
        invoiceDateId.innerHTML = ob.invoiceDate
        tdBalance.innerHTML = ob.balance.toFixed(2);

        loyaltyredeemtr.classList.remove("d-none")
        pointDetailsId.classList.remove("d-none")
        tdCustomerName.innerHTML = ob.customer_id.customerName;
        tdLoyaltyPoints.innerHTML = ob.customer_id.privious_loyaltypoints.toFixed(2);
        tdRedeemedPoints.innerHTML = ob.loyalty_points.toFixed(2);
        tdEarnedPoints.innerHTML = Math.floor(ob.net_amount / 100).toFixed(2); //math.floor-->round wenwa lower integrt ekata
        tdBalancePoints.innerHTML = ob.customer_id.loyalty_points.toFixed(2);
        ThankId.innerText = "Thank You " + ob.customer_id.customerName + "\n Visit again!"
    }

    $('#printInvoiceModal').modal('show');
}

const printInvoiceDataBtn = () => {

    const modalBody = document.getElementById('InvoiceModalBody')

    const newTab = window.open();
    newTab.document.write(`
        <html>
        <head>
        <title>Invoice</title>
        <link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css" />
        <style>
        body {
        width: 500px;
        margin: 0 auto;
        padding:30px;
        }
        </style>
        </head>
        <body>
        ${modalBody.innerHTML}
        </body>
        </html>
        `);

    setInterval(function () {
        newTab.print()
    }, 1000)
}