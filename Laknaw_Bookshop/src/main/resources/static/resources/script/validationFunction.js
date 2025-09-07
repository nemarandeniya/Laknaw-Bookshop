//function for validate fullname 
const fullNameValidator = (fieldId) => {
  const fullNameValue = fieldId.value;
  const regPatttern = new RegExp("^([A-Z][a-z]{2,20}[\\s])+([A-Z][a-z]{2,20})$");
  const fullNameParts = document.getElementById("fullNameParts")

  if (fullNameValue != '') {
    if (regPatttern.test(fullNameValue)) {
      fieldId.classList.remove('is-invalid');
      fieldId.classList.add('is-valid');
      employee.fullname = fullNameValue;

      //generate calling name list
      fullNameParts.innerHTML = "";
      callingnameList = fullNameValue.split(" ")
      callingnameList.forEach(element => {
        const option = document.createElement("option");
        option.value = element;
        fullNameParts.appendChild(option)
      });
    } else {
      fullNameParts.innerHTML = ""
      fieldId.classList.remove('is-valid');
      fieldId.classList.add('is-invalid');
      employee.fullname = null;
      employee.callingname = null;
    }
  } else {
    fullNameParts.innerHTML = ""
    fieldId.classList.remove('is-valid');
    fieldId.classList.add('is-invalid');
    employee.fullname = null;
    employee.callingname = null;
  }
}


const textValidator = (inputElement, pattern, object, property) => {
  if (inputElement.value != '') {
    const regPatttern = new RegExp(pattern);//it creates a regular expression object based on the provided pattern.
    if (regPatttern.test(inputElement.value)) {//tests whether the input value matches the regular expression pattern
      //valid
      window[object][property] = inputElement.value;//updates the specified property of the specified object with the input value
      inputElement.classList.remove('is-invalid');//removes the class 'is-invalid'
      inputElement.classList.add('is-valid');//adds the class 'is-valid' to the input element
    } else {
      window[object][property] = null;//sets the specified property of the specified object to 'null'
      inputElement.classList.remove('is-valid');//removes the class 'is-valid'
      inputElement.classList.add('is-invalid');//adds the class 'is-invalid' to the input element
    }
  } else {
    window[object][property] = null;  // null binding
    if (inputElement.required) {
      inputElement.classList.remove('is-valid');//If the inputElement is empty and required, 
      inputElement.classList.add('is-invalid');//it adds the class 'is-invalid' to the input element
    } else {
      inputElement.classList.remove('is-valid');//If the inputElement is empty and not required, 
      inputElement.classList.remove('is-invalid');//it removes both 'is-valid' and 'is-invalid' classes from the input element
    }
  }
}

const selectStaticValidator = (selectElement, object, property) => {
  if (selectElement.value != '') {
    window[object][property] = selectElement.value;
    selectElement.classList.remove('is-invalid')
    selectElement.classList.add('is-valid')
  } else {
    selectElement.classList.remove('is-valid')
    selectElement.classList.add('is-invalid')
    window[object][property] = null;
  }
}

const selectDynamicValidator = (selectElement, object, property) => {
  if (selectElement.value != '') {
    selectElement.classList.remove('is-invalid')
    selectElement.classList.add('is-valid')
    window[object][property] = JSON.parse(selectElement.value);
  } else {
    selectElement.classList.remove('is-valid')
    selectElement.classList.add('is-invalid')
    window[object][property] = null;
  }
}
const passwordRetypeValidator = (fieldId) => {
  if (textPassword.value == textrepassword.value) {
    user.password = textPassword.value;
    fieldId.classList.remove('is-invalid');
    fieldId.classList.add('is-valid');
  } else {
    user.password = null;
    fieldId.classList.remove('is-valid');
    fieldId.classList.add('is-invalid');
  }
}

const FileValidator = (fieldId, ob, property, priviewId) => {
  if (fieldId.value != "") {//file element eke value ekk thiyenwd?
    let file = fieldId.files[0];//files enne array ekk widihta,file array eke 0 index eke thma file eka thiyenne
    // nameFieldId.value = file['name'];
    // window[ob][propertyTwo] = file['name']

    //file ekk upload krna nisa file reader ob ekk one
    let fileReader = new FileReader();

    fileReader.onload = function (e) {
      document.getElementById(priviewId).src = e.target.result;//priview id ekta file ob eke target eke result eka pass krnw
      //result eke thiyena img eka database ekta pass krnw
      window[ob][property] = btoa(e.target.result)//btoa eken result eka encrypt krnw
    }
    //read kranwa data set/url ekk widihta
    fileReader.readAsDataURL(file);

  }
}

const nicValidator = (element) => {
  const nicValue = element.value;

  if (nicValue != "") {
    if (new RegExp("^(([98765][0-9]{8}[VvXx])|([0-9]{12}))$").test(nicValue)) {
      //valid nm
      element.style.border = "2px solid green";
      employee.nic = nicValue

      // generate DOB
      let birthyear, birthDate;
      if (nicValue.length == 10) {//parana nic number ek nm
        birthyear = "19" + nicValue.substring(0, 2);//palaweni anka 2ta 19 ekathu krnw
        birthDate = nicValue.substring(2, 5)//3,4,5 anka walata gnnw
      } else {//aluth nic eka nm
        birthyear = nicValue.substring(0, 4)//palaweni anka 4
        birthDate = nicValue.substring(4, 7)//5,6,7 anka
      }
      console.log(birthyear, birthDate);

      //generate gender
      if (parseInt(birthDate) > 500) {
        console.log("Female");
        selectGender.value = "Female"
        employee.gender = selectGender.value
        selectGender.style.border = "2px solid green"
        birthDate = parseInt(birthDate) - 500
      } else {
        console.log("Male");
        selectGender.value = "Male"
        employee.gender = selectGender.value
        selectGender.style.border = "2px solid green"
      }

      //generate birthdate
      let birthDateOb = new Date(birthyear + "-01-01");//birth year eke january 1st ob ekk hdnw
      birthDateOb.setDate(parseInt(birthDate));//ekta ara nuber of days ekthu krnw

      //leap year(adika awuruddk) da kiylai birth date eke days gana 60ta wadida blnw(mokda feb 29 kiynne dws 60i)
      //oya dekama fulfill wenwnm 1k adu krnw.because adika awuruddk wela 60tth wadi unoth ea kiynne 29 wela thiyenne.
      // 29 n psse ewata dwsk issrhta ghin watenne ea nisa 1k adu krnwa
      if (parseFloat(birthyear) % 4 != 0 && parseInt(birthDate) > 60) {
        birthDateOb.setDate(birthDateOb.getDate() - 1)
      }
      //month eka enne array ekk nisa 1k ekathu krla gnne(0-11 athara nisa)
      let month = birthDateOb.getMonth() + 1;
      let date = birthDateOb.getDate();
      if (month < 10) {//10ta adu nm issrhta 0 danwa
        month = "0" + month
      }
      if (date < 10) {//10ta adu nm issrhta 0 danwa
        date = "0" + date
      }
      selectDate.value = birthyear + "-" + month + "-" + date;
      employee.dob = selectDate.value;
      selectDate.style.border = "2px solid green"
    }
  } else {
    //invalid nic
    element.style.border = "2px solid red";
    employee.nic = null
    employee.dob = null
    employee.gender = null;

  }
}


const checkboxValidator = (fieldId) => {
  const checkboxes = document.querySelectorAll('input[name="option"]:checked');
  if (checkboxes.length === 0) {
    alert("Please select atleast one option");
    fieldId.classList.add('is-invalid');
  } else {
    fieldId.classList.add('is-valid');
  }
}


const loyaltyPointValidator = () => {

  const getLoyaltyPoints = getajaxServiceRequest("/customer/loyaltiPointById/" + JSON.parse(selectCustomer.value).id)
  const existloyaltyPoints = parseFloat(getLoyaltyPoints)
  const inputPoints = parseFloat(document.getElementById('textLoyaltyPoint').value)

  if (textLoyaltyPoint.value != '') {
    const regPatttern = new RegExp("^(([1-9][0-9]{0,7})|([1-9][0-9]{0,7}[.][0-9]{2}))$");//it creates a regular expression object based on the provided pattern.

    if (!regPatttern.test(textLoyaltyPoint.value)) {//tests whether the input value matches the regular expression pattern
      //pattern eka invalid nm
      textLoyaltyPoint.classList.remove('is-valid');//removes the class 'is-valid'
      textLoyaltyPoint.classList.add('is-invalid');//adds the class 'is-invalid' to the input element
      window.invoice.loyalty_points = null;//sets the specified property of the specified object to 'null'
      return;
    }
    if (inputPoints > existloyaltyPoints) {
      //exist point ganata wada input karana gana wadi nm
      textLoyaltyPoint.classList.remove('is-valid')
      textLoyaltyPoint.classList.add('is-invalid')
      window.invoice.loyalty_points = null;//sets the specified property of the specified object to 'null'
      alert("You can't redeem points more than " + existloyaltyPoints + " points")
      return;
    }

    //passed all validation
    textLoyaltyPoint.classList.remove('is-invalid');//removes the class 'is-invalid'
    textLoyaltyPoint.classList.add('is-valid');//adds the class 'is-valid' to the input element
    window.invoice.loyalty_points = textLoyaltyPoint.value;//updates the specified property of the specified object with the input value

  } else {
    //input eka empty nm
    window.invoice.loyalty_points = 0;
    //isvalid,invalid class 2km ain krnwa
    textLoyaltyPoint.classList.remove('is-valid', 'is-invalid');
  }
}