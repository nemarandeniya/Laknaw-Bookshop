window.addEventListener("load", () => {
    // tooltip enable
    $('[data-bs-toggle="tooltip"]').tooltip();

    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Customer")

    //call table refresh function
    refreshCustomerTable();

    //call form refresh function
    refreshCustomerForm();
});

const refreshCustomerTable = () => {
    //call jquary ajax function

    customers = getajaxServiceRequest("/customer/alldata")


    const displayPropertyList = [
        { dataType: "text", propertyName: "customerNumber" },
        { dataType: "text", propertyName: "customerName" },
        { dataType: "text", propertyName: "contact" },
        { dataType: "text", propertyName: "email" },
        { dataType: "text", propertyName: "loyalty_points" },
        // { dataType: "function", propertyName: getCustomerStatus },
    ];

    fillDataIntoTable(
        customerTable,
        customers,
        displayPropertyList,
        customerormRefill,
        deleteCustomer,
        printCustomer,
        userPrivilege
    );

    $("#customerTable").dataTable();

}

// const getCustomerStatus = (ob) => {
//     if (ob.customerstatus_id.name = "Active") {
//         return '<p class="status-active">' + ob.customerstatus_id.name + '</p>';
//     } else {
//         return '<p class="status-inactive">' + ob.customerstatus_id.name + '</p>';
//     }
// }

const refreshCustomerForm = () => {
    customer = new Object;

    formCustomer.reset();

    // customerStatus = getajaxServiceRequest("/customerstatus/alldata");
    // fillDataIntoSelect(selectStatus, "Select your status", customerStatus, "name")

    // selectStatus.value = JSON.stringify(customerStatus[0]);
    // customer.customerstatus_id = customerStatus[0];
    // selectStatus.style.border = "2px solid green";

    btnUpdate.style.visibility = "hidden";
    btnAdd.style.visibility = "";
}

const customerormRefill = (ob) => {
    $("#collapseWidthExample").collapse("show");
    customer = JSON.parse(JSON.stringify(ob));
    oldCustomer = JSON.parse(JSON.stringify(ob));//for compare updates

    textCustomername.value = ob.customerName;
    textCustomername.classList.add('is-valid')
    textEmail.value = ob.email;
    textEmail.classList.add('is-valid')
    textcontact.value = ob.contact;
    textcontact.classList.add('is-valid')

    // customerStatus = getajaxServiceRequest("/customerstatus/alldata");
    // fillDataIntoSelect(selectStatus, "Select your status", customerStatus, "name", ob.customerstatus_id.name)

    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Customer")

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }
}

const deleteCustomer = (ob) => {

    sweetAlert(
        "Are you sure to delete following customer?",
        ob.customerName,
        "warning",
        true,
        'Yes, delete him!',
        'Cancel'
    ).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponce = getHTTPAjaxRequest("/customer", "DELETE", ob);
            if (deleteServiceResponce == "OK") {
                Swal.fire({
                    title: "Delete successfully..!",
                    icon: "success"
                });
                // alert("Delete successfully..!");
                refreshCustomerTable();
                formCustomer.reset();
                refreshCustomerForm();
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

const customerSubmitButton = (ob) => {

    let errors = getErrors();

    Swal.fire({
        title: "Are you sure to Add following Customer..?",
        text: ob.customerName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add him!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/customer", "POST", customer)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshCustomerForm();
                formCustomer.reset();
                refreshCustomerTable();
            } else {
                Swal.fire({
                    title: "Fail to submit customer form ",
                    text: postServiceResponce,
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Form has following error...",
                text: errors,
                icon: "error"
            });
        }
    })
}

const checkCustomerFormUpdates = () => {
    let updates = "";
    if (customer.customerName != oldCustomer.customerName) {
        updates = updates + "Customer name is changed..! \n";
    }
    if (customer.email != oldCustomer.email) {
        updates = updates + "Customer Email is changed..! \n";
    }
    if (customer.contact != oldCustomer.contact) {
        updates = updates + "Employee Mobile is changed..! \n";
    }
    // if (customer.customerstatus_id.id != oldCustomer.customerstatus_id.id) {
    //     updates = updates + "Customer Status is changed..! \n";
    // }
    if (customer.loyalty_points != oldCustomer.loyalty_points) {
        updates = updates + "Employee Loyalty points is changed..! \n";
    }
    return updates;
}

const updateCustomer = () => {
    console.log("update");

    let errors = getErrors();
    if (errors == "") {
        let updates = checkCustomerFormUpdates();
        if (updates == "") {
            Swal.fire({
                title: "Nothing updated..!",
                icon: "info"
            })
        } else {
            Swal.fire({
                title: "Are you sure to update following Customer",
                text: updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Yes, update!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service request
                    let putServiceResponce = getHTTPAjaxRequest("/customer", "PUT", customer)
                    //check put service Responce
                    if (putServiceResponce == "OK") {
                        Swal.fire({
                            title: "Update successfully..!",
                            icon: "success"
                        });
                        $("#collapseWidthExample").collapse("hide");
                        refreshCustomerForm();
                        formCustomer.reset();
                        refreshCustomerTable();
                    } else {
                        alert("Update not complete : \n" + putServiceResponce);
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

const getErrors = () => {
    let errors = ""
    if (customer.customerName == "") {
        textFirstname.classList.add("is-invalid");
    }
    if (customer.email == null) {
        textEmail.classList.add("is-invalid");
    }
    if (customer.contact == null) {
        textcontact.classList.add("is-invalid");
    }
    // if (customer.customerstatus_id == null) {
    //     selectStatus.classList.add("is-invalid");
    // }
    // if (customer.loyalty_points == null) {
    //     textloyaltypoints.classList.add("is-invalid");
    // }
    return errors;
}

//print functions

const printCustomer = (ob) => {
    const customerPrint = ob;

    tdFullName.innerText = customerPrint.customerName;
    tdContact.innerText = customerPrint.contact;
    tdEmail.innerText = customerPrint.email;
    tdloyaltyPoints.innerText = customerPrint.loyalty_points;
    // tdStatus.innerText = customerPrint.customerstatus_id.name;
    $('#printModalCustomer').modal('show');
};

const printCustomerDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printCustomerData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
const printCustomerTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Employee</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + customerTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}