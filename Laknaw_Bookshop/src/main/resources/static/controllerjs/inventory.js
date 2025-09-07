window.addEventListener("load", () => {
    userPrivilege = getajaxServiceRequest("/privilegebylogedusermodule/Inventory")
    refreshInventoryTable();
})

const refreshInventoryTable = () => {
    inventory = getajaxServiceRequest("/inventory/alldata");

    const displayColumnList = [
        { dataType: "function", propertyName: getItem },
        { dataType: "text", propertyName: "total_qty" },
        { dataType: "text", propertyName: "available_qty" },
        { dataType: "text", propertyName: "sales_price" },
    ];

    fillDataIntoTable2(inventoryTable, inventory, displayColumnList, printInventory, userPrivilege)
    $("#inventoryTable").dataTable();
}

const getItem = (ob) => {
    return ob.item_id.itemname;
}


const printInventory = (ob) => {
    const inventoryPrint = ob;

    tdItem.innerText = inventoryPrint.item_id.itemname;
    tdTotalQty.innerText = inventoryPrint.total_qty;
    tdAvailableQty.innerText = inventoryPrint.available_qty;
    tdSalesPrice.innerText = inventoryPrint.sales_price;
    $('#printModalInventory').modal('show');
};



const printInventoryDataBtn = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + printInventoryData.outerHTML
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
const printInventoryTableBtn = () => {

    const newTab = window.open();
    newTab.document.write(
        '<head><title>Print Inventory</title>'
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + inventoryTable.outerHTML +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}
