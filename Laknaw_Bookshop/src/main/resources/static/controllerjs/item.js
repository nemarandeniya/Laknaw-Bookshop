window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Item")
    refreshItemTable();
    refreshItemForm();
});

const refreshItemTable = () => {

    items = getajaxServiceRequest("/item/alldata");

    const displayColumnList = [
        { dataType: "text", propertyName: "itemname" },
        { dataType: "text", propertyName: "barcode" },
        { dataType: "function", propertyName: getCategory },
        { dataType: "function", propertyName: getBrand },
        { dataType: "text", propertyName: "profitrate" },
        { dataType: "function", propertyName: getStatus }
    ];

    fillDataIntoTable(itemTable, items, displayColumnList, refillItemForm, deleteItem, printItem, userPrivilege)

    $("#itemTable").dataTable();
};

const getCategory = (ob) => {
    return ob.category_id.name
}
const getBrand = (ob) => {
    //brand eka thiyenwnm name eka set krnw nttn - set krnw
    return ob.brand_id ? ob.brand_id.name : "-";
}

const getStatus = (ob) => {
    if (ob.itemstatus_id.name == "Available") {
        return '<p class="status-available"> Available </p>';
    } if (ob.itemstatus_id.name == "Pre-order") {
        return '<p class="status-preOrder"> pre-Order </p>';
    } if (ob.itemstatus_id.name == "Discontinued") {
        return '<p class="status-discontinued"> Discontinued </p>';
    } else {
        return '<p class="status-outOfStock"> Out of Stock </p>';
    }
}

const refreshItemForm = () => {
    item = new Object();

    category = getajaxServiceRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Book Category", category, "name")

    itemStatus = getajaxServiceRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Item Status", itemStatus, "name")

    selectStatus.value = JSON.stringify(itemStatus[0]);
    item.itemstatus_id = itemStatus[0];
    selectStatus.classList.add('is-valid')
    selectStatus.disabled = "disabled"

    subCategory = getajaxServiceRequest("/subcategory/alldata")
    fillDataIntoSelect(selectSubCategory, "Select Sub-category", subCategory, "name")

    brand = getajaxServiceRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Select Brand", brand, "name")

    selectCategory.classList.remove('is-valid')
    selectCategory.value = ""
    selectSubCategory.classList.remove('is-valid')
    selectSubCategory.value = ""
    selectBrand.classList.remove('is-valid')
    selectBrand.value = ""



    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";


}

const refillItemForm = (rowOb) => {
    $("#collapseWidthExample").collapse("show");
    item = JSON.parse(JSON.stringify(rowOb));
    oldItem = rowOb;

    category = getajaxServiceRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", category, "name", rowOb.category_id.name)
    selectCategory.classList.add('is-valid')

    subCategory = getajaxServiceRequest("/subcategory/alldata")
    fillDataIntoSelect(selectSubCategory, "Select Sub-category", subCategory, "name", rowOb.subcategory_id.name)
    selectSubCategory.classList.add('is-valid')

    if (rowOb.brand_id) {
        brand = getajaxServiceRequest("/brand/alldata");
        fillDataIntoSelect(selectBrand, "Select Brand", brand, "name", rowOb.brand_id.name)
        selectBrand.classList.add('is-valid')
    } else {
        brand = getajaxServiceRequest("/brand/alldata");
        fillDataIntoSelect(selectBrand, "Select Brand", brand, "name")
        selectBrand.classList.add('is-valid')
    }

    itemStatus = getajaxServiceRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Item Status", itemStatus, "name", rowOb.itemstatus_id.name)
    selectStatus.disabled = ""

    //element.id.value = object.adalapropertyname eka
    textItemname.value = rowOb.itemname;
    textItemname.classList.add('is-valid')
    textReorderPoint.value = rowOb.rop;
    textReorderPoint.classList.add('is-valid')
    textReorderQty.value = rowOb.roq;
    textReorderQty.classList.add('is-valid')
    textBarcode.value = rowOb.barcode;
    textBarcode.classList.add('is-valid')

    const bookRow = document.getElementsByClassName("bookrow")
    for (let i = 0; i < bookRow.length; i++) {
        if (rowOb.category_id.name == "Books") {
            console.log("ssss");

            bookRow[i].classList.remove("d-none")
            textIsbn.value = rowOb.isbn;
            textIsbn.classList.add('is-valid')
            textpublisher.value = rowOb.publisher;
            textpublisher.classList.add('is-valid')
            selectDate.value = rowOb.publishdate;
            selectDate.classList.add('is-valid')
        }
    }

    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Item")
    // console.log(userPrivilege);

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }
}

const updateItem = () => {
    console.log("update");

    let errors = getErrors();
    if (errors == "") {
        let updates = checkItemFormUpdates();
        if (updates == "") {
            alert("Nothing Updated..!");
        } else {
            //user confirmation
            let userConfirm = confirm("Are You sure to update following changes? \n " + updates);
            if (userConfirm) {
                //call put service request
                let putServiceResponce;

                $.ajax("/item", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(item),
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
                    refreshItemTable();
                    formItem.reset();
                    refreshItemForm();
                } else {
                    alert("Update not complete : \n" + putServiceResponce);
                }
            }
        }
    } else {
        alert("Form has following errors..! \n" + errors);
    }


}

const checkItemFormUpdates = () => {
    let updates = "";
    if (item.category_id.id != oldItem.category_id.id) {
        updates = updates + "Item category is changed..! \n";
    }
    if (item.subcategory_id.id != oldItem.subcategory_id.id) {
        updates = updates + "Item Sub-category is changed..! \n";
    }
    if (item.category_id.name !== "Books" && item.brand_id.id != oldItem.brand_id.id) {
        updates = updates + "Item Brand is changed..! \n";
    }
    if (item.itemstatus_id.id != oldItem.itemstatus_id.id) {
        updates = updates + "Item Status is changed..! \n";
    }
    if (item.itemname != oldItem.itemname) {
        updates = updates + "Item Name is changed..! \n";
    }
    if (item.barcode != oldItem.barcode) {
        updates = updates + "Item Barcode is changed..! \n";
    }
    if (item.rop != oldItem.rop) {
        updates = updates + "Item Re-order point is changed..! \n";
    }
    if (item.roq != oldItem.roq) {
        updates = updates + "Item Re-order qty is changed..! \n";
    }
    if (item.isbn != oldItem.isbn) {
        updates = updates + "Item ISBN is changed..! \n";
    }
    if (item.publisher != oldItem.publisher) {
        updates = updates + "Item Publisher is changed..! \n";
    }
    if (item.publishdate != oldItem.publishdate) {
        updates = updates + "Item Publish date is changed..! \n";
    }
    if (item.description != oldItem.description) {
        updates = updates + "Item Description price is changed..! \n";
    }
    return updates;
}

const getErrors = () => {
    let errors = ""
    if (item.category_id == null) {
        selectCategory.classList.add("is-invalid")
        errors += "Category is required.\n";
    }
    if (item.subcategory_id == null) {
        selectSubCategory.classList.add("is-invalid")
        errors += "Sub category is required.\n";
    }
    // if (item.category_id.name !== "Books" && item.brand_id == null) {
    //     selectBrand.classList.add("is-invalid")
    //     errors += "Brand is required.\n";
    // }
    if (item.itemstatus_id == null) {
        selectStatus.classList.add("is-invalid")
        errors += "Status is required.\n";
    }
    if (item.itemname == null) {
        textItemname.classList.add("is-invalid")
        errors += "Item name is required.\n";
    }
    if (item.rop == null) {
        textReorderPoint.classList.add("is-invalid")
        errors += "Rop is required.\n";
    }
    if (item.roq == null) {
        textReorderQty.classList.add("is-invalid")
        errors += "Roq is required.\n";
    }
    if (item.barcode == null) {
        textBarcode.classList.add("is-invalid")
        errors += "Barcode is required.\n";
    }
    if (item.category_id.name == "Books") {
        if (item.isbn == null) {
            textIsbn.classList.add("is-invalid")
            errors += "Isbn is required.\n";
        }
        if (item.publisher == null) {
            textpublisher.classList.add("is-invalid")
            errors += "Publisher is required.\n";
        }
        if (item.publishdate == null) {
            selectDate.classList.add("is-invalid")
            errors += "Publish year is required.\n";
        }
    }

    return errors;
}

const deleteItem = (ob) => {
    let userConfirm = confirm("Are you sure to delete following employee \n" + ob.itemname);
    if (userConfirm) {
        let deleteServiceResponce;

        $.ajax("/item", {
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
            refreshItemTable();
            formItem.reset();
            refreshItemForm();
        } else {
            alert("Delete Not Competed : " + deleteServiceResponce);
        }
    }
}

const printItem = (ob) => {
    const itemPrint = ob;

    tdItemName.innerText = itemPrint.itemname;
    tdBarcode.innerText = itemPrint.barcode;
    tdSubCategory.innerText = itemPrint.subcategory_id.name;
    tdBrand.innerText = itemPrint.brand_id.name;
    tdProfitRate.innerText = itemPrint.profitrate;
    tdStatus.innerText = itemPrint.itemstatus_id.name;
    $('#printModalItem').modal('show');

}

const printItemDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printItemData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

const printItemTableBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Item</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + itemTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );
    setInterval(function () {
        newTab.print()
    }, 1000)
}

//define function for filter subcategory by category
const filterSubCategoryAndBrand = () => {
    console.log(JSON.parse(selectCategory.value).id);

    // query param
    subCategoriesByCategory = getajaxServiceRequest("/subcategory/listbycategory?categoryid=" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect(selectSubCategory, "Select Sub-Category", subCategoriesByCategory, "name")

    //path param
    brandByCategory = getajaxServiceRequest("/brand/listbycategory/" + JSON.parse(selectCategory.value).id);
    fillDataIntoSelect(selectBrand, "Select Brand", brandByCategory, "name")


    //meka ona wenne multiple row show kenwnm 
    const bookRow = document.getElementsByClassName("bookrow")
    const selectedCategory = JSON.parse(selectCategory.value).name
    for (let i = 0; i < bookRow.length; i++) {
        if (selectedCategory == "Books") {
            console.log("show");
            bookRow[i].classList.remove("d-none")//show the row
        } else {
            console.log("hide");
            bookRow[i].classList.add("d-none")//hide the row
        }
    }
}

//define function for generate item name

// const generateItemName = () => {
//     if (selectCategory != "" && selectSubCategory != "" && selectBrand != "" && selectPackageType != "") {
//         textItemname.value = JSON.parse(selectBrand.value).name + " " +
//             JSON.parse(selectCategory.value).name + " " +
//             JSON.parse(selectSubCategory.value).name + " " + JSON.parse(selectPackageType.value).name;
//         item.itemname = textItemname.value;
//         textItemname.classList.add("is-valid");
//     }
// }


const itemSubmitBtn = () => {
    console.log(item);
    const itemSubmitResponse = confirm("Are you sure to submit...?")

    if (itemSubmitResponse) {
        let postServiceResponce;

        $.ajax("/item", {
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(item),
            async: false,
            success: function (data) {
                console.log("success" + data);
                postServiceResponce = data;
            },
            error: function (resData) {
                console.log("Fail" + resData);
                postServiceResponce = resData;
            }
        });
        if (postServiceResponce == "OK") {
            alert("Save Successfully..!");
            $("#collapseWidthExample").collapse("hide");
            refreshItemForm();
            formItem.reset();
            refreshItemTable();
        } else {
            alert("Fail to submit Item form \n" + postServiceResponce);
        }
    } else {
        alert("Form has following error...");
    }

}

