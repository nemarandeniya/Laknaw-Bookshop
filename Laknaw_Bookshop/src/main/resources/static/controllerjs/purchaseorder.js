window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Purchase_Order")

    refreshPurchaseorderTable();
    refreshPurchaseorderForm();
});

const refreshPurchaseorderTable = () => {
    purchaseorder = getajaxServiceRequest("/purchaseorder/alldata")

    const displayColumnList = [
        { dataType: "text", propertyName: "order_code" },
        { dataType: "function", propertyName: getSupplier },
        { dataType: "text", propertyName: "required_date" },
        { dataType: "function", propertyName: getItemList },
        { dataType: "text", propertyName: "total_amount" },
        { dataType: "function", propertyName: getStatus },
    ];

    fillDataIntoTable3(purchaseorderTable, purchaseorder, displayColumnList, refillpurchaseorderForm, deletePurchaseOrder, printPurchaseorder, userPrivilege)
    $("#purchaseorderTable").dataTable();
}




const getStatus = (ob) => {
    console.log(ob.status);

    if (ob.purchaseorder_status_id.name == "Pending") {
        return '<p class="pending"> Pending </p>';
    } else {
        return '<p class="Completed"> Completed </p>';
    }
}

const getSupplier = (ob) => {
    return ob.supplier_id.suppliername;
}

const getItemList = (ob) => {

    let supplyItems = "";
    ob.purchaseOrderHasItemList.forEach((element, index) => {//loop wenwa each element in ob.supplyItems and index eka denwa ape item eke current position eka
        if (index == ob.purchaseOrderHasItemList.length - 1) {//last item ekada blnw
            supplyItems = supplyItems + element.item_id.itemname
        } else {
            supplyItems = supplyItems + element.item_id.itemname + ","//last item nemenm , danawa
        }
    });
    return supplyItems;
}

const refreshPurchaseorderForm = () => {
    purchaseorder = new Object();
    purchaseorder.purchaseOrderHasItemList = new Array()

    purchaseOrderFormId.reset();


    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername")
    selectSupplier.disabled = ""

    purchaseOrderStatus = getajaxServiceRequest("/purchaseorderstatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", purchaseOrderStatus, "name")

    selectStatus.value = JSON.stringify(purchaseOrderStatus[0]);
    purchaseorder.purchaseorder_status_id = purchaseOrderStatus[0];
    selectStatus.style.border = "2px solid green";
    selectStatus.disabled = "disabled";

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";

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
    selectRequiredDate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

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
    selectRequiredDate.max = currentDate.getFullYear() + "-" + maxcurrentMonth + "-" + maxcurrentDay;


    refreshOrderItemInnerForm();
}

//filter item by supplier
// const filterItemBySuppliers = () => {
//     ItemBySuppliers = getajaxServiceRequest("/item/listBySupplier/" + JSON.parse(selectSupplier.value).id)
//     fillDataIntoSelect(selectItem, "", ItemBySuppliers, "itemname")
// }
//filter pricelist by supplier
const filterPriceListBySupplierAndDate = () => {

    requiredDate = document.getElementById("selectRequiredDate").value

    PriceListBySuppliersAndDate = getajaxServiceRequest("/pricelist/listBySupplierAndDate/" + JSON.parse(selectSupplier.value).id + "/" + selectRequiredDate.value)
    // PriceListBySuppliersAndDate = getajaxServiceRequest("/pricelist/listBySupplierAndDate/2/2025-02-13")
    fillDataIntoSelect(selectPriceList, "Select Pricelist", PriceListBySuppliersAndDate, "pricelist_no")

    console.log(PriceListBySuppliersAndDate);

}

//filter Item by pricelist
const filterItemByPricelist = () => {
    itemByPriceList = getajaxServiceRequest("/item/listBypricelist/" + JSON.parse(selectPriceList.value).id)
    fillDataIntoSelect(selectItem, "Select Item", itemByPriceList, "itemname")
}

//filter existing item
const filterItemByexistence = () => {
    selectedItem = JSON.parse(selectItem.value)

    //selected item eke id eka pohaslist eke thiyenwda blnwa ekin eka
    let extIndex = purchaseorder.purchaseOrderHasItemList.map(poitem => poitem.item_id.id).indexOf(selectedItem.id)

    if (extIndex > -1) {//index eka exit nm
        Swal.fire({
            title: "item already exists.please select another..!",
            icon: "error"
        });
        refreshOrderItemInnerForm()
    } else {
        //set unit price
        const pricelist = getajaxServiceRequest("/itempricelist/listByItemAndPriceList/" + JSON.parse(selectItem.value).id + "/" + JSON.parse(selectPriceList.value).id)
        console.log(pricelist);

        textUnitPrice.value = parseFloat(pricelist.unitprice).toFixed(2);
        purchaseOrderHasItem.unit_price = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.classList.add('is-valid')

        //set reorder quantity as quantity
        textQty.value = selectedItem.roq
        purchaseOrderHasItem.quantity = textQty.value
        textQty.classList.add('is-valid')

        getlinePrice();
    }
}


const refreshOrderItemInnerForm = () => {
    purchaseOrderHasItem = new Object();

    //supplier select wela thibbe nttn all item list arn select wela thiyeddi filter krnw
    items = []
    if (selectPriceList.value == "") {
        items = getajaxServiceRequest("/item/listByAvailable")
        fillDataIntoSelect(selectItem, "Select Item", items, "itemname")
    } else {
        filterItemByPricelist();
    }

    selectItem.disabled = ""
    textUnitPrice.disabled = "disabled"
    textUnitPrice.value = ""
    textQty.disabled = "";
    textQty.value = ""
    textLinePrice.value = ""
    textLinePrice.disabled = "disabled"

    selectItem.classList.remove('is-valid')
    textUnitPrice.classList.remove('is-valid')
    textQty.classList.remove('is-valid')
    textLinePrice.classList.remove('is-valid')

    btnItemUpdate.classList.add("d-none")
    btnItemAdd.classList.remove("d-none");

    //refresh inner orderItem table
    const displayInnerTableColumnList = [
        { dataType: "function", propertyName: getItemName },
        { dataType: "decimal", propertyName: "unit_price" },
        { dataType: "text", propertyName: "quantity" },
        { dataType: "decimal", propertyName: "line_price" },
    ];

    fillDataIntoInnerTable(pOrderInnerTable, purchaseorder.purchaseOrderHasItemList, displayInnerTableColumnList, refillOrderItemInnerForm, deleteOrderItemInnerForm)

    let totalAmount = 0.00;
    for (const orderitem of purchaseorder.purchaseOrderHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.line_price)
    }

    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        purchaseorder.total_amount = textTotalAmount.value
        console.log(purchaseorder.total_amount);
        textTotalAmount.classList.add('is-valid');
    }

}

const getItemName = (ob) => {
    console.log(ob.item_id);

    return ob.item_id.itemname;//ob.item_id.itemname
}

const getlinePrice = () => {

    if (textQty.value > 0) {
        const unitPrice = parseFloat(document.getElementById('textUnitPrice').value);
        const quantity = parseInt(document.getElementById('textQty').value);

        const linePrice = unitPrice * quantity
        purchaseOrderHasItem.line_price = linePrice;

        textLinePrice.value = parseFloat(linePrice).toFixed(2);
        textLinePrice.classList.add('is-valid')
    } else {
        purchaseOrderHasItem.quantity = null
        purchaseOrderHasItem.line_price = null

        textQty.classList.add('is-invalid')
        textLinePrice.style.border = "1px solid #ced4da";
        textLinePrice.value = "";

    }
}

const refillOrderItemInnerForm = (ob, index) => {

    innerFormIndex = index

    purchaseOrderHasItem = JSON.parse(JSON.stringify(ob))
    oldpurchaseOrderHasItem = JSON.parse(JSON.stringify(ob))

    items = getajaxServiceRequest("/item/alldata")
    fillDataIntoSelect(selectItem, "Select Item", items, "itemname", purchaseOrderHasItem.item_id.itemname)

    selectItem.disabled = "disabled"

    textUnitPrice.value = parseFloat(purchaseOrderHasItem.unit_price)
    textQty.value = purchaseOrderHasItem.quantity
    textLinePrice.value = parseFloat(purchaseOrderHasItem.line_price)

    btnItemUpdate.classList.remove("d-none")
    btnItemAdd.classList.add("d-none");
}

const deleteOrderItemInnerForm = (ob) => {

    let userConfirm = window.confirm("Are You sure to remove following item..?")
    if (userConfirm) {
        let extIndex = purchaseorder.purchaseOrderHasItemList.map(orderitem => orderitem.item_id.id).indexOf(ob.item_id.id)
        if (extIndex != -1) {
            purchaseorder.purchaseOrderHasItemList.splice(extIndex, 1);
        }
        refreshOrderItemInnerForm()
    }
}

const updateOrderItemInnerForm = () => {
    console.log(purchaseOrderHasItem);
    console.log(purchaseorder.purchaseOrderHasItemList);

    if (purchaseOrderHasItem.quantity != oldpurchaseOrderHasItem.quantity) {
        let userConfirm = window.confirm("Are you sure to update following item..!")
        if (userConfirm) {
            window.alert("Item update successfully..!")
            purchaseorder.purchaseOrderHasItemList[innerFormIndex] = purchaseOrderHasItem
            refreshOrderItemInnerForm();
        }
    } else {
        window.alert("form hasn't any changes..!")
    }


}

const submitOrderItemInnerForm = () => {
    console.log(purchaseOrderHasItem);
    console.log(purchaseorder.purchaseOrderHasItemList);

    Swal.fire({
        title: "Are you sure to add following item..!",
        text: purchaseOrderHasItem.item_id.barcode,
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
            purchaseorder.purchaseOrderHasItemList.push(purchaseOrderHasItem)
            refreshOrderItemInnerForm();
            selectItem.classList.remove('is-valid')
            textUnitPrice.classList.remove('is-valid')
            textQty.classList.remove('is-valid')
            textLinePrice.classList.remove('is-valid')
        }
    })

    // let userConfirm = window.confirm("Are you sure to add following item..!")
    // if (userConfirm) {
    //     window.alert("Item add successfully..!")
    //     purchaseorder.purchaseOrderHasItemList.push(purchaseOrderHasItem)
    //     refreshOrderItemInnerForm();
    //     selectItem.classList.remove('is-valid')
    //     textUnitPrice.classList.remove('is-valid')
    //     textQty.classList.remove('is-valid')
    //     textLinePrice.classList.remove('is-valid')
    // }
}

const refillpurchaseorderForm = (ob) => {
    $("#collapseWidthExample").collapse("show");
    purchaseorder = JSON.parse(JSON.stringify(ob));
    oldPurchaseorder = ob;

    selectSupplier.value = JSON.stringify(ob.supplier_id)
    // selectSupplier.disabled = "disabled"

    // selectStatus.value = JSON.stringify(ob.purchaseorder_status_id)
    // selectPriceList.value = JSON.stringify(ob.pricelist_id)

    purchaseOrderStatus = getajaxServiceRequest("/purchaseorderstatus/alldata")
    fillDataIntoSelect(selectStatus, "Select Status", purchaseOrderStatus, "name", ob.purchaseorder_status_id.name)

    priceList = getajaxServiceRequest("/pricelist/alldata")
    fillDataIntoSelect(selectPriceList, "", priceList, "pricelist_no", ob.pricelist_id.pricelist_no)


    // textNote.value = ob.note
    selectRequiredDate.value = ob.required_date

    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Purchase_Order")
    // console.log(userPrivilege);
    // const btnUpdate = document.getElementById("btnUpdate");
    // const btnAdd = document.getElementById("btnAdd");

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }

    refreshOrderItemInnerForm();
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
const checkPurchaseOrderFormUpdates = () => {
    let updates = "";
    if (purchaseorder.supplier_id.id != oldPurchaseorder.supplier_id.id) {
        updates = updates + "Purchase Order Supplier is changed..! \n";
    }
    if (purchaseorder.required_date != oldPurchaseorder.required_date) {
        updates = updates + "Purchase Order Required date is changed..! \n";
    }
    if (purchaseorder.total_amount != oldPurchaseorder.total_amount) {
        updates = updates + "Purchase Order Total Amount is changed..! \n";
    }
    if (purchaseorder.purchaseorder_status_id.id != oldPurchaseorder.purchaseorder_status_id.id) {
        updates = updates + "Purchase Order Status is changed..! \n";
    }

    //inner form eke item ekk wens unoth(length eka wenas wela nm)
    if (purchaseorder.purchaseOrderHasItemList.length != oldPurchaseorder.purchaseOrderHasItemList.length) {
        updates = updates + "Purchase Order item detail is changed..!"
    } else {
        //length eka same wela item eka wenas nm
        let itemCount = 0;
        for (const oldPoItem of oldPurchaseorder.purchaseOrderHasItemList) {
            for (const newPoItem of purchaseorder.purchaseOrderHasItemList) {
                if (oldPoItem.item_id.id == newPoItem.item_id.id) {
                    //samana item ekk hambunoth count eka 1kin wadi krnw
                    itemCount = itemCount + 1
                }
            }
        }

        if (itemCount != purchaseorder.purchaseOrderHasItemList.length) {
            //item count eka item list eke length ekata samana nttn
            updates = updates + "Purchase Order item is changed..! \n";
        } else {
            //item count eka item list eke length ekata samana wela quantity eka asamana nm 
            for (const oldPoItem of oldPurchaseorder.purchaseOrderHasItemList) {
                for (const newPoItem of purchaseorder.purchaseOrderHasItemList) {
                    if (oldPoItem.item_id.id == newPoItem.item_id.id && oldPoItem.quantity != newPoItem.quantity) {
                        updates = updates + "Purchase Order item quantity is changed..! \n";
                        break
                    }
                }
            }
        }
    }

    return updates;
}

const getErrors = () => {
    let errors = ""
    if (purchaseorder.supplier_id == null) {
        errors = errors + "Please select supplier..!";
    }
    if (purchaseorder.required_date == null) {
        errors = errors + "Please select required date..!";
    }
    if (purchaseorder.total_amount == null) {
        errors = errors + "Please enter total amount..!";
    }
    if (purchaseorder.purchaseOrderHasItemList.length == 0) {
        errors = errors + "Please select order item..!";
    }

    return errors;
}

const updatePurchaseorder = () => {
    console.log("update");

    let errors = getErrors();
    if (errors == "") {
        let updates = checkPurchaseOrderFormUpdates();
        if (updates == "") {
            Swal.fire({
                title: "Nothing updated..!",
                icon: "info"
            })
        } else {
            //user confirmation
            Swal.fire({
                title: "Are you sure to update following changes",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Yes, update!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service request
                    let putServiceResponce = getHTTPAjaxRequest("/purchaseorder", "PUT", purchaseorder)
                    //check put service Responce
                    if (putServiceResponce == "OK") {
                        Swal.fire({
                            title: "Update successfully..!",
                            icon: "success"
                        });
                        $("#collapseWidthExample").collapse("hide");
                        refreshPurchaseorderTable();
                        purchaseOrderFormId.reset();
                        refreshPurchaseorderForm();
                    } else {
                        Swal.fire({
                            title: "Update not complete : \n",
                            text: putServiceResponce,
                            icon: "error"
                        });
                    }
                }
            })
            // let userConfirm = confirm("Are You sure to update following changes? \n " + updates);
            // if (userConfirm) {
            //     //call put service request
            //     let putServiceResponce;

            //     $.ajax("/purchaseorder", {
            //         type: "PUT",
            //         async: false,
            //         contentType: "application/json",
            //         data: JSON.stringify(purchaseorder),
            //         success: function (successResponceOb) {
            //             putServiceResponce = successResponceOb;
            //         },
            //         error: function (failResponceOb) {
            //             putServiceResponce = failResponceOb;
            //         },
            //     });

            //     //check put service Responce
            //     if (putServiceResponce == "OK") {
            //         alert("Update Sucessfully..!");
            //         $("#collapseWidthExample").collapse("hide");
            //         refreshPurchaseorderTable();
            //         purchaseOrderFormId.reset();
            //         refreshPurchaseorderForm();
            //     } else {
            //         alert("Update not complete : \n" + putServiceResponce);
            //     }
            // }
        }
    }
}

const deletePurchaseOrder = (ob) => {
    sweetAlert(
        "Are you sure to delete following  Purchase order?",
        ob.order_code,
        "warning",
        true,
        'Yes, delete!',
        'Cancel'
    ).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponce = getHTTPAjaxRequest("/purchaseorder", "DELETE", ob);
            if (deleteServiceResponce == "OK") {
                Swal.fire({
                    title: "Delete successfully..!",
                    icon: "success"
                });
                refreshPurchaseorderTable();
                purchaseOrderFormId.reset();
                refreshPurchaseorderForm();
            } else {
                Swal.fire({
                    title: "Delete Not Competed ",
                    text: deleteServiceResponce,
                    icon: "error"
                });
            }
        }
    })
    // let userConfirm = confirm("Are you sure to delete following Purchase order \n" + ob.order_code);
    // if (userConfirm) {
    //     let deleteServiceResponce;

    //     $.ajax("/purchaseorder", {
    //         type: "DELETE",
    //         contentType: "application/json",
    //         data: JSON.stringify(ob),
    //         async: false,
    //         success: function (data) {
    //             deleteServiceResponce = data;
    //         },
    //         error: function (errorData) {
    //             deleteServiceResponce = errorData;
    //         }

    //     });
    //     if (deleteServiceResponce == "OK") {
    //         alert("Delete successfully..!");
    //         refreshPurchaseorderTable();
    //         purchaseOrderFormId.reset();
    //         refreshPurchaseorderForm();
    //     } else {
    //         alert("Delete Not Competed : " + deleteServiceResponce);
    //     }
    // }
}

const purchaseOrderSubmitButton = () => {
    console.log(purchaseorder);
    let errors = getErrors();
    if (errors) {
        Swal.fire({
            title: "Form has following error...",
            text: errors,
            icon: "error"
        });
    }

    Swal.fire({
        title: "Are you sure to Add following Purchase Order",
        text: purchaseorder.order_code,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/purchaseorder", "POST", purchaseorder)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshPurchaseorderForm();
                purchaseOrderFormId.reset();
                refreshPurchaseorderForm();
            } else {
                Swal.fire({
                    title: "Fail to submit Purchase Order form ",
                    text: postServiceResponce,
                    icon: "error"
                });
            }
        }
    })
    // const userSubmitResponse = confirm('Are you sure to submit...?');

    // if (userSubmitResponse) {
    //     let postServiceResponce;

    //     $.ajax("/purchaseorder", {
    //         type: "POST", contentType: "application/json", data: JSON.stringify(purchaseorder), async: false,
    //         success: function (data) {
    //             console.log("success" + data);
    //             postServiceResponce = data;
    //         },
    //         error: function (resData) {
    //             console.log("Fail" + resData);
    //             postServiceResponce = resData
    //         }
    //     });
    //     if (postServiceResponce == "OK") {
    //         alert("Save Successfully..!");
    //         $("#collapseWidthExample").collapse("hide");
    //         refreshPurchaseorderForm();
    //         purchaseOrderFormId.reset();
    //         refreshPurchaseorderForm();
    //     } else {
    //         alert("Fail to submit Purchase Order form \n" + postServiceResponce);
    //     }
    // } else {
    //     alert("Form has following error...");
    // }
}

const printPurchaseorder = (ob) => {
    const pOrderPrint = ob;

    tdOrdercode.innerText = pOrderPrint.order_code
    tdSuppliername.innerText = pOrderPrint.supplier_id.suppliername
    tdRequredDate.innerText = pOrderPrint.required_date
    tdTotalAmount.innerText = pOrderPrint.total_amount
    tdStatus.innerText = pOrderPrint.purchaseorder_status_id.name
    // tdNote.innerText = pOrderPrint.note

    const displayInnerTableColumnList = [
        { dataType: "function", propertyName: getItemName },
        { dataType: "decimal", propertyName: "unit_price" },
        { dataType: "text", propertyName: "quantity" },
        { dataType: "decimal", propertyName: "line_price" },
    ];

    fillDataIntoInnerTable(printPorderInnerTableBody, ob.purchaseOrderHasItemList, displayInnerTableColumnList, refillOrderItemInnerForm, deleteOrderItemInnerForm)

    $('#printModalPurchaseOrder').modal('show');
}

const printPurchaseOrderDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printPurchaseOrderData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printPurchaseOrderTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Purchase Order</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + purchaseorderTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}



