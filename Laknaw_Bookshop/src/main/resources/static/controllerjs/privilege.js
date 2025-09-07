window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/User")

    refreshPrivilegeTable();
    refreshPrivilegeForm();
});

const refreshPrivilegeTable = () => {
    privilege = [];
    privilege = getajaxServiceRequest("/privilege/findall");

    const displayPropertyList = [{ dataType: "function", propertyName: getRole },
    { dataType: "function", propertyName: getModuele },
    { dataType: "function", propertyName: getSelectPrivi },
    { dataType: "function", propertyName: GetInsertPrivi },
    { dataType: "function", propertyName: GetUpdatePrivi },
    { dataType: "function", propertyName: getDeleteprivi },
    { dataType: "function", propertyName: getStatus }
    ];

    //call fillDataIntoTable function
    fillDataIntoTable(privilegeTable, privilege, displayPropertyList, privilegeFormRefill, DeletePrivilege, Printprivilege, userPrivilege);

    //call jquery datatable function
    $("#privilegeTable").dataTable();
};

const refreshPrivilegeForm = () => {
    privilege = new Object();

    roles = getajaxServiceRequest("/role/listwithoutadmin");
    fillDataIntoSelect(selectRole, "Select Role", roles, "name")

    modules = getajaxServiceRequest("/module/alldata");
    fillDataIntoSelect(selectModule, "Select Module", modules, "name")

    privilagestatus = getajaxServiceRequest("/privilegestatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Status", privilagestatus, "name")

    btnUpdate.style.visibility = "hidden"
    btnAdd.style.visibility = ""

    const checkSelect = document.getElementById("chkSelect")
    const checkUpdate = document.getElementById("chkUpdate")
    const checkInsert = document.getElementById("chkInsert")
    const checkDelete = document.getElementById("chkDelete")
    checkSelect.checked = false
    checkUpdate.checked = false
    checkInsert.checked = false
    checkDelete.checked = false

};
const getStatus = (ob) => {         //deleted  -> record is deleted     
    // console.log(ob.privilegestatus_id);        //active -> record is usable                                

    if (ob.privilegestatus_id.name == "Granted") {               //inactive -> record is tempararaly disable
        return '<p class="privilege-granted"> Granted </p>';
    } if (ob.privilegestatus_id.name == "Expired") {
        return '<p class="privilege-expired"> Expired</p>';
    } else {
        return '<p class="privilege-revoked"> Revoked </p>';
    }

};

const getRole = (ob) => {
    return ob.role_id.name;
}

const getModuele = (ob) => {
    return ob.module_id.name;
}

const getSelectPrivi = (ob) => {
    if (ob.selpriv) {
        return "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>";
    } else {
        return "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
        // return "<i class='fa-solid fa-xmark-circle fa-2x' ></i>";
    }
}

const GetInsertPrivi = (ob) => {
    if (ob.insertpriv) {
        return "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>";
    } else {
        return "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
}

const GetUpdatePrivi = (ob) => {
    if (ob.updpriv) {
        return "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>";
    } else {
        return "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
}

const getDeleteprivi = (ob) => {
    if (ob.delpriv) {
        return "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>";
    } else {
        return "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
}

const privilegeSubmitButton = () => {
    console.log("privilege");
    const privilegeSubmitResponse = confirm('Are you sure to submit..?');

    if (privilegeSubmitResponse) {

        let postServiceResponce = getHTTPAjaxRequest("/privilege", "POST", privilege);

        if (postServiceResponce == "OK") {
            alert("Save Successfully..!");
            $("#collapseWidthExample").collapse("hide");
            refreshPrivilegeForm();
            privilegeForm.reset();
            refreshPrivilegeTable();
        } else {
            alert("Fail to submit employee form \n" + postServiceResponce);
        }
    } else {
        alert("Form has following error...");
    }
}




const privilegeFormRefill = (rowOb) => {

    $("#collapseWidthExample").collapse("show");
    privilege = JSON.parse(JSON.stringify(rowOb));//js object(rowOb) eka convert krnwa json string ekkt ita psse aluth java script ob ekk hdnw.meke purpose eka thama rowOb ekta samana eth wenama copy ekk hdnna.
    oldPrivilege = rowOb;

    //disable update button and enable add button
    btnAdd.style.visibility = "hidden";
    btnUpdate.style.visibility = "";

    roles = getajaxServiceRequest("/role/listwithoutadmin");
    fillDataIntoSelect(selectRole, "Select Role", roles, "name", rowOb.role_id.name)

    modules = getajaxServiceRequest("/module/alldata");
    fillDataIntoSelect(selectModule, "Select Module", modules, "name", rowOb.module_id.name)

    privilagestatus = getajaxServiceRequest("/privilegestatus/alldata");
    fillDataIntoSelect(selectStatus, "Select Status", privilagestatus, "name", rowOb.privilegestatus_id.name)


    if (rowOb.selpriv) {
        chkSelect.checked = true;
        selectLabel.innerText = "Select Privilege Granted";
    }
    if (rowOb.insertpriv) {
        chkInsert.checked = true;
        insertLabel.innerText = "Insert Privilege Granted";
    }
    if (rowOb.updpriv) {
        chkUpdate.checked = true;
        updateLabel.innerText = "Update Privilege Granted";
    }
    if (rowOb.delpriv) {
        chkDelete.checked = true;
        deleteLabel.innerText = "Delete Privilege Granted";
    }
    // if (selectCheck.checked) {
    //     rowOb.selpriv = true
    // } else {
    //     rowOb.selpriv = false
    // }
}

const DeletePrivilege = (rowOb) => {
    console.log("delete");

    //user confirmation
    let userConfirm = confirm("Role : " + rowOb.role_id.name +
        "\n Module : " + rowOb.module_id.name +
        "\n Are you sure to delete above privilege..?");

    if (userConfirm) {
        let deleteServiceResponce = getHTTPAjaxRequest("/privilege", "Delete", rowOb);

        if (deleteServiceResponce == "OK") {
            alert("Delete Successfully..!");
            refreshPrivilegeTable();
            privilegeForm.reset();
            refreshPrivilegeForm();
        } else {
            alert("Delete Not Competed : " + deleteServiceResponce);
        }
    }
}

const checkPrivilegeFormErrors = () => {
    let errors = "";
    if (privilege.role_id == null) {
        errors = errors + "Please select Role..! \n";
    }
    if (privilege.module_id == null) {
        errors = errors + "Please select Module..! \n";
    }
    return errors;
}
const checkPrivilegeFormUpdates = () => {
    let updates = "";

    if (privilege.role_id.id != oldPrivilege.role_id.id) {
        updates = updates + "Role is changed..\n";
    }
    if (privilege.module_id.id != oldPrivilege.module_id.id) {
        updates = updates + "Module is changed..\n";
    }
    if (privilege.insertpriv != oldPrivilege.insertpriv) {
        updates = updates + "Insert privilege is changed..\n";
    }
    if (privilege.selpriv != oldPrivilege.selpriv) {
        updates = updates + "Select privilege is changed..\n";
    }
    if (privilege.updpriv != oldPrivilege.updpriv) {
        updates = updates + "Update privilege is changed..\n";
    }
    if (privilege.delpriv != oldPrivilege.delpriv) {
        updates = updates + "Delete privilege is changed..\n";
    }
}

const updatePrivilege = () => {
    console.log("update");

    //check form errors
    let errors = checkPrivilegeFormErrors();
    if (errors == "") {
        //check form updates
        let updates = checkPrivilegeFormUpdates();
        if (updates == "") {
            alert("Nothing happened..!");
        } else {
            let userConfirm = confirm("Are you sure to update following changes? \n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPAjaxRequest("/privilege", "PUT", privilege);// $.ajax("/item", {type: "PUT",async: false,contentType: "application/json",data: JSON.stringify(item),success: function (successResponceOb) {putServiceResponce = successResponceOb;},error: function (failResponceOb) {putServiceResponce = failResponceOb;},});
                if (putResponce == "OK") {
                    alert("Update Successfully..!");
                    $("#collapseWidthExample").collapse("hide");
                    refreshPrivilegeTable()
                    privilegeForm.reset();
                    refreshPrivilegeForm()
                } else {
                    alert("Update Not-Successfully..! \n Has following error \n" + putResponce);
                }
            }
        }
    }
}

const Printprivilege = (ob) => {
    const privilegePrint = ob

    tdRole.innerText = privilegePrint.role_id.name;
    tdModule.innerText = privilegePrint.module_id.name;
    if (privilegePrint.selpriv) {
        tdSelect.innerHTML = "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>"
    } else {
        tdSelect.innerHTML = "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
    if (privilegePrint.insertpriv) {
        tdInsert.innerHTML = "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>"
    } else {
        tdInsert.innerHTML = "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
    if (privilegePrint.updpriv) {
        tdUpdate.innerHTML = "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>"
    } else {
        tdUpdate.innerHTML = "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }
    if (privilegePrint.delpriv) {
        tdDelete.innerHTML = "<i class='fa-solid fa-circle-check fa-xl' style='color: #63E6BE;'></i>"
    } else {
        tdDelete.innerHTML = "<i class='fa-solid fa-xmark-circle fa-xl' style='color: #ec1354;'></i>";
    }


    $('#printModalPrivilege').modal('show');
}

// const printPrivilageDataBtn = () => {
//     const newTab = window.open();
//     newTab.document.write(
//         '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
//         '<link rel="stylesheet" href="resources/fontawesome-free-6.4.2/css/all.css" />'
//         + printPrivilegeData.outerHTML
//     );

//     setInterval(function () {
//         newTab.print()
//     }, 1000)
// }

// const printPrivilegeTableBtn = () => {
//     const newTab = window.open();
//     newTab.document.write(
//         '<head><title>Print Employee</title>'
//         + '<script src="resources/script/jquery-3.7.1.js"></script>' +
//         '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
//         ' <link rel="stylesheet" href="resources/fontawesome-free-6.4.2/css/all.css" />'
//         + privilegeTable.outerHTML +
//         '<script> $(".modify-button").css("display","none")</script>'
//     );

//     setInterval(function () {
//         newTab.print()
//     }, 1000)
// }