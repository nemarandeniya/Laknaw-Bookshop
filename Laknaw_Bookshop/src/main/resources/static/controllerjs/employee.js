window.addEventListener("load", () => {
  // tooltip enable
  $('[data-bs-toggle="tooltip"]').tooltip();

  userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Employee")

  //call table refresh function
  refreshEmployeeTable();

  //call form refresh function
  refreshEmployeeForm();
});

const refreshEmployeeTable = () => {
  // employees = [];

  //call jquary ajax function

  employees = getajaxServiceRequest("/employee/alldata")
  //ajax("URL",option)
  // $.ajax("/employee/alldata", {
  //   contentType: "json",
  //   type: "GET",
  //   async: false,
  //   success: function (data) {
  //     console.log("Success " + data);
  //     employees = data;
  //   },

  //   error: function (resData) {
  //     console.log("Error " + resData);
  //     employees = [];
  //   },
  // });

  const displayPropertyList = [
    { dataType: "text", propertyName: "fullname" },
    { dataType: "text", propertyName: "nic" },
    { dataType: "photoarray", propertyName: "emp_photo" },
    { dataType: "text", propertyName: "email" },
    { dataType: "text", propertyName: "mobile" },
    { dataType: "function", propertyName: getDesignation },
    { dataType: "function", propertyName: getEmployeeStatus },
  ];

  fillDataIntoTable(
    employeeTable,
    employees,
    displayPropertyList,
    employeeFormRefill,
    deleteEmployee,
    printEmployee,
    userPrivilege
  );

  //disable delete button
  employees.forEach((element, index) => {
    if (element.employeestatus_id.name == "Delete") {
      if (userPrivilege.delete) {
        employeeTable.children[1].children[index].children[8].children[0].children[1].children[1].visibility = "hidden";
      }
    }
  });

  $("#employeeTable").dataTable();

  // divModifyButton.className = "d-none";
};

const refreshEmployeeForm = () => {
  employee = new Object();

  formEmployee.reset()

  empphoto.value = "";//file eke value eka clear krnwa
  imgEmpPriview.src = "resources/image/user.png";//default img eka set krnw


  employeeStatus = getajaxServiceRequest("/employeeStatus/alldata");
  fillDataIntoSelect(selectStatus, "Select your status", employeeStatus, "name")

  selectStatus.value = JSON.stringify(employeeStatus[0]);
  employee.employeestatus_id = employeeStatus[0];
  selectStatus.classList.add('is-valid');
  selectStatus.disabled = "disabled"

  designation = getajaxServiceRequest("/designation/alldata");
  fillDataIntoSelect(selectDestination, "Select your designation", designation, "name")

  //disable update button and enable add button
  btnUpdate.style.visibility = "hidden";
  // btnUpdate.style.cursor = "not-allowed";
  //$("#btnUpdate").css("cursor","not-allowed");

  btnAdd.style.visibility = "";
  // btnAdd.style.cursor = "pointer";
}


const employeeFormRefill = (ob) => {
  $("#collapseWidthExample").collapse("show");
  employee = JSON.parse(JSON.stringify(ob));
  oldEmployee = JSON.parse(JSON.stringify(ob));//for compare updates

  textFullName.value = ob.fullname;
  textCallingName.value = ob.callingname;
  textNic.value = ob.nic;
  textEmail.value = ob.email;
  textmobile.value = ob.mobile;
  selectDate.value = ob.dob;
  textAddress.value = ob.address;
  selectGender.value = ob.gender;

  if (ob.landno != null) {
    textland.value = ob.landno;
  } else {
    textland.value = "";
  }

  if (ob.note != null) {
    textNote.value = ob.note;
  } else {
    textNote.value = "";
  }

  if (ob.emp_photo != null) {
    //photo ekk thibboth eka database eken arn decrypt krla set krnw
    imgEmpPriview.src = atob(ob.emp_photo)
  } else {
    //nttn default eka set krnw
    imgEmpPriview.src = "resources/image/user.png";
  }

  designation = getajaxServiceRequest("/designation/alldata");
  fillDataIntoSelect(selectDestination, "Select designation", designation, "name", ob.designation_id.name)

  employeeStatus = getajaxServiceRequest("/employeeStatus/alldata");
  fillDataIntoSelect(selectStatus, "Select your status", employeeStatus, "name", ob.employeestatus_id.name)

  selectCivilStatus.value = ob.civilstatus;


  //disable add button and enable update button
  let userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Employee")
  // console.log(userPrivilege);

  if (userPrivilege.update === true) {
    btnUpdate.style.visibility = "";
    btnAdd.style.visibility = "hidden";
  } else {
    btnUpdate.style.visibility = "hidden"
    btnAdd.style.visibility = "hidden";
  }

};

const getDesignation = (ob) => {
  return ob.designation_id.name;
};

const getEmployeeStatus = (ob) => {
  if (ob.employeestatus_id.name == "Working") {
    // return '<p class="status-working">' + ob.employeestatus_id.name + "</p>";
    return '<p class="status-working">' + ob.employeestatus_id.name + '</p>';
  }

  if (ob.employeestatus_id.name == "Resign") {
    return '<p  class="status-resign">' + ob.employeestatus_id.name + '</p>';
  }

  if (ob.employeestatus_id.name == "Delete") {
    return '<p  class="status-delete">' + ob.employeestatus_id.name + '</p>';
  } else {
    return '<p  class="status-other">' + ob.employeestatus_id.name + '</p>';
  }
};

const deleteEmployee = (ob) => {

  sweetAlert(
    "Are you sure to delete following employee?",
    ob.fullname,
    "warning",
    true,
    'Yes, delete him!',
    'Cancel'
  ).then((result) => {
    if (result.isConfirmed) {
      let deleteServiceResponce = getHTTPAjaxRequest("/employee", "DELETE", ob);
      if (deleteServiceResponce == "OK") {
        Swal.fire({
          title: "Delete successfully..!",
          icon: "success"
        });
        // alert("Delete successfully..!");
        refreshEmployeeTable();
        formEmployee.reset();
        refreshEmployeeForm();
      } else {
        Swal.fire({
          title: "Delete Not Competed ",
          text: deleteServiceResponce,
          icon: "error"
        });
      }
    }
  })
  // let userConfirm = confirm("Are you sure to delete following employee \n" + ob.fullname);
  // if (userConfirm) {
  //   let deleteServiceResponce;

  //   $.ajax("/employee", {
  //     type: "DELETE",
  //     contentType: "application/json",
  //     data: JSON.stringify(ob),
  //     async: false,
  //     success: function (data) {
  //       deleteServiceResponce = data;
  //     },
  //     error: function (errorData) {
  //       deleteServiceResponce = errorData;
  //     }

  //   });
  //   if (deleteServiceResponce == "OK") {
  //     Swal.fire({
  //       title: "Good job!",
  //       text: "Delete successfully..!",
  //       icon: "success"
  //     });
  //     // alert("Delete successfully..!");
  //     refreshEmployeeTable();
  //     formEmployee.reset();
  //     refreshEmployeeForm();
  //   } else {

  //     alert("Delete Not Competed : " + deleteServiceResponce);
  //   }
  // }
};
const printEmployee = (ob) => {
  const employeePrint = ob;

  tdFullName.innerText = employeePrint.fullname;
  tdNic.innerText = employeePrint.nic;
  tdMobile.innerText = employeePrint.mobile;
  tdGender.innerText = employeePrint.gender;
  tdEmail.innerText = employeePrint.email;
  tdDesignation.innerText = employeePrint.designation_id.name;
  tdStatus.innerText = employeePrint.employeestatus_id.name;
  $('#printModalEmployee').modal('show');
};

const employeeSubmitButton = (ob) => {
  let errors = getErrors();
  if (errors) {
    Swal.fire({
      title: "Form has following error...",
      text: errors,
      icon: "error"
    });
  }

  Swal.fire({
    title: "Are you sure to Add following employee",
    text: employee.fullname,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: 'Yes, Add him!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      //call post service request
      let postServiceResponce = getHTTPAjaxRequest("/employee", "POST", employee)
      //check post service requst
      if (postServiceResponce == "OK") {
        Swal.fire({
          title: "Add successfully..!",
          icon: "success"
        });
        $("#collapseWidthExample").collapse("hide");
        refreshEmployeeForm();
        formEmployee.reset();
        refreshEmployeeTable();
      } else {
        Swal.fire({
          title: "Fail to submit employee form ",
          text: postServiceResponce,
          icon: "error"
        });
      }
    }
  })
}

const checkEmployeeFormUpdates = () => {
  let updates = "";
  if (employee.fullname != oldEmployee.fullname) {
    updates = updates + "Employee Fullname is changed..! \n";
  }
  if (employee.callingname != oldEmployee.callingname) {
    updates = updates + "Employee Callingname is changed..! \n";
  }
  if (employee.nic != oldEmployee.nic) {
    updates = updates + "Employee Nic is changed..! \n";
  }
  if (employee.emp_photo != oldEmployee.emp_photo) {
    updates = updates + "Employee photo is changed..! \n";
  }
  if (employee.gender != oldEmployee.gender) {
    updates = updates + "Employee Gender is changed..! \n";
  }
  if (employee.email != oldEmployee.email) {
    updates = updates + "Employee Email is changed..! \n";
  }
  if (employee.mobile != oldEmployee.mobile) {
    updates = updates + "Employee Mobile is changed..! \n";
  }
  if (employee.landno != oldEmployee.landno) {
    updates = updates + "Employee Land number is changed..! \n";
  }
  if (employee.note != oldEmployee.note) {
    updates = updates + "Employee Note is changed..! \n";
  }
  if (employee.civilstatus != oldEmployee.civilstatus) {
    updates = updates + "Employee Civil Status is changed..! \n";
  }
  if (employee.employeestatus_id.id != oldEmployee.employeestatus_id.id) {
    updates = updates + "Employee Employee Status is changed..! \n";
  }
  if (employee.designation_id.id != oldEmployee.designation_id.id) {
    updates = updates + "Employee Designation is changed..! \n";
  }
  return updates;
}

const updateEmployee = () => {
  console.log("update");

  let errors = getErrors();
  if (errors == "") {
    let updates = checkEmployeeFormUpdates();
    if (updates == "") {
      Swal.fire({
        title: "Nothing updated..!",
        icon: "info"
      })
    } else {
      Swal.fire({
        title: "Are you sure to update following Employee",
        text: updates,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          //call put service request
          let putServiceResponce = getHTTPAjaxRequest("/employee", "PUT", employee)
          //check put service Responce
          if (putServiceResponce == "OK") {
            Swal.fire({
              title: "Update successfully..!",
              icon: "success"
            });
            $("#collapseWidthExample").collapse("hide");
            refreshEmployeeTable();
            formEmployee.reset();
            refreshEmployeeForm();
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
  if (employee.fullname == "") {
    textFullName.classList.add("is-invalid");
  }
  if (employee.callingname == null) {
    textCallingName.classList.add("is-invalid");
  }
  if (employee.mobile == null) {
    textmobile.classList.add("is-invalid");
  }
  if (employee.nic == null) {
    textNic.classList.add("is-invalid");
  }
  if (employee.gender == null) {
    selectGender.classList.add("is-invalid");
  }
  if (employee.email == "") {
    textEmail.classList.add("is-invalid");
    errors = errors + "please enter your email..! \n";
  }
  if (employee.address == null) {
    textAddress.classList.add("is-invalid");
  }
  if (employee.dob == null) {
    selectDate.classList.add("is-invalid");
  }
  if (employee.civilstatus == null) {
    selectCivilStatus.classList.add("is-invalid");
  }
  if (employee.designation_id == null) {
    selectDestination.classList.add("is-invalid");
  }
  if (employee.employeestatus_id == null) {
    selectStatus.classList.add("is-invalid");
  }
  return errors;
}
