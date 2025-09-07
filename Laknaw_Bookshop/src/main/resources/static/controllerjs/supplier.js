window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Supplier")
    refreshSupplierTable();
    refreshSupplierForm();
});

const refreshSupplierTable = () => {

    suppliers = getajaxServiceRequest("/supplier/alldata")

    const displayColumnList = [
        { dataType: "text", propertyName: "regno" },
        { dataType: "text", propertyName: "suppliername" },
        { dataType: "text", propertyName: "agentname" },
        { dataType: "function", propertyName: getSupplyItems },
        { dataType: "function", propertyName: getStatus },
    ];

    fillDataIntoTable(supplierTable, suppliers, displayColumnList, supplierFormRefill, deleteSupplier, printSupplier, userPrivilege)
    $("#supplierTable").dataTable();
}

const getSupplyItems = (ob) => {
    let supplyItems = "";
    ob.supplyItems.forEach((element, index) => {//loop wenwa each element in ob.supplyItems and index eka denwa ape item eke current position eka
        if (index == ob.supplyItems.length - 1) {//last item ekada blnw
            supplyItems = supplyItems + element.itemname
        } else {
            supplyItems = supplyItems + element.itemname + ","//last item nemenm , danawa
        }
    });
    return supplyItems;
}
const getStatus = (ob) => {
    if (ob.supplierstatus_id.name == "Active") {
        return '<p class="status-working">' + ob.supplierstatus_id.name + '<p/>'
    } else {
        return '<p class="status-notworking">' + ob.supplierstatus_id.name + '<p/>'
    }
}


const printSupplier = (ob) => {
    const supplierPrint = ob;

    tdRegNo.innerText = supplierPrint.regno
    tdSupplier.innerText = supplierPrint.suppliername
    tdAgentName.innerText = supplierPrint.agentname
    tdItems.innerText = "Promate Exercise Books A4 CR Books Box Set"//supplierPrint.supplyItems
    tdStatus.innerText = "delete"//supplierPrint.supplierstatus_id.name

    $('#printModalSupplier').modal('show');
}

const printSupplierDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printSupplierData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printSupplierTableBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Supplier</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + supplierTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );
    setInterval(function () {
        newTab.print()
    }, 1000)
}
const refreshSupplierForm = () => {
    supplier = {};
    supplier.supplyItems = [];

    category = getajaxServiceRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", category, "name")

    brand = getajaxServiceRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Select Brand", brand, "name")

    items = getajaxServiceRequest("/item/listByAvailable");
    fillDataIntoSelect(selectItems, "Select items", items, "itemname")

    banks = getajaxServiceRequest("/banks/alldata");
    fillDataIntoSelect(selectBank, "Select Banks", banks, "name")

    supplierStatus = getajaxServiceRequest("/supplierstatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Status", supplierStatus, "name")

    selectStatus.value = JSON.stringify(supplierStatus[0]);
    supplier.supplierstatus_id = supplierStatus[0];
    selectStatus.style.border = "2px solid green";
    selectStatus.disabled = "disabled";

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";

}

const filerbrandbyCategory = () => {
    //path param
    brandByCategory = getajaxServiceRequest("/brand/listbycategory/" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect(selectBrand, "Select Brand", brandByCategory, "name")
}

const filterItemByCategoryAndBrand = () => {

    console.log(JSON.parse(selectCategory.value).id);
    console.log(JSON.parse(selectBrand.value).id);

    itemByCategoryAndBrand = getajaxServiceRequest("/item/listByCategoryAndBrand?categoryid=" + JSON.parse(selectCategory.value).id + "&brandid=" + JSON.parse(selectBrand.value).id)
    fillDataIntoSelect(selectItems, "Select item", itemByCategoryAndBrand, "itemname")

}

const btnAddOneItem = () => {
    let selectedItem = JSON.parse(selectItems.value)

    supplier.supplyItems.push(selectedItem)
    fillDataIntoSelect(selectSelectedItems, "", supplier.supplyItems, "itemname")

    let extInd = items.map(item => item.id).indexOf(selectedItem.id);
    if (extInd != -1) {//check if index exists
        items.splice(extInd, 1)//remove selecteditem from allitemlist
    }
    fillDataIntoSelect(selectItems, "", items, "itemname");
}

const btnAddAllItem = () => {
    for (const item of items) {
        //add one by one item into selected item list from all item list
        supplier.supplyItems.push(item)
    }
    //refill selected item list
    fillDataIntoSelect(selectSelectedItems, "", supplier.supplyItems, "itemname")
    items = [];
    //refill allitem list
    fillDataIntoSelect(selectItems, "", items, "itemname")
}

const btnRemoveOneItem = () => {
    let selecteditem = JSON.parse(selectSelectedItems.value)

    items.push(selecteditem)//add selected item into allItems list 
    fillDataIntoSelect(selectItems, "", items, "itemname")

    //get selecteditem index from selecteditemlist into exind variable
    let extInd = supplier.supplyItems.map(item => item.id).indexOf(selecteditem.id)
    if (extInd != -1) {//check if index exists
        supplier.supplyItems.splice(extInd, 1)//remove selecteditem from selecteditemlist
    }
    fillDataIntoSelect(selectSelectedItems, "", supplier.supplyItems, "itemname")
}

const btnRemoveAllItem = () => {
    for (const item of supplier.supplyItems) {
        items.push(item)
    }
    //refill allitem side
    fillDataIntoSelect(selectItems, "", items, "itemname")
    supplier.supplyItems = []
    //refill selecteditem side
    fillDataIntoSelect(selectSelectedItems, "", supplier.supplyItems, "itemname")
}

//create function for submit new supplier                                                                                        
const buttonSupplierFormSubmit = () => {
    console.log("submit");
    console.log(supplier);
    //check whether all fields are valid
    let errors = checkSupplierFormErrors();
    if (errors == "") {//if no errors
        //user confirmation
        let userConfirmation = confirm("Are tou sure to submit following supplier? \n"
            + "Supplier Name : " + supplier.suppliername
        )
        if (userConfirmation) {
            //call post service
            let postServiceResponce = getHTTPAjaxRequest("/supplier", "POST", supplier)
            //if the response is "OK" success massage shown
            if (postServiceResponce == "OK") {
                alert("Save Successfully..!")
                //supplier table and form refresh after submit
                refreshSupplierTable()
                formId.reset()
                refreshSupplierForm()
                //if the response in not "OK"
            } else {
                alert("Fail to save..\n" + postServiceResponce)
            }
        }
        //if validation error exists alert and shows list of errors
    } else {
        alert("Form has following errors..\n" + errors);
    }
}

const checkSupplierFormErrors = () => {
    let errors = ""
    if (supplier.suppliername == null) {
        textSuppliername.classList.add("is-invalid")
        errors = errors + "Select Supplier Name..! \n";
    }
    if (supplier.contact == null) {
        textContact.classList.add("is-invalid")
        errors = errors + "Select Supplier Contact..! \n";
    }
    if (supplier.email == null) {
        textEmail.classList.add("is-invalid")
        errors = errors + "Select Supplier Email..! \n";
    }
    if (supplier.address == null) {
        textAddress.classList.add("is-invalid")
        errors = errors + "Select Supplier Address..! \n";
    }
    if (supplier.agentname == null) {
        textAgentname.classList.add("is-invalid")
        errors = errors + "Select Supplier Agent name..! \n";
    }
    if (supplier.agentemail == null) {
        textAgentEmail.classList.add("is-invalid")
        errors = errors + "Select Supplier Agent email..! \n";
    }
    if (supplier.agentcontact == null) {
        textAgentContact.classList.add("is-invalid")
        errors = errors + "Select Supplier Agent contact..! \n";
    }
    if (supplier.bank_id == null) {
        selectBank.classList.add("is-invalid")
        errors = errors + "Select Supplier Bank name..! \n";
    }
    if (supplier.branch == null) {
        textBranchName.classList.add("is-invalid")
        errors = errors + "Select Supplier Bank details(branch)..! \n";
    }
    if (supplier.accountname == null) {
        textAccountName.classList.add("is-invalid")
        errors = errors + "Select Supplier Bank details(accountname)..! \n";
    }
    if (supplier.accountno == null) {
        textAccountNo.classList.add("is-invalid")
        errors = errors + "Select Supplier Bank details(accountno)..! \n";
    }
    if (supplier.supplierstatus_id == null) {
        selectStatus.classList.add("is-invalid")
        errors = errors + "Select Supplier Status..!";
    }
    return errors;
}

const deleteSupplier = (ob) => {
    let userConfirm = confirm("Are you sure to delete following supplier \n" + ob.suppliername)
    if (userConfirm) {
        let deleteServiceResponce = getHTTPAjaxRequest("/supplier", "DELETE", ob)
        if (deleteServiceResponce == "OK") {
            alert("Delete Successfully..!")
            refreshSupplierTable()
            refreshSupplierForm()
        } else {
            alert("Delete Not Competed : " + deleteServiceResponce)
        }
    }
}

const supplierFormRefill = (ob) => {
    $('#collapseWidthExample').collapse('show');
    supplier = JSON.parse(JSON.stringify(ob));
    oldSupplier = ob

    console.log(ob);


    textSuppliername.value = ob.suppliername;
    textSuppliername.classList.add("is-valid")
    textContact.value = ob.contact;
    textContact.classList.add("is-valid")
    textEmail.value = ob.email;
    textEmail.classList.add("is-valid")
    textAddress.value = ob.address;
    textAddress.classList.add("is-valid")
    textAgentname.value = ob.agentname;
    textAgentname.classList.add("is-valid")
    textAgentEmail.value = ob.agentemail;
    textAgentEmail.classList.add("is-valid")
    textAgentContact.value = ob.agentcontact;
    textAgentContact.classList.add("is-valid")
    textBranchName.value = ob.branch;
    textBranchName.classList.add("is-valid")
    textAccountName.value = ob.accountname;
    textAccountName.classList.add("is-valid")
    textAccountNo.value = ob.accountno;
    textAccountNo.classList.add("is-valid")

    items = getajaxServiceRequest("/supplier/alldata");
    fillDataIntoSelect(selectItems, "Select items", items, "itemname")
    selectItems.classList.add("is-valid")

    banks = getajaxServiceRequest("/banks/alldata");
    fillDataIntoSelect(selectBank, "Select Banks", banks, "name", ob.bank_id.name)
    selectBank.classList.add("is-valid")

    supplierStatus = getajaxServiceRequest("/supplierstatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Status", supplierStatus, "name", ob.supplierstatus_id.name)
    selectStatus.classList.add("is-valid")

    selectStatus.disabled = ""


    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Supplier")
    // console.log(userPrivilege);

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }

}

const checkSupplierFormUpdates = () => {
    let updates = "";

    if (supplier.suppliername != oldSupplier.suppliername) {
        updates = updates + "Supplier Name is changed..! \n"
    }
    if (supplier.supplierstatus_id.id != oldSupplier.supplierstatus_id.id) {
        updates = updates + "Supplier Status is changed..! \n"
    }
    if (supplier.contact != oldSupplier.contact) {
        updates = updates + "Supplier Contact is changed..! \n"
    }
    if (supplier.email != oldSupplier.email) {
        updates = updates + "Supplier Email is changed..! \n"
    }
    if (supplier.address != oldSupplier.address) {
        updates = updates + "Supplier Address is changed..! \n"
    }
    if (supplier.agentname != oldSupplier.agentname) {
        updates = updates + "Supplier Agent Name is changed..! \n"
    }
    if (supplier.agentemail != oldSupplier.agentemail) {
        updates = updates + "Supplier Agent Email is changed..! \n"
    }
    if (supplier.agentcontact != oldSupplier.agentcontact) {
        updates = updates + "Supplier Agent Contact is changed..! \n"
    }
    if (supplier.bank_id.id != oldSupplier.bank_id.id) {
        updates = updates + "Supplier Bank is changed..! \n"
    }
    if (supplier.branch != oldSupplier.branch) {
        updates = updates + "Supplier Branch is changed..! \n"
    }
    if (supplier.accountname != oldSupplier.accountname) {
        updates = updates + "Supplier Account Name is changed..! \n"
    }
    if (supplier.accountno != oldSupplier.accountno) {
        updates = updates + "Supplier Account No is changed..! \n"
    }
    if (supplier.supplyItems.length != oldSupplier.supplyItems.length) {
        updates = updates + "Supplier Items are changed"
    }
    return updates;
}

const updateSupplier = () => {
    console.log("update");
    let errors = checkSupplierFormErrors();
    if (errors == "") {
        let updates = checkSupplierFormUpdates();
        if (updates == "") {
            Swal.fire({
                title: "Nothing updated..!",
                icon: "info"
            })
        } else {
            Swal.fire({
                title: "Are you sure to update following Supplier",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Yes, update!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service request
                    let putServiceResponce = getHTTPAjaxRequest("/supplier", "PUT", supplier)
                    //check put service Responce
                    if (putServiceResponce == "OK") {
                        Swal.fire({
                            title: "Update successfully..!",
                            icon: "success"
                        });
                        $("#collapseWidthExample").collapse("hide");
                        refreshSupplierTable()
                        formId.reset();
                        refreshSupplierForm()
                    } else {
                        Swal.fire({
                            title: "Update not complete : \n",
                            text: putServiceResponce,
                            icon: error
                        });
                    }
                }
            })
        }
    } else {
        Swal.fire({
            title: "Form has following errors..!",
            text: errors,
            icon: error
        });
    }
}