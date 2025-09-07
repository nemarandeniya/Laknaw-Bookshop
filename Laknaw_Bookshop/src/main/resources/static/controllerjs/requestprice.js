window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/requestprice")

    refreshReqPriceTable();
    refreshReqPriceForm();
});

const refreshReqPriceTable = () => {
    requestprices = getajaxServiceRequest("/requestprice/alldata")

    const displayColumnList = [
        { dataType: "function", propertyName: getSupplierName },
        { dataType: "function", propertyName: getItemName },
        { dataType: "text", propertyName: "required_date" },
        { dataType: "function", propertyName: getStatus }
    ];

    fillDataIntoTable4(ReqPriceTable, requestprices, displayColumnList, refillReqpriceForm, deleteReqprice, printReqprice, userPrivilege)
    $("#ReqPriceTable").dataTable();
}

const getItemName = (ob) => {
    let items = ""
    ob.items.forEach((element, index) => {//loop wenwa each element in ob.items and index eka denwa ape item eke current position eka
        if (index == ob.items.length - 1) {//last item ekada blnw
            items = items + element.itemname
        } else {
            items = items + element.itemname + ","//last item nemenm , danawa
        }
    });
    return items;
    // return ob.items[0].itemname;
}

const getSupplierName = (ob) => {
    return ob.supplier_id.suppliername;
}



const getStatus = (ob) => {


    if (ob.request_price_status_id.name == "Pending") {
        return '<p class="pending"> Pending </p>';
    } else {
        return '<p class="Completed"> Completed </p>';
    }
}

const refillReqpriceForm = (ob) => {

    $("#collapseWidthExample").collapse("show");
    reqPrice = JSON.parse(JSON.stringify(ob));
    oldReqPrice = ob;

    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername", ob.supplier_id.suppliername)

    reqPriceStatus = getajaxServiceRequest("/requestpricestatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", reqPriceStatus, "name", ob.request_price_status_id.name)

    selectStatus.disabled = ""

    // category = getajaxServiceRequest("/category/alldata");
    // fillDataIntoSelect(selectCategory, "Select Item Category", category, "name", ob.category_id.name)

    // brand = getajaxServiceRequest("/brand/alldata");
    // fillDataIntoSelect(selectBrand, "Select Brand", brand, "name", ob.brand_id.name)

    ItemBySuppliers = getajaxServiceRequest("/item/listBySupplier/" + JSON.parse(selectSupplier.value).id)
    fillDataIntoSelect(selectSelectedItems, "", ItemBySuppliers, "itemname", ob.items.itemname)

    // items = getajaxServiceRequest("/item/listByAvailable")
    // fillDataIntoSelect(selectItems, "Select Item", items, "itemname", ob.items.itemname)

    selectDate.value = ob.required_date
    textNote.value = ob.note


    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/requestprice")
    // console.log(userPrivilege);

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }
}
const refreshReqPriceForm = (ob) => {
    reqPrice = {};
    reqPrice.items = []


    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername")

    reqPriceStatus = getajaxServiceRequest("/requestpricestatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", reqPriceStatus, "name")

    selectStatus.value = JSON.stringify(reqPriceStatus[0]);
    reqPrice.request_price_status_id = reqPriceStatus[0];
    selectStatus.classList.add('is-valid')
    selectStatus.disabled = "disabled"

    items = getajaxServiceRequest("/item/listByAvailable")
    fillDataIntoSelect(selectItems, "Select Item", items, "itemname")

    //set min and max date [YYYY-MM-DD]
    //set min date
    let currentDate = new Date()
    let currentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (currentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentMonth = '0' + currentMonth;
    }
    let currentDay = currentDate.getDate()//[1-31] 
    if (currentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        currentDay = '0' + currentDay;
    }
    selectDate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

    //set max date
    currentDate.setDate(currentDate.getDate() + 14)

    let maxcurrentMonth = currentDate.getMonth() + 1//[0-11] me format ekta ena nisa 1k ekathu krnwa
    if (maxcurrentMonth < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentMonth = '0' + maxcurrentMonth;
    }
    let maxcurrentDay = currentDate.getDate()//[1-31] 
    if (maxcurrentDay < 10) {//9 wenkn thiyenne 1 ankyak nisa eka issrahin 0 dnw
        maxcurrentDay = '0' + maxcurrentDay;
    }
    selectDate.max = currentDate.getFullYear() + "-" + maxcurrentMonth + "-" + maxcurrentDay;

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";
}

// const filerbrandbyCategory = () => {
//     //path param
//     brandByCategory = getajaxServiceRequest("/brand/listbycategory/" + JSON.parse(selectCategory.value).id);
//     fillDataIntoSelect(selectBrand, "Select Brand", brandByCategory, "name")
// }

// const filterItemByCategoryAndBrand = () => {

//     console.log(JSON.parse(selectCategory.value).id);
//     console.log(JSON.parse(selectBrand.value).id);

//     itemByCategoryAndBrand = getajaxServiceRequest("/item/listByCategoryAndBrand?categoryid=" + JSON.parse(selectCategory.value).id + "&brandid=" + JSON.parse(selectBrand.value).id)
//     fillDataIntoSelect(selectItem, "Select item", itemByCategoryAndBrand, "itemname")

// }

const filterItemBySuppliers = () => {
    ItemBySuppliers = getajaxServiceRequest("/item/listBySupplier/" + JSON.parse(selectSupplier.value).id)
    fillDataIntoSelect(selectItems, "", ItemBySuppliers, "itemname")
}

const btnAddOneItem = () => {
    let selectedItem = JSON.parse(selectItems.value)

    reqPrice.items.push(selectedItem)
    fillDataIntoSelect(selectSelectedItems, "", reqPrice.items, "itemname")

    //hqma item ekema id eka array ekkta dala selectedItem eke id eka eke thiyenwda blnw
    let extInd = ItemBySuppliers.map(item => item.id).indexOf(selectedItem.id);
    if (extInd != -1) {//check if index exists
        ItemBySuppliers.splice(extInd, 1)//remove 1 selecteditem from allitemlist
    }
    fillDataIntoSelect(selectItems, "", ItemBySuppliers, "itemname");
}

const btnAddAllItem = () => {
    for (const item of ItemBySuppliers) {
        //add one by one item into selected item list from all item list
        reqPrice.items.push(item)
    }
    //refill selected item list
    fillDataIntoSelect(selectSelectedItems, "", reqPrice.items, "itemname")
    items = [];
    //refill allitem list
    fillDataIntoSelect(selectItems, "", items, "itemname")
}

const btnRemoveOneItem = () => {
    let selecteditem = JSON.parse(selectSelectedItems.value)

    items.push(selecteditem)//add selected item into allItems list 
    fillDataIntoSelect(selectItems, "", items, "itemname")

    //get selecteditem index from selecteditemlist into exind variable
    let extInd = reqPrice.items.map(item => item.id).indexOf(selecteditem.id)
    if (extInd != -1) {//check if index exists
        reqPrice.items.splice(extInd, 1)//remove selecteditem from selecteditemlist
    }
    fillDataIntoSelect(selectSelectedItems, "", reqPrice.items, "itemname")
}

const btnRemoveAllItem = () => {
    for (const item of reqPrice.items) {
        items.push(item)
    }
    //refill allitem side
    fillDataIntoSelect(selectItems, "", items, "itemname")
    reqPrice.items = []
    //refill selecteditem side
    fillDataIntoSelect(selectSelectedItems, "", reqPrice.items, "itemname")
}

// const filterSuppliersByItem = () => {
//     SuppliersByItem = getajaxServiceRequest("/supplier/listByItem/" + JSON.parse(selectItem.value).id)
//     fillDataIntoSelect(selectSupplier, "Select Supplier", SuppliersByItem, "suppliername")
// }


const updateReqPrice = () => {
    console.log("update");

    let errors = getErrors();
    if (errors == "") {
        let updates = checkreqPriceFormUpdates();
        if (updates == "") {
            alert("Nothing updated..!")
        } else {
            //user confirmation
            let userConfirm = confirm("Are You sure to update following changes? \n " + updates);
            if (userConfirm) {
                //call put service request
                let putServiceResponce;

                $.ajax("/requestprice", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(reqPrice),
                    success: function (successResponceOb) {
                        putServiceResponce = successResponceOb;
                    },
                    error: function (failResponceOb) {
                        putServiceResponce = failResponceOb;
                    },
                });

                //check put service Responce
                if (putServiceResponce == "OK") {
                    alert("Update Sucessfully..!");
                    $("#collapseWidthExample").collapse("hide");
                    refreshReqPriceTable();
                    reqPriceForm.reset();
                    refreshReqPriceForm();
                } else {
                    alert("Update not complete : \n" + putServiceResponce);
                }
            }
        }
    }
}

const deleteReqprice = (ob) => {
    let userConfirm = confirm("Are you sure to delete following Request price \n" + ob.request_no);
    if (userConfirm) {
        let deleteServiceResponce;

        $.ajax("/requestprice", {
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(ob),
            async: false,
            success: function (data) {
                deleteServiceResponce = data;
            },
            error: function (errorData) {
                deleteServiceResponce = errorData;
            }

        });
        if (deleteServiceResponce == "OK") {
            alert("Delete successfully..!");
            refreshReqPriceTable();
            reqPriceForm.reset();
            refreshReqPriceForm();
        } else {
            alert("Delete Not Competed : " + deleteServiceResponce);
        }
    }
}

const checkreqPriceFormUpdates = () => {

    let updates = "";
    if (reqPrice.supplier_id.id != oldReqPrice.supplier_id.id) {
        updates = updates + "Request price Supplier is changed..!"
    }
    if (reqPrice.request_price_status_id.id != oldReqPrice.request_price_status_id.id) {
        updates = updates + "Request price Status is changed..!"
    }
    if (reqPrice.items.length != oldReqPrice.items.length) {
        updates = updates + "request price Items is changed..!"
    }
    if (reqPrice.required_date != oldReqPrice.required_date) {
        updates = updates + "Request price date is changed..!"
    }
    if (reqPrice.note != oldReqPrice.note) {
        updates = updates + "Request price note is changed..!"
    }
    return updates;
}

const getErrors = () => {
    let errors = ""
    if (reqPrice.supplier_id == null) {
        selectSupplier.classList.add("is-invalid")
    }
    if (reqPrice.items == null) {
        selectItem.classList.add("is-invalid")
    }
    if (reqPrice.request_price_status_id == null) {
        selectStatus.classList.add("is-invalid")
    }
    if (reqPrice.required_date == null) {
        selectDate.classList.add("is-invalid")
    }

    // if (reqPrice.item_id == null) {
    //     selectItem.classList.add("is-invalid")
    // }

    return errors;
}

const reqPriceSubmitButton = () => {
    console.log(reqPrice);

    let errors = getErrors();
    if (errors == "") {
        const userConfirmation = confirm('Are you sure to submit...?');

        if (userConfirmation) {
            let postServiceResponce = getHTTPAjaxRequest("/requestprice", "POST", reqPrice)
            if (postServiceResponce == "OK") {
                alert("Save Successfully..!");
                $("#collapseWidthExample").collapse("hide");
                refreshReqPriceTable();
                reqPriceForm.reset();
                refreshReqPriceForm();
            } else {
                alert("Fail to submit Request Price form \n" + postServiceResponce);
            }
        }
    } else {
        alert("Form has following error...\n" + errors);
    }
}

const printReqprice = (ob) => {
    const reqPrice = ob;

    tdReqNo.innerText = reqPrice.reqno
    tdSupplier.innerText = reqPrice.supplier_id.suppliername
    tdReqDate.innerText = reqPrice.request_date
    tdItem.innerText = reqPrice.items.itemname
    tdStatus.innerText = reqPrice.request_price_status_id.name
    $('#printModalReqPrice').modal('show');
}

const printReqPriceDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printReqPriceData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printReqPriceTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Request Price Order</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + ReqPriceTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}