window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Price_list")

    refreshPricelistTable();
    refreshpriceListForm();


});

const refreshPricelistTable = () => {
    pricelists = getajaxServiceRequest("/pricelist/alldata")

    const displayColumnList = [
        { dataType: "text", propertyName: "pricelist_no" },
        { dataType: "text", propertyName: "received_date" },
        { dataType: "text", propertyName: "deadline_date" },
        { dataType: "function", propertyName: getReqPrice },
        { dataType: "function", propertyName: getPriceListStatus },
    ];

    fillDataIntoTable(priceListTable, pricelists, displayColumnList, refillpriceListForm, deletepriceList, printpriceList, userPrivilege)
    $("#priceListTable").dataTable();

    //notify if deadline passed 
    const expiredList = getajaxServiceRequest("/pricelist/expiredlist");

    expiredList.forEach(pl => {
        Swal.fire({
            title: "Deadline passed for Pricelist No: " + pl.pricelist_no,
            text: " please change status!",
            icon: "warning"
        });
    });

}

const getPriceListStatus = (ob) => {

    if (ob.pricelist_status_id.name == "Valid") {
        return '<p class="status-valid pricelistStatus"> Valid </p>';
    } else {
        return '<p class="status-expired pricelistStatus"> Expired </p>';
    }
}

//filter item by requstprice
const filterItemByRequstPrice = () => {
    ItemByReqPrice = getajaxServiceRequest("/item/listByReqPrice/" + JSON.parse(selectReqPrice.value).id)
    fillDataIntoSelect(selectItem, "Select Item", ItemByReqPrice, "itemname")
}

const filterItemByExistence = () => {
    selectedItem = JSON.parse(selectItem.value)

    //selected item ekw id eka pricelistitems eke thiyenwda blnw ekin eka
    let extIndex = pricelist.pricelistitems.map(plitem => plitem.item_id.id).indexOf(selectedItem.id)

    if (extIndex > -1) {
        Swal.fire({
            title: "item already exists.please select another..!",
            text: errors,
            icon: "error"
        });
        refreshItemPricelistInnerForm()
    }
}

const getReqPrice = (ob) => {
    return ob.request_price_id.reqno;
}

const refillpriceListForm = (ob) => {

    $("#collapseWidthExample").collapse("show");
    pricelist = JSON.parse(JSON.stringify(ob));
    oldPricelist = ob;

    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername", ob.supplier_id.suppliername)
    selectSupplier.classList.add('is-valid');

    reqprice = getajaxServiceRequest("/requestprice/requestno");
    fillDataIntoSelect(selectReqPrice, "Select Request Number", reqprice, "reqno", ob.request_price_id.reqno)
    selectReqPrice.classList.add('is-valid');

    priceListStatus = getajaxServiceRequest("/pricelistStatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", priceListStatus, "name", ob.pricelist_status_id.name)
    selectStatus.classList.add('is-valid');
    selectStatus.disabled = ""


    selectReceivedDate.value = ob.received_date
    selectReceivedDate.classList.add('is-valid');

    selectDeadlineDate.value = ob.deadline_date
    selectDeadlineDate.classList.add('is-valid');

    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Price_list")
    // console.log(userPrivilege);

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }

    refreshItemPricelistInnerForm()
}
const refreshpriceListForm = (ob) => {

    pricelist = new Object();
    pricelist.pricelistitems = new Array()

    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername")
    // selectSupplier.disabled = ""

    reqprice = getajaxServiceRequest("/requestprice/requestno");
    fillDataIntoSelect(selectReqPrice, "Select Request Number", reqprice, "reqno")

    priceListStatus = getajaxServiceRequest("/pricelistStatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", priceListStatus, "name")

    selectStatus.value = JSON.stringify(priceListStatus[0]);
    pricelist.pricelist_status_id = priceListStatus[0];
    selectStatus.classList.add('is-valid');
    selectStatus.disabled = "disabled"

    //set min and max date [YYYY-MM-DD]
    //set max date for received date and min date for deadline date
    let currentDate = new Date()   //Wed Sep 24 2025 20:05:06 GMT+0530---> me thama date eka ena format eka
    let currentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (currentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentMonth = '0' + currentMonth;
    }
    let currentDay = currentDate.getDate()//[1-31] 
    if (currentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentDay = '0' + currentDay;
    }
    selectReceivedDate.max = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;
    selectDeadlineDate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    //set max date for deadline date 
    currentDate.setDate(currentDate.getDate() + 60)
    console.log(currentDate);

    let maxcurrentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (maxcurrentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentMonth = '0' + maxcurrentMonth;
    }
    let maxcurrentDay = currentDate.getDate()//[1-31] 
    if (maxcurrentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentDay = '0' + maxcurrentDay;
    }
    selectDeadlineDate.max = currentDate.getFullYear() + "-" + maxcurrentMonth + "-" + maxcurrentDay;

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";

    refreshItemPricelistInnerForm();
}

const refreshItemPricelistInnerForm = () => {
    itemPriceList = new Object();

    selectItem.value = "";
    textUnitPrice.value = "";

    //refresh inner itempricelist table
    const displayInnerTableColumnList = [
        { dataType: "function", propertyName: getItemName },
        { dataType: "decimal", propertyName: "unitprice" }
    ];

    fillDataIntoInnerTable(priceListInnerTable, pricelist.pricelistitems, displayInnerTableColumnList, refillItemPriceListInnerForm, deleteItemPriceListInnerForm)

    btnItemUpdate.classList.add("d-none")
    btnItemAdd.classList.remove("d-none");

    console.log(pricelist.pricelistitems);

}

const getItemName = (ob) => {
    return ob.item_id.itemname;//ob.item_id.itemname
}

const refillItemPriceListInnerForm = (ob, index) => {

    innerFormIndex = index

    itemPriceList = JSON.parse(JSON.stringify(ob))
    olditemPriceList = JSON.parse(JSON.stringify(ob))

    items = getajaxServiceRequest("/item/alldata")
    fillDataIntoSelect(selectItem, "Select Item", items, "itemname", itemPriceList.item_id.itemname)

    textUnitPrice.value = parseFloat(itemPriceList.unitprice)

    btnItemUpdate.classList.remove("d-none")
    btnItemAdd.classList.add("d-none");
    console.log(itemPriceList);
    console.log(pricelist.pricelistitems);
}

const deleteItemPriceListInnerForm = (ob) => {
    let userConfirm = window.confirm("Are You sure to remove following item..?")
    if (userConfirm) {
        let extIndex = pricelist.pricelistitems.map(pricelistitems => pricelistitems.item_id.id).indexOf(ob.item_id.id)
        if (extIndex != -1) {
            pricelist.pricelistitems.splice(extIndex, 1);
        }
        refreshItemPricelistInnerForm()
    }
}

const updateItemPriceListInnerForm = () => {
    console.log(itemPriceList);
    console.log(pricelist.pricelistitems);

    if (itemPriceList.unitprice != olditemPriceList.unitprice) {
        let userConfirm = window.confirm("Are you sure to update following item..!")
        if (userConfirm) {
            window.alert("Item update successfully..!")
            pricelist.pricelistitems[innerFormIndex] = itemPriceList;
            refreshItemPricelistInnerForm();
        }
    } else {
        window.alert("form hasn't any changes..!")
    }
}

const submitItemPriceListInnerForm = () => {

    let userConfirm = window.confirm("Are you sure to add following item..!")
    if (userConfirm) {
        window.alert("Item add successfully..!")
        pricelist.pricelistitems.push(itemPriceList)
        refreshItemPricelistInnerForm();
        console.log(itemPriceList);
        console.log(pricelist.pricelistitems);
    }
}

const filerReqPriceBySupplier = () => {
    //path param
    ReqPriceBySupplier = getajaxServiceRequest("/requestprice/listBySupplier/" + JSON.parse(selectSupplier.value).id);
    fillDataIntoSelect(selectReqPrice, "Select Request No", ReqPriceBySupplier, "reqno")
}

const checkPriceListFormUpdates = () => {
    let updates = "";
    if (pricelist.request_price_id.id != oldPricelist.request_price_id.id) {
        updates = updates + "Price List Request Price is changed..! \n";
    }
    if (pricelist.supplier_id.id != oldPricelist.supplier_id.id) {
        updates = updates + "Price List Supplier is changed..! \n";
    }
    if (pricelist.received_date != oldPricelist.received_date) {
        updates = updates + "Price List Received date is changed..! \n";
    }
    if (pricelist.note != oldPricelist.note) {
        updates = updates + "Price List note is changed..! \n";
    }
    if (pricelist.deadline_date != oldPricelist.deadline_date) {
        updates = updates + "Price List Deadline Date is changed..! \n";
    }
    if (pricelist.pricelist_status_id.id != oldPricelist.pricelist_status_id.id) {
        updates = updates + "Price List Status is changed..! \n";
    }
    return updates;
}
const getErrors = () => {
    let errors = "";
    if (pricelist.received_date == null) {
        selectReceivedDate.classList.add("is-invalid");
    }
    if (pricelist.deadline_date == null) {
        selectDeadlineDate.classList.add("is-invalid");
    }
    if (pricelist.request_price_id == null) {
        selectReqPrice.classList.add("is-invalid");
    }
    if (pricelist.supplier_id == null) {
        selectSupplier.classList.add("is-invalid");
    }
    if (pricelist.pricelist_status_id == null) {
        selectStatus.classList.add("is-invalid");
    }
    return errors;
}

const pricelistSubmitButton = () => {
    console.log(pricelist);

    let errors = getErrors();

    if (errors) {
        Swal.fire({
            title: "Form has following error...",
            text: errors,
            icon: "error"
        });
    }

    Swal.fire({
        title: "Are you sure to Add following PriceList",
        text: pricelist.pricelist_no,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/pricelist", "POST", pricelist)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshPricelistTable();
                priceListForm.reset();
                refreshpriceListForm();
                // printInvoice(invoice);
            } else {
                Swal.fire({
                    title: "Fail to submit Price List form",
                    text: postServiceResponce,
                    icon: "error"
                });
            }
        }
    })
}

const updatePricelist = () => {
    console.log("update");

    let errors = getErrors();
    if (errors == "") {
        let updates = checkPriceListFormUpdates();
        if (updates == "") {
            Swal.fire({
                title: "Nothing updated..!",
                icon: "info"
            })
        } else {
            Swal.fire({
                title: "Are you sure to update following Pricelist",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Yes, update!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service request
                    let putServiceResponce = getHTTPAjaxRequest("/pricelist", "PUT", pricelist)
                    //check put service Responce
                    if (putServiceResponce == "OK") {
                        Swal.fire({
                            title: "Update successfully..!",
                            icon: "success"
                        });
                        $("#collapseWidthExample").collapse("hide");
                        refreshPricelistTable();
                        priceListForm.reset();
                        refreshpriceListForm();
                    } else {
                        Swal.fire({
                            title: "Update not complete : \n",
                            text: putServiceResponce,
                            icon: "error"
                        });
                    }
                }
            })
        }
    }
}


const deletepriceList = (ob) => {
    sweetAlert(
        "Are you sure to delete following Pricelist?",
        ob.pricelist_no,
        "warning",
        true,
        'Yes, delete..!',
        'Cancel'
    ).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponce = getHTTPAjaxRequest("/pricelist", "DELETE", ob);
            if (deleteServiceResponce == "OK") {
                Swal.fire({
                    title: "Delete successfully..!",
                    icon: "success"
                });
                // alert("Delete successfully..!");
                refreshPricelistTable();
                priceListForm.reset();
                refreshpriceListForm();
            } else {
                Swal.fire({
                    title: "Delete Not Competed ",
                    text: deleteServiceResponce,
                    icon: "error"
                });
            }
        }
    })
}

const printpriceList = (ob) => {
    const pricelist = ob

    tdpricelistno.innerText = pricelist.pricelist_no
    tdRecevedDate.innerText = pricelist.received_date
    tdDeadlinedate.innerText = pricelist.deadline_date
    tdReqPrice.innerText = pricelist.request_price_id.request_no
    tdStatus.innerText = pricelist.pricelist_status_id.name
    $('#printModalPriceList').modal('show');
}

const printPricelistDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printPricelistData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printPricelistTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Purchase Order</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + priceListTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}