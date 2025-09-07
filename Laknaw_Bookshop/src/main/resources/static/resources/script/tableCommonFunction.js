

const fillDataIntoTable = (tableId, dataList, displayPropertyList, refillFunction, deleteFunction, printFunction, privilegeOb = null) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }
      if (ob.dataType == 'photoarray') {
        let img = document.createElement("img");//img tag ekk hdnw
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.border = "1px solid black";
        img.style.borderRadius = "20px";
        if (element[ob.propertyName] == null) {//dataList[ind][ob.propertyName]
          img.src = "resources/image/user.png";
        } else {
          img.src = atob(element[ob.propertyName])
        }

        td.appendChild(img)
        // console.log("jjjjjjj" + atob(dataList[ind][ob.propertyName]));
      }

      tr.appendChild(td);

    });

    const tdButton = document.createElement('td'); // button column
    tdButton.className = 'text-center modify-button';

    const dropdownDIV = document.createElement('div');
    dropdownDIV.className = 'dropdown';

    const dropdownI = document.createElement('i');
    dropdownI.className = 'fa-solid fa-ellipsis-vertical mt-2';
    dropdownI.setAttribute('data-bs-toggle', 'dropdown');
    dropdownI.setAttribute('aria-expanded', 'false');

    dropdownDIV.appendChild(dropdownI);

    const dropdownUL = document.createElement('ul');
    dropdownUL.className = 'dropdown-menu';

    const dropdownLiEdit = document.createElement('li');
    dropdownLiEdit.className = 'dropdown-item';
    // dropdownLiEdit.innerText = 'edit';
    if (privilegeOb != null && privilegeOb.update) {
      dropdownUL.appendChild(dropdownLiEdit);
    }


    const dropdownLiDelete = document.createElement('li');
    dropdownLiDelete.className = 'dropdown-item';
    // dropdownLiDelete.innerText = 'Delete';
    if (privilegeOb != null && privilegeOb.delete) {
      dropdownUL.appendChild(dropdownLiDelete);
    }

    const dropdownLiPrint = document.createElement('li');
    dropdownLiPrint.className = 'dropdown-item';
    // dropdownLiPrint.innerText = 'Print';
    dropdownUL.appendChild(dropdownLiPrint);

    dropdownDIV.appendChild(dropdownUL);

    tdButton.appendChild(dropdownDIV);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-success w-100 fw-bold';
    editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    editButton.onclick = function () {
      //console.log('edit');
      refillFunction(element, index);
    }

    dropdownLiEdit.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger fw-bold w-100';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-beat "></i> Delete';

    deleteButton.onclick = function () {
      // console.log('delete' , element);
      deleteFunction(element, index);
    }

    dropdownLiDelete.appendChild(deleteButton);

    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-outline-info fw-bold w-100';
    viewButton.innerHTML = '<i class="fa-solid fa-eye fa-beat "></i> View';

    viewButton.onclick = function () {
      // console.log('print');
      printFunction(element, index);
    }

    dropdownLiPrint.appendChild(viewButton);


    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body



  });

}

const fillDataIntoInnerTable = (tableId, dataList, displayPropertyList, refillFunction, deleteFunction) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }
      if (ob.dataType == "decimal") {
        td.innerText = parseFloat(element[ob.propertyName]).toFixed(2)
        //line price eka ena td ekta class ekk add krnw.ethkota ea classname
        //  eka use krla line price ekta thiyena td's catch krgeta line price wala sum eka ganna plwn
        if (ob.propertyName === "line_price") {
          td.className = 'line-price';
        }
      }

      tr.appendChild(td);

    });

    const tdButton = document.createElement('td'); // button column



    const editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-success w-10 fw-bold me-2';
    editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    editButton.onclick = function () {
      //console.log('edit');
      refillFunction(element, index);
    }


    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger fw-bold w-10';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-beat "></i> Delete';

    deleteButton.onclick = function () {
      // console.log('delete' , element);
      deleteFunction(element, index);
    }

    tdButton.appendChild(editButton);// append edit button into table column 
    tdButton.appendChild(deleteButton)// append delete button into table column 


    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body

  });

}

const fillDataIntoReportTable = (tableId, dataList, displayPropertyList) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }

      tr.appendChild(td);

    });
    tableBody.appendChild(tr); // append tr into table body
  });

}

const fillDataIntoTable2 = (tableId, dataList, displayPropertyList, printFunction, privilegeOb = null) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }


      tr.appendChild(td);

    });

    const tdButton = document.createElement('td'); // button column
    tdButton.className = 'text-center modify-button';

    const dropdownDIV = document.createElement('div');
    dropdownDIV.className = 'dropdown';

    const dropdownI = document.createElement('i');
    dropdownI.className = 'fa-solid fa-ellipsis-vertical mt-2';
    dropdownI.setAttribute('data-bs-toggle', 'dropdown');
    dropdownI.setAttribute('aria-expanded', 'false');

    dropdownDIV.appendChild(dropdownI);

    const dropdownUL = document.createElement('ul');
    dropdownUL.className = 'dropdown-menu';

    // const dropdownLiEdit = document.createElement('li');
    // dropdownLiEdit.className = 'dropdown-item';
    // // dropdownLiEdit.innerText = 'edit';
    // if (privilegeOb != null && privilegeOb.update) {
    //   dropdownUL.appendChild(dropdownLiEdit);
    // }


    // const dropdownLiDelete = document.createElement('li');
    // dropdownLiDelete.className = 'dropdown-item';
    // // dropdownLiDelete.innerText = 'Delete';
    // if (privilegeOb != null && privilegeOb.delete) {
    //   dropdownUL.appendChild(dropdownLiDelete);
    // }

    const dropdownLiPrint = document.createElement('li');
    dropdownLiPrint.className = 'dropdown-item';
    // dropdownLiPrint.innerText = 'Print';
    dropdownUL.appendChild(dropdownLiPrint);

    dropdownDIV.appendChild(dropdownUL);

    tdButton.appendChild(dropdownDIV);

    // const editButton = document.createElement('button');
    // editButton.className = 'btn btn-outline-success w-100 fw-bold';
    // editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    // editButton.onclick = function () {
    //   //console.log('edit');
    //   refillFunction(element, index);
    // }

    // dropdownLiEdit.appendChild(editButton);

    // const deleteButton = document.createElement('button');
    // deleteButton.className = 'btn btn-outline-danger fw-bold w-100';
    // deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-beat "></i> Delete';

    // deleteButton.onclick = function () {
    //   // console.log('delete' , element);
    //   deleteFunction(element, index);
    // }

    // dropdownLiDelete.appendChild(deleteButton);

    const printButton = document.createElement('button');
    printButton.className = 'btn btn-outline-info fw-bold w-100';
    printButton.innerHTML = '<i class="fa-solid fa-print fa-beat "></i> Print';

    printButton.onclick = function () {
      // console.log('print');
      printFunction(element, index);
    }

    dropdownLiPrint.appendChild(printButton);


    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body
  });

}



const fillDataIntoSupPaymentTable = (tableId, dataList, displayPropertyList, refillFunction, printFunction, privilegeOb = null) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }
      if (ob.dataType == "decimal") {
        td.innerText = parseFloat(element[ob.propertyName]).toFixed(2)
      }

      tr.appendChild(td);
    });

    const tdButton = document.createElement('td'); // button column
    tdButton.className = 'text-center modify-button';

    const dropdownDIV = document.createElement('div');
    dropdownDIV.className = 'dropdown';

    const dropdownI = document.createElement('i');
    dropdownI.className = 'fa-solid fa-ellipsis-vertical mt-2';
    dropdownI.setAttribute('data-bs-toggle', 'dropdown');
    dropdownI.setAttribute('aria-expanded', 'false');

    dropdownDIV.appendChild(dropdownI);

    const dropdownUL = document.createElement('ul');
    dropdownUL.className = 'dropdown-menu';

    const dropdownLiEdit = document.createElement('li');
    dropdownLiEdit.className = 'dropdown-item';
    // dropdownLiEdit.innerText = 'edit';
    if (privilegeOb != null && privilegeOb.update) {
      dropdownUL.appendChild(dropdownLiEdit);
    }

    const dropdownLiPrint = document.createElement('li');
    dropdownLiPrint.className = 'dropdown-item';
    // dropdownLiPrint.innerText = 'Print';
    dropdownUL.appendChild(dropdownLiPrint);

    dropdownDIV.appendChild(dropdownUL);

    tdButton.appendChild(dropdownDIV);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-success w-100 fw-bold';
    editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    editButton.onclick = function () {
      //console.log('edit');
      refillFunction(element, index);
    }

    dropdownLiEdit.appendChild(editButton);

    const printButton = document.createElement('button');
    printButton.className = 'btn btn-outline-info fw-bold w-100';
    printButton.innerHTML = '<i class="fa-solid fa-print fa-beat "></i> Print';

    printButton.onclick = function () {
      // console.log('print');
      printFunction(element, index);
    }

    dropdownLiPrint.appendChild(printButton);

    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body
  });

}

const fillDataIntoTable3 = (tableId, dataList, displayPropertyList, refillFunction, deleteFunction, printFunction, privilegeOb = null) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }

      tr.appendChild(td);

    });

    const tdButton = document.createElement('td'); // button column
    tdButton.className = 'text-center modify-button';

    const dropdownDIV = document.createElement('div');
    dropdownDIV.className = 'dropdown';

    const dropdownI = document.createElement('i');
    dropdownI.className = 'fa-solid fa-ellipsis-vertical mt-2';
    dropdownI.setAttribute('data-bs-toggle', 'dropdown');
    dropdownI.setAttribute('aria-expanded', 'false');

    dropdownDIV.appendChild(dropdownI);

    const dropdownUL = document.createElement('ul');
    dropdownUL.className = 'dropdown-menu';

    const dropdownLiEdit = document.createElement('li');
    dropdownLiEdit.className = 'dropdown-item';
    // dropdownLiEdit.innerText = 'edit';
    if (privilegeOb != null && privilegeOb.update && element.purchaseorder_status_id.id !== 2) {
      dropdownUL.appendChild(dropdownLiEdit);
    }

    const dropdownLiDelete = document.createElement('li');
    dropdownLiDelete.className = 'dropdown-item';
    // dropdownLiDelete.innerText = 'Delete';
    if (privilegeOb != null && privilegeOb.delete) {
      dropdownUL.appendChild(dropdownLiDelete);
    }

    const dropdownLiPrint = document.createElement('li');
    dropdownLiPrint.className = 'dropdown-item';
    // dropdownLiPrint.innerText = 'Print';
    dropdownUL.appendChild(dropdownLiPrint);

    dropdownDIV.appendChild(dropdownUL);

    tdButton.appendChild(dropdownDIV);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-success w-100 fw-bold';
    editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    editButton.onclick = function () {
      //console.log('edit');
      refillFunction(element, index);
    }

    dropdownLiEdit.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger fw-bold w-100';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-beat "></i> Delete';

    deleteButton.onclick = function () {
      // console.log('delete' , element);
      deleteFunction(element, index);
    }

    dropdownLiDelete.appendChild(deleteButton);

    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-outline-info fw-bold w-100';
    viewButton.innerHTML = '<i class="fa-solid fa-eye fa-beat "></i> View';

    viewButton.onclick = function () {
      // console.log('print');
      printFunction(element, index);
    }

    dropdownLiPrint.appendChild(viewButton);


    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body
  });
}
const fillDataIntoTable4 = (tableId, dataList, displayPropertyList, refillFunction, deleteFunction, printFunction, privilegeOb = null) => {

  const tableBody = tableId.children[1];
  tableBody.innerHTML = '';

  dataList.forEach((element, index) => {
    const tr = document.createElement('tr');

    const tdIndex = document.createElement('td');
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayPropertyList.forEach((ob, ind) => {
      const td = document.createElement('td');
      if (ob.dataType == 'text') {
        td.innerText = element[ob.propertyName];
      }
      if (ob.dataType == 'function') {
        td.innerHTML = ob.propertyName(element);
      }

      tr.appendChild(td);

    });

    const tdButton = document.createElement('td'); // button column
    tdButton.className = 'text-center modify-button';

    const dropdownDIV = document.createElement('div');
    dropdownDIV.className = 'dropdown';

    const dropdownI = document.createElement('i');
    dropdownI.className = 'fa-solid fa-ellipsis-vertical mt-2';
    dropdownI.setAttribute('data-bs-toggle', 'dropdown');
    dropdownI.setAttribute('aria-expanded', 'false');

    dropdownDIV.appendChild(dropdownI);

    const dropdownUL = document.createElement('ul');
    dropdownUL.className = 'dropdown-menu';

    const dropdownLiEdit = document.createElement('li');
    dropdownLiEdit.className = 'dropdown-item';
    // dropdownLiEdit.innerText = 'edit';
    if (privilegeOb != null && privilegeOb.update && element.request_price_status_id.id !== 2) {
      dropdownUL.appendChild(dropdownLiEdit);
    }

    const dropdownLiDelete = document.createElement('li');
    dropdownLiDelete.className = 'dropdown-item';
    // dropdownLiDelete.innerText = 'Delete';
    if (privilegeOb != null && privilegeOb.delete) {
      dropdownUL.appendChild(dropdownLiDelete);
    }

    const dropdownLiPrint = document.createElement('li');
    dropdownLiPrint.className = 'dropdown-item';
    // dropdownLiPrint.innerText = 'Print';
    dropdownUL.appendChild(dropdownLiPrint);

    dropdownDIV.appendChild(dropdownUL);

    tdButton.appendChild(dropdownDIV);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-success w-100 fw-bold';
    editButton.innerHTML = '<i class="fa-solid fa-edit fa-beat "></i> Edit';

    editButton.onclick = function () {
      //console.log('edit');
      refillFunction(element, index);
    }

    dropdownLiEdit.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger fw-bold w-100';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash fa-beat "></i> Delete';

    deleteButton.onclick = function () {
      // console.log('delete' , element);
      deleteFunction(element, index);
    }

    dropdownLiDelete.appendChild(deleteButton);

    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-outline-info fw-bold w-100';
    viewButton.innerHTML = '<i class="fa-solid fa-eye fa-beat "></i> View';

    viewButton.onclick = function () {
      // console.log('print');
      printFunction(element, index);
    }

    dropdownLiPrint.appendChild(viewButton);


    tr.appendChild(tdButton); // append button column into table row

    tableBody.appendChild(tr); // append tr into table body
  });
}