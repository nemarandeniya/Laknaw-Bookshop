window.addEventListener("load", () => {

    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/User")
    refreshUserTable();

    refreshUserForm();
});

const refreshUserTable = () => {

    users = getajaxServiceRequest("/user/findall");

    const displayColumnList = [
        { dataType: "function", propertyName: getEmployeename },
        { dataType: "text", propertyName: "username" },
        { dataType: "text", propertyName: "email" },
        { dataType: "function", propertyName: getRoleName },
        { dataType: "function", propertyName: getStatus }
    ];

    fillDataIntoTable(userTable, users, displayColumnList, refillUserForm, deleteUser, printuser, userPrivilege);

    $("#userTable").dataTable();
};

const getEmployeename = (ob) => {
    return ob.employee_id.fullname;
};

const getRoleName = (ob) => {
    let userRoles = "";
    ob.roles.forEach((element, index) => {
        if (index == ob.roles.length - 1) {
            userRoles = userRoles + element.name;
        } else {
            userRoles = userRoles + element.name + ",";
        }
    });
    return userRoles;
};

const getStatus = (ob) => {
    console.log(ob.status);

    if (ob.status) {
        return '<p class="user-active"> Active </p>';
    } else {
        return '<p class="user-inactive"> In-Active </p>';
    }

};

const refillUserForm = (rowOb) => {
    $("#collapseWidthExample").collapse("show");
    user = JSON.parse(JSON.stringify(rowOb));//js object(rowOb) eka convert krnwa json string ekkt ita psse aluth java script ob ekk hdnw.meke purpose eka thama rowOb ekta samana eth wenama copy ekk hdnna.
    oldUser = rowOb;

    //elementID.value = object.adalapropertyname eka
    textUsername.value = user.username;
    textEmail.value = user.email;

    if (user.status) {
        chkStatus.checked = true;
        labelUserStatus.innerText = "User Account is Active"
    } else {
        chkStatus.checked = false;
        labelUserStatus.innerText = "User Account is Not-Active "
    }

    employeeListWithoutUserAccount = getajaxServiceRequest("/employee/listwithoutuseraccount");
    employeeListWithoutUserAccount.push(user.employee_id)
    fillDataIntoSelect(selectEmployee, "select Employee", employeeListWithoutUserAccount, "fullname", user.employee_id.fullname);

    selectEmployee.disabled = true;
    textPassword.disabled = true;
    textrepassword.disabled = true;

    //get roles list
    roles = getajaxServiceRequest("/role/listwithoutadmin");
    divRoles.innerHTML = "";
    roles.forEach(role => {
        div = document.createElement('div');
        div.className = "form-check form-check-inline";
        inputCHK = document.createElement('input')
        inputCHK.type = 'checkbox';
        inputCHK.className = 'form-check-input';
        label = document.createElement('label');
        label.className = "form-check-label fw-bold ms-2";
        label.innerText = role.name;

        inputCHK.onchange = function () {
            if (this.checked) {
                user.roles.push(role)
            } else {
                // user.roles.pop(role);
                let extIndex = user.roles.map(element => element.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        let extIndex = user.roles.map(element => element.name).indexOf(role.name);
        if (extIndex != -1) {
            inputCHK.checked = true;
        }

        div.appendChild(inputCHK);
        div.appendChild(label);
        divRoles.appendChild(div)
    });

    //disable add button and enable update button
    let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/User")
    // console.log(userPrivilege);

    if (userPrivilege.update === true) {
        btnUpdate.style.visibility = "";
        btnAdd.style.visibility = "hidden";
    } else {
        btnUpdate.style.visibility = "hidden"
        btnAdd.style.visibility = "hidden";
    }

}

const deleteUser = (rowOb, rowIndex) => {
    console.log("User delete");
    console.log(rowOb, rowIndex);

    //uuser confirmation
    let userConfirm = confirm("Are you sure to delete following user \n" + "Username : " + rowOb.username);
    if (userConfirm) {
        //call delete service
        let deleteServiceResponce = getHTTPAjaxRequest("/user", "DELETE", rowOb);
        //chech delete service responce
        if (deleteServiceResponce == "OK") {
            alert("User Delete Complete..!")
            refreshUserTable();
            formId.reset();
            refreshUserForm();
        } else {
            alert("Fail to delete User..! \n" + deleteServiceResponce);
        }
    }
}
const printuser = (ob) => {
    const userPrint = ob;

    tdEmployeeName.innerText = userPrint.employee_id.fullname;
    tdUsername.innerText = userPrint.username;
    tdEmail.innerText = userPrint.email;
    tdRole.innerText = userPrint.role;
    tdStatus.innerText = userPrint.status;

    $('#printModalUser').modal('show');
}

// const printUserDataBtn = () => {
//     const newTab = window.open();
//     newTab.document.write(
//         '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
//         + printUserData.outerHTML
//     );

//     setInterval(function () {
//         newTab.print()
//     }, 1000)
// }

// const printUserTableBtn = () => {

//     const newTab = window.open();
//     newTab.document.write(
//         '<head><title>Print User</title>'
//         + '<script src="resources/script/jquery-3.7.1.js"></script>' +
//         '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
//         + userTable.outerHTML +
//         '<script> $(".modify-button").css("display","none")</script>'
//     );

//     setInterval(function () {
//         newTab.print()
//     }, 1000)
// }

const refreshUserForm = () => {

    //create user object
    user = new Object();
    oldUser = null;

    user.roles = new Array();//create new array

    selectEmployee.disabled = false;
    textPassword.disabled = false;
    textrepassword.disabled = false;

    //get employee list whithout having user account
    employeeListWithoutUserAccount = getajaxServiceRequest("/employee/listwithoutuseraccount");
    fillDataIntoSelect(selectEmployee, "select Employee", employeeListWithoutUserAccount, "fullname");

    //get roles list
    roles = getajaxServiceRequest("/role/listwithoutadmin");
    divRoles.innerHTML = "";
    roles.forEach(role => {
        div = document.createElement('div');
        div.className = "form-check form-check-inline";
        inputCHK = document.createElement('input')
        inputCHK.type = 'checkbox';
        inputCHK.className = 'form-check-input';
        label = document.createElement('label');
        label.className = "form-check-label fw-bold ms-2";
        label.innerText = role.name;

        inputCHK.onchange = function () {
            if (this.checked) {
                user.roles.push(role)
            } else {
                // user.roles.pop(role);
                let extIndex = user.roles.map(element => element.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }
        div.appendChild(inputCHK);
        div.appendChild(label);
        divRoles.appendChild(div)
    });
    if (chkStatus.checked) {
        user.status = true;
        labelUserStatus.innerText = "User Account is Active "
    } else {
        user.status = false;
        labelUserStatus.innerText = "User Account is not-Active "
    }
    // user.status = false;
    // labelUserStatus.innerText = "User Account is not Active";

    btnUpdate.style.visibility = "hidden"
    btnAdd.style.visibility = ""
}

const checkUserFormErrors = () => {
    let errors = "";
    if (user.employee_id == null) {
        errors = errors + "Please select Employee..! \n";
    }
    if (user.username == null) {
        errors = errors + "Please enter Username..! \n";
    }
    if (oldUser == null) {
        if (user.password == null) {
            errors = errors + "Please enter Password..!\n";
        }
        if (textrepassword.value == "") {
            errors = errors + "Please enter Retype Password..!\n";
        }
    }
    if (user.email == null) {
        errors = errors + "Please Enter email..! \n";
    }
    if (user.roles.length == 0) {
        errors = errors + "Please select roles..! \n";
    }
    return errors;
}

const checkUserFormUpdates = () => {
    let updates = "";

    if (user.username != oldUser.username) {
        updates = updates + "Username is changed...\n";
    }
    if (user.email != oldUser.email) {
        updates = updates + "Email is changed...\n";
    }
    if (user.status != oldUser.status) {
        updates = updates + "Status is changed...\n";
    }
    if (user.roles.length != oldUser.roles.length) {
        updates = updates + "Roles are changed...\n";
    }
    return updates;
}

const updateUser = () => {
    console.log("Update");

    //check form errors
    let errors = checkUserFormErrors();
    if (errors == "") {
        //check form updates
        let updates = checkUserFormUpdates();
        if (updates == "") {
            alert("Nothing happened..!");
        } else {
            let userConfirm = confirm("Are you sure to update following changes? \n" + updates);
            if (userConfirm) {
                let putResponce = getHTTPAjaxRequest("/user", "PUT", user);
                if (putResponce == "OK") {
                    alert("Update Successfully..!");
                    $("#collapseWidthExample").collapse("hide");
                    refreshUserTable();
                    userForm.reset();
                    refreshUserForm();
                } else {
                    alert("Update Not-Successfully..! \n Has following error \n" + putResponce);
                }
            }
        }
    } else {
        alert("Form has following errors..! \n" + errors);
    }
}

const buttonUserFormSubmit = () => {
    console.log("Submit");
    console.log(user);

    let errors = checkUserFormErrors();
    if (errors == "") {
        //user confirmation
        let userConfirmation = confirm("Are you sure to submit following user? \n"
            + "User Name : " + user.username
            + "\n Employee : " + user.employee_id.fullname
        );
        if (userConfirmation) {
            //call post service
            let postServiceResponce = getHTTPAjaxRequest("/user", "POST", user);
            if (postServiceResponce == "OK") {
                alert("Save Successfully..!");
                refreshUserTable();
                formId.reset();
                refreshUserForm();
            } else {
                alert("Fail to save..\n" + postServiceResponce);
            }
        }
    } else {
        alert("Form has following errors..\n" + errors);
    }
}