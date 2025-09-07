window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Item")
    refreshSupplierPaymentTable();
    refreshSupplierPaymentForm();
});

const refreshSupplierPaymentTable = () => {

    supPayment = getajaxServiceRequest("/supplierpayment/alldata");

    const displayColumnList = [
        { dataType: "function", propertyName: getSupplier },
        { dataType: "function", propertyName: getGrnNo },
        { dataType: "text", propertyName: "totalAmount" },//grn net amount
        { dataType: "text", propertyName: "paymentAmount" },
        { dataType: "text", propertyName: "newDueAmount" },
    ];

    fillDataIntoTable2(supplierPaymentTable, supPayment, displayColumnList, printSupplierPayment, userPrivilege)
    $("#supplierPaymentTable").dataTable();
}

const refreshSupplierPaymentForm = (ob) => {
    supplierpayment = new Object()

    suppliers = getajaxServiceRequest("/supplier/supplierlist")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "suppliername")

    console.log(suppliers);


    paymentMethod = getajaxServiceRequest("/paymentmethod/alldata")
    fillDataIntoSelect(selectPaymentmethod, "Select Payment Method", paymentMethod, "name")


}

const getBankDetails = () => {
    bankBySupplier = getajaxServiceRequest("/supplier/bankBySupplierid/" + JSON.parse(selectSupplier.value).id)
    banks = getajaxServiceRequest("/banks/alldata")

    fillDataIntoSelect(selectBank, "Select Banks", banks, "name", bankBySupplier.name)
    supplierpayment.bankname = JSON.parse(selectBank.value).name
    selectBank.classList.add('is-valid')

    bankDetailsBySupplier = getajaxServiceRequest("/supplier/listBySupplierid/" + JSON.parse(selectSupplier.value).id)

    //get branch name
    textBranchName.value = bankDetailsBySupplier.branch
    supplierpayment.branch = textBranchName.value
    textBranchName.classList.add('is-valid')

    //get account name
    textAccountName.value = bankDetailsBySupplier.accountname
    supplierpayment.accountname = textAccountName.value
    textAccountName.classList.add('is-valid')

    //get account no
    textAccountNo.value = bankDetailsBySupplier.accountno
    supplierpayment.accountno = textAccountNo.value
    textAccountNo.classList.add('is-valid')

}

const getSupplier = (ob) => {
    return ob.supplier_id.suppliername;
}

const getGrnNo = (ob) => {
    return ob.grn_id.grn_code;
}

const getDueAmount = (ob) => {

    const totalAmount = parseFloat(document.getElementById('textTotalAmount').value);

    const paidAmount = JSON.parse(selectGrnNo.value).paid_amount;
    console.log(paidAmount);

    const dueAmount = totalAmount - paidAmount;
    document.getElementById('textDueAmount').value = dueAmount.toFixed(2)//toFixed--> place for 2 decimal
    textDueAmount.classList.add('is-valid')
}


const getNewDueAmount = (ob) => {

    const dueAmount = parseFloat(document.getElementById('textDueAmount').value);

    const paymentAmount = parseFloat(document.getElementById('textPaymentAmount').value);
    console.log(paymentAmount);

    const newDueAmount = dueAmount - paymentAmount;
    document.getElementById('textNewDueAmount').value = newDueAmount.toFixed(2)//toFixed--> place for 2 decimal
    textNewDueAmount.classList.add('is-valid')
}

const getTotalAmount = (ob) => {
    console.log(selectGrnNo.value);

    const total_amount = JSON.parse(selectGrnNo.value).net_amount;
    console.log(total_amount);

    textTotalAmount.value = parseFloat(total_amount).toFixed(2);
    textTotalAmount.classList.add('is-valid')

    getDueAmount();
}


const handlePaymentMethodChange = (value) => {

    const method = JSON.parse(value).name
    const bankDetailsColumns = document.getElementsByClassName('bankDetailColmn')
    const chequeColumn = document.getElementById('chequeNoId');
    const transferColumn = document.getElementById('transactionNoId');
    const transferdateId = document.getElementById('transferdaterowId');
    const paymentNoRow = document.getElementById('paymentNoRow');
    console.log(method);


    //Unhide everything first
    //eka method ekk select klama unnecessary eka hide wenw.but aphu wena method ekk select kalama eka show wenne na
    // mokda api d-none eka add kra witharai nisa.eka nisa mulinma okkoma hide krnw.ethkota function eka call wena wena
    // parata mulinma okkoma unhide wela itpsse necessary ewa method eka anuwa hide wenwa 
    for (let i = 0; i < bankDetailsColumns.length; i++) {
        bankDetailsColumns[i].classList.remove("d-none")
    }
    paymentNoRow.classList.remove("d-none")
    transferColumn.classList.remove("d-none")
    chequeColumn.classList.remove("d-none")
    transferdateId.classList.remove("d-none")


    if (method === 'cash') {
        paymentNoRow.classList.add("d-none")
        transferdateId.classList.add("d-none")
        // chequeInput.disabled = "disabled";
        // transferInput.disabled = "disabled";
        for (let i = 0; i < bankDetailsColumns.length; i++) {
            bankDetailsColumns[i].classList.add("d-none")
        }
        // chequeInput.value = '';   // values clear wenw
        // transferInput.value = '';
    } else if (method === 'cheque') {
        transferColumn.classList.add("d-none")
        // chequeInput.disabled = "";
        // transferInput.disabled = "disabled";
        for (let i = 0; i < bankDetailsColumns.length; i++) {
            bankDetailsColumns[i].classList.add("d-none")
        }
        // transferInput.value = '';
    } else if (method === 'bank') {
        chequeColumn.classList.add("d-none")
        transferColumn.classList.remove("d-none")

        for (let i = 0; i < bankDetailsColumns.length; i++) {
            bankDetailsColumns[i].classList.remove("d-none")
        }


        // transferInput.disabled = "";
        // chequeInput.disabled = "disabled";

        // chequeInput.value = '';
    } else {
        // method eka select nttn
        paymentNoRow.classList.add("d-none")
        // chequeInput.disabled = "disabled";
        // transferInput.disabled = "disabled";

        // chequeInput.value = '';
        // transferInput.value = '';
    }
}




const getGrnCodesBySupplier = (ob) => {
    grnBySuppliers = getajaxServiceRequest("/grn/listBySupplier/" + JSON.parse(selectSupplier.value).id)
    fillDataIntoSelect(selectGrnNo, "Select GRN Code", grnBySuppliers, "grn_code")

    getBankDetails();
}

// const refillSupplierPaymentForm = (ob) => {
//     return "";
// }

const getErrors = () => {
    let errors = ""
    if (supplierpayment.Supplier_id == "") {
        selectSupplier.classList.add("is-invalid");
    }
    if (supplierpayment.grn_id == "") {
        selectGrnNo.classList.add("is-invalid");
    }
    if (supplierpayment.paymentAmount == null) {
        textPaymentAmount.classList.add("is-invalid");
    }
    if (supplierpayment.paymentMethod_id == null) {
        selectPaymentmethod.classList.add("is-invalid");
    }
    if (supplierpayment.paymentDate == null) {
        selectpaymentDate.classList.add("is-invalid");
    }

    return errors;
}

const supplierPaymenteSubmitButton = (ob) => {
    supplierpayment.newDueAmount = document.getElementById('textNewDueAmount').value;
    supplierpayment.totalAmount = document.getElementById('textTotalAmount').value;
    supplierpayment.paymentDate = document.getElementById('selectpaymentDate').value;
    supplierpayment.dueAmount = document.getElementById('textDueAmount').value;
    supplierpayment.checkNo = document.getElementById('textChequeNo').value;
    supplierpayment.transferNo = document.getElementById('texttransactionNo').value;
    supplierpayment.transferDate = document.getElementById('textTransferDate').value;


    let errors = getErrors();

    Swal.fire({
        title: "Are you sure to Add following payment",
        // text: ob.billNo,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, Add him!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            //call post service request
            let postServiceResponce = getHTTPAjaxRequest("/supplierpayment", "POST", supplierpayment)
            //check post service requst
            if (postServiceResponce == "OK") {
                Swal.fire({
                    title: "Add successfully..!",
                    icon: "success"
                });
                $("#collapseWidthExample").collapse("hide");
                refreshSupplierPaymentForm();
                document.getElementById("SupplierpaymentFormId").reset();
                refreshSupplierPaymentTable();
            } else {
                Swal.fire({
                    title: "Fail to submit employee form ",
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

const printSupplierPayment = (ob) => {
    const supPaymentPrint = ob;

    tdSuppliername.innerText = supPaymentPrint.Supplier_id;
    tdgrnNo.innerText = supPaymentPrint.grn_id.grn_code;
    tdTotalAmount.innerText = supPaymentPrint.totalAmount;
    tdpaymentAmount.innerText = supPaymentPrint.paymentAmount;
    tdnewDueAmount.innerText = supPaymentPrint.dueAmount;
    $('#printModalSupplierPayment').modal('show');
};

const printSupplierPaymentDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printSupplierPaymentData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
const printSupplierPaymentTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Supplier Payment</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + supplierPaymentTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}

