window.addEventListener("load", () => {
    // tooltip enable
    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/GRN")

    //call table refresh function
    refreshGrnTable();

    //call form refresh function
    refreshGrnForm();
});


const refreshGrnTable = () => {

    grns = getajaxServiceRequest("/grn/alldata")

    const displayPropertyList = [
        { dataType: "function", propertyName: getPurchaseorder },
        { dataType: "text", propertyName: "supplierInvoice_no" },
        { dataType: "text", propertyName: "received_date" },
        { dataType: "text", propertyName: "total_amount" },
        { dataType: "text", propertyName: "net_amount" },
        { dataType: "function", propertyName: getGrnStatus },
    ];

    fillDataIntoTable2(
        grnTable,
        grns,
        displayPropertyList,
        printgrn,
    );

    $("#grnTable").dataTable();
}
const getPurchaseorder = (ob) => {
    return ob.purchaseOrder_id.order_code;//item_id.itemname
}

const getGrnStatus = (ob) => {
    if (ob.grnstatus_id.name == "Received") {
        return '<p class="status-received"> Received </p>';
    } if (ob.grnstatus_id.name == "Partially Completed") {
        return '<p class="status-partiallyCompleted"> Partially Completed </p>';
    } else {
        return '<p class="status-completed"> Completed </p>';
    }

}

const getNetAmount = () => {

    const totalAmount = parseFloat(document.getElementById('textTotalAmount').value);
    const discount = parseFloat(document.getElementById('textDiscount').value);
    console.log(totalAmount);
    console.log(discount);

    const safeDiscount = isNaN(discount) ? 0 : discount

    const NetAmount = totalAmount - safeDiscount
    console.log(NetAmount);
    grn.discount = safeDiscount

    textNetAmount.value = parseFloat(NetAmount).toFixed(2);
    textNetAmount.classList.add('is-valid');
    grn.net_amount = document.getElementById('textNetAmount').value;

}

const refreshGrnForm = () => {
    grn = new Object()
    grn.grnHasItemList = new Array()

    grnFormId.reset();

    purchaseOrders = getajaxServiceRequest("/purchaseorder/listByStatus")
    fillDataIntoSelectTwo(selectPurchaseOrder, "Select Purchase Order", purchaseOrders, "order_code", "supplier_id.suppliername")

    grnStatus = getajaxServiceRequest("/grnstatus/alldata");
    fillDataIntoSelect(selectStatus, "Select your status", grnStatus, "name")

    selectStatus.value = JSON.stringify(grnStatus[0]);
    grn.grnstatus_id = grnStatus[0];
    selectStatus.classList.add('is-valid')
    selectStatus.disabled = "disabled"

    //set max date
    let currentDate = new Date()//Wed Sep 24 2025 20:05:06 GMT+0530---> me thama date eka ena format eka
    let currentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (currentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentMonth = '0' + currentMonth;
    }
    let currentDay = currentDate.getDate()//[1-31] 
    if (currentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentDay = '0' + currentDay;
    }
    selectDate.max = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    //set max date
    currentDate.setDate(currentDate.getDate() - 14)

    let maxcurrentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (maxcurrentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentMonth = '0' + maxcurrentMonth;
    }
    let maxcurrentDay = currentDate.getDate()//[1-31] 
    if (maxcurrentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentDay = '0' + maxcurrentDay;
    }
    selectDate.min = currentDate.getFullYear() + "-" + maxcurrentMonth + "-" + maxcurrentDay;

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";

    refreshGrnInnerForm();
}

const refreshGrnInnerForm = () => {
    grnHasItem = new Object();

    btnItemUpdate.classList.add("d-none")
    btnItemAdd.classList.remove("d-none");

    // selectItem.disabled = "disabled"
    //clear input field values
    textUnitPrice.value = "";
    selectItem.value = "";
    textReceivedQty.value = "";
    textTotalQty.value = "";
    textLinePrice.value = "";
    // textSalesPrice.value = "";

    //clear input field's valditions
    selectItem.classList.remove('is-valid')
    textUnitPrice.classList.remove('is-valid')
    textReceivedQty.classList.remove('is-valid')
    textTotalQty.classList.remove('is-valid')
    textLinePrice.classList.remove('is-valid')
    // textSalesPrice.classList.remove('is-valid')

    //refresh inner grnItem table
    const displayInnerTableColumnList = [
        { dataType: "function", propertyName: getItemName },
        { dataType: "decimal", propertyName: "unit_price" },
        { dataType: "text", propertyName: "receivedQuantity" },
        { dataType: "decimal", propertyName: "line_price" },
        // { dataType: "decimal", propertyName: "sales_price" },
    ];

    fillDataIntoInnerTable(grnInnerTable, grn.grnHasItemList, displayInnerTableColumnList, refillGrnItemInnerForm, deleteGrnItemInnerForm)
}

const getItemName = (ob) => {
    return ob.item_id.itemname;
}

const refillGrnItemInnerForm = (ob) => {

    grnHasItem = JSON.parse(JSON.stringify(ob))
    oldgrnHasItem = JSON.parse(JSON.stringify(ob))

    items = getajaxServiceRequest("/item/alldata")
    fillDataIntoSelect(selectItem, "Select Item", items, "itemname", grnHasItem.item_id.itemname)

    selectItem.disabled = "disabled"

    textUnitPrice.value = parseFloat(grnHasItem.unit_price)
    textUnitPrice.classList.add('is-valid')
    textReceivedQty.value = parseFloat(grnHasItem.receivedQuantity)
    textReceivedQty.classList.add('is-valid')
    textTotalQty.value = parseFloat(grnHasItem.totalQuantity)
    textTotalQty.classList.add('is-valid')
    textLinePrice.value = parseFloat(grnHasItem.line_price)
    textLinePrice.classList.add('is-valid')
    // textSalesPrice.value = parseFloat(grnHasItem.sales_price)

    btnItemUpdate.classList.remove("d-none")
    btnItemAdd.classList.add("d-none");
}
const deleteGrnItemInnerForm = (ob) => {

    // let userConfirm = window.confirm("Are You sure to remove following item..?")
    // if (userConfirm) {
    //     let extIndex = grn.grnHasItemList.map(grnitem => grnitem.item_id.id).indexOf(ob.item_id.id)
    //     if (extIndex != -1) {
    //         grn.grnHasItemList.splice(extIndex, 1);
    //     }
    //     refreshGrnInnerForm();
    //     calculateSumOfLinePrices();
    // }

    Swal.fire({
        title: "Are you sure to remove following item..!",
        text: grnHasItem.item_id.barcode,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            let extIndex = grn.grnHasItemList.map(grnitem => grnitem.item_id.id).indexOf(ob.item_id.id)
            if (extIndex != -1) {
                grn.grnHasItemList.splice(extIndex, 1);
            }
            refreshGrnInnerForm();
            calculateSumOfLinePrices();
            Swal.fire({
                title: "Item remove successfully..!",
                icon: "success"
            });
        }
    })

}

const updateGrnItemInnerForm = () => {
    console.log(grnHasItem);
    console.log(grn.grnHasItemList);

    if (grnHasItem.quantity != oldgrnHasItem.quantity) {
        Swal.fire({
            title: "Are you sure to update following item..!",
            text: grnHasItem.item_id.barcode,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Yes, Add',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Item update successfully..!",
                    icon: "success"
                });
                grnHasItem.grnHasItemList[innerFormIndex] = grnHasItem
                refreshGrnInnerForm();
                calculateSumOfLinePrices()
            }
        })
    } else {
        window.alert("form hasn't any changes..!")
        Swal.fire({
            title: "form hasn't any changes..!",
            icon: error
        });
    }
}

const submitGrnInnerForm = () => {

    console.log(grnHasItem);
    console.log(grn.grnHasItemList);

    Swal.fire({
        title: "Are you sure to add following item..!",
        text: grnHasItem.item_id.barcode,
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
            grn.grnHasItemList.push(grnHasItem)
            refreshGrnInnerForm();
            calculateSumOfLinePrices()
        }
    })
}

const getlinePrice = () => {

    if (textReceivedQty.value > 0) {
        const unitPrice = parseFloat(document.getElementById('textUnitPrice').value);
        const quantity = parseInt(document.getElementById('textReceivedQty').value);

        const linePrice = unitPrice * quantity
        grnHasItem.line_price = linePrice;

        textLinePrice.value = parseFloat(linePrice).toFixed(2);
        textLinePrice.classList.add('is-valid')
    } else {
        grnHasItem.quantity = null
        grnHasItem.line_price = null

        textReceivedQty.classList.add('is-invalid')
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";

    }
}

// const filerTotalAmountbyPorderCode = async () => {
//     //selectPurchaseOrder eke thiyenne ob ekk eken order code eka gnnw
//     // const orderCode = JSON.parse(selectPurchaseOrder.value).order_code;

//     const orderByCode = getajaxServiceRequest("/purchaseorder/listByOrderCode/" + JSON.parse(selectPurchaseOrder.value).id)


//     // try {//fetch eken HTTP GET req spring backend ekta fetch krnw
//     //     //awit--> response eka enkn pause krn innw
//     //     const res = await fetch(`/purchaseorder/totalAmountByOrderCode/${orderCode}`)
//     //     const amount = await res.json();

//     //     if (amount !== null) {
//     //         textTotalAmount.value = Number(amount).toFixed(2);
//     //     } else {
//     //         textTotalAmount.value = '';
//     //         console.warn('No total amount returned for this order code.');
//     //     }
//     // } catch (error) {
//     //     console.error('Error fetching total amount:', error);
//     // }
// }

//function for get unit price , total quantity and sales price



const getUnitPriceAndTotalQty = () => {

    //get unit price
    console.log(JSON.parse(selectPurchaseOrder.value));

    const pricelist = getajaxServiceRequest("/itempricelist/listByItemAndPriceList/" + JSON.parse(selectItem.value).id + "/" + JSON.parse(selectPurchaseOrder.value).pricelist_id.id)

    textUnitPrice.value = parseFloat(pricelist.unitprice).toFixed(2)
    grnHasItem.unit_price = parseFloat(textUnitPrice.value).toFixed(2)
    textUnitPrice.classList.add('is-valid')

    //get ordered quantity
    const purchaseorder = getajaxServiceRequest("/purchaseorderhasitem/alldata/" + JSON.parse(selectPurchaseOrder.value).id + "/" + JSON.parse(selectItem.value).id)
    textTotalQty.value = purchaseorder.quantity
    console.log(purchaseorder);

    grnHasItem.totalQuantity = textTotalQty.value
    console.log(grnHasItem.totalQuantity);

    textTotalQty.classList.add('is-valid')

    //get sales price 
    const unitPrice = parseFloat(document.getElementById('textUnitPrice').value);
    const salesprice = unitPrice * 1.25

    grnHasItem.sales_price = parseFloat(salesprice).toFixed(2);
    // textSalesPrice.value = parseFloat(salesprice).toFixed(2)
    // grnHasItem.sales_price = textSalesPrice.value
    // textSalesPrice.classList.add('is-valid')
}

const filterItemByExistence = () => {
    selectedItem = JSON.parse(selectItem.value)

    //selected item ekw id eka pricelistitems eke thiyenwda blnw ekin eka
    let extIndex = grn.grnHasItemList.map(grnitem => grnitem.item_id.id).indexOf(selectedItem.id)

    if (extIndex > -1) {
        Swal.fire({
            title: "item already exists.please select another..!",
            text: errors,
            icon: "error"
        });
        refreshGrnInnerForm()
    } else {
        getUnitPriceAndTotalQty()
    }
}

const filterItemByPorderCode = () => {

    console.log(JSON.parse(selectPurchaseOrder.value).id);

    const ItemByordercode = getajaxServiceRequest("/item/listByPorder/" + JSON.parse(selectPurchaseOrder.value).id)
    fillDataIntoSelect(selectItem, "select item", ItemByordercode, "itemname")
}

const getErrors = () => {
    let errors = ""
    if (grn.purchaseOrder_id == null) {
        errors = errors + "Please select Purchase order..!";
    }
    if (grn.grnstatus_id == null) {
        errors = errors + "Please select Status..!";
    }
    if (grn.received_date == null) {
        errors = errors + "Please select received date..!";
    }
    if (grn.supplierInvoice_no == null) {
        errors = errors + "Please select Supplier Invoice Number.!";
    }
    if (grn.total_amount == null) {
        errors = errors + "Please enter total amount..!";
    }
    if (grn.grnHasItemList.length == 0) {
        errors = errors + "Please select GRN item..!";
    }
    return errors;
}

const grnSubmitButton = (ob) => {

    grn.supplierInvoice_no = document.getElementById('textSupplierInvoiceNo').value;
    grn.total_amount = document.getElementById('textTotalAmount').value;
    grn.net_amount = document.getElementById('textNetAmount').value;

    let errors = getErrors();
    if (errors) {
        Swal.fire({
            title: "Form has following error...",
            text: errors,
            icon: "error"
        });
    }

    Swal.fire({
        title: "Are you sure to Add following grn",
        // text: ob.grn_code,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add this GRN!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/grn", "POST", grn)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshGrnForm();
                grnFormId.reset();
                refreshGrnTable();
            } else {
                Swal.fire({
                    title: "Fail to submit grn form ",
                    text: postServiceResponce,
                    icon: "error"
                });
            }
        }
    })
}
const printgrn = (ob) => {
    const grnPrint = ob;

    tdPOrder.innerText = grnPrint.purchaseOrder_id.order_code;
    tdInvoiceNo.innerText = grnPrint.supplierInvoice_no;
    tdReceivedDate.innerText = grnPrint.received_dates;
    tdTotalAmount.innerText = grnPrint.total_amount;
    tdNetAmount.innerText = grnPrint.net_amount;
    tdStatus.innerText = grnPrint.grnstatus_id.name;
    $('#printModalGrn').modal('show');
};

const printGrnDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printGRNData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
const printGrnTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print GRN</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + grnTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
