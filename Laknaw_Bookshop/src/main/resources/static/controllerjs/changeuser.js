window.addEventListener("load", () => {
    refreshEditUserProfile();
})

const refreshEditUserProfile = () => {
    console.log("kk");

    logedUser = getajaxServiceRequest("/loggeduserdetail")
    oldLogedUser = getajaxServiceRequest("/loggeduserdetail")

    if (logedUser.userphoto != null) {
        PriviewPhotoId.src = atob(logedUser.userphoto) //atob for decrypt photo
    } else {
        //nttn default eka set krnw
        PriviewPhotoId.src = "resources/image/user.png";
    }

    editUserNameId.value = logedUser.username;
    editUserEmail.value = logedUser.email
}

const passwordretypeValidator = () => {
    if (editNewPassword.value == editNewRePassword.value) {
        logedUser.oldpassword = editNewPassword.value;
        editNewRePassword.classList.remove('is-invalid');
        editNewRePassword.classList.add('is-valid');
    } else {
        logedUser.oldpassword = null;
        editNewRePassword.classList.remove('is-valid');
        editNewRePassword.classList.add('is-invalid');
    }
}

const checkUpdates = () => {
    let updates = '';
    if (logedUser.username != oldLogedUser.username) {
        updates = updates + "Username is changed..! \n"
    }
    if (logedUser.userphoto != oldLogedUser.userphoto) {
        updates = updates + "User Photo is changed..! \n"
    }
    if (logedUser.oldpassword != oldLogedUser.newpassword) {
        updates = updates + "Password is changed..! \n"
    }
    if (logedUser.email != oldLogedUser.email) {
        updates = updates + "Email is changed..! \n"
    }
    return updates
}

const saveUpdates = () => {
    let updates = checkUpdates();
    if (updates != "") {
        let userConfirm = window.confirm("Are you sure to update following changes?\n")
        if (userConfirm) {
            let postServiceResponce = getHTTPAjaxRequest("/changeuserdetails/insert", "POST", logedUser);
            if (postServiceResponce == "OK") {
                window.alert("User Profile Update Successfully!")
                refreshEditUserProfile();
                window.location.replace("/logout")
            } else {
                window.alert("Fail to Submit! Form has following errors\n " + postServiceResponce)
            }
        } else {
            window.alert("Form has not any changes! ")
        }
    }
}