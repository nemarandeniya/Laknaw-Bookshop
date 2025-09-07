package lk.Laknaw_Bookshop.GRN;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.inventory.Inventory;
import lk.Laknaw_Bookshop.inventory.InventoryDao;
import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.purchaseorder.PurchaseOrder;
import lk.Laknaw_Bookshop.purchaseorder.PurchaseOrderDao;
import lk.Laknaw_Bookshop.purchaseorder.PurchaseOrderStatusDao;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class GoodReceiceNoteController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private GoodReceiveNoteDao goodReceiveNoteDao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @RequestMapping(value = "/grn")
    public ModelAndView grnUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView grnView = new ModelAndView();
        grnView.addObject("logusername", auth.getName());
        grnView.addObject("title", "GRN Management");
        grnView.setViewName("grn.html");
        return grnView;
    }

    @GetMapping(value = "/grn/alldata", produces = "application/json")
    public List<GoodReceiveNote> allGRNData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "GRN");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return goodReceiveNoteDao.findAll();
    }

    @PostMapping(value = "/grn")
    public String saveGrn(@RequestBody GoodReceiveNote goodReceiveNote) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "GRN");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set added date time
            goodReceiveNote.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            goodReceiveNote.setAddeduser_id(loggeduser.getId());

            // set next grn code number
            String nextNumber = goodReceiveNoteDao.getNextGRNCodeNumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                goodReceiveNote.setGrn_code("G0002");
            } else {
                goodReceiveNote.setGrn_code(nextNumber);
            }

            // set initial paid amount to a 0
            goodReceiveNote.setPaid_amount(BigDecimal.ZERO);

            // assosiastion table eke thiyena porder eka block krnw.eka nathuwa submit krnna
            // ba.eka nisa list eka aragena 1 by 1 grn eka set krnwa.
            for (GrnItemList gil : goodReceiveNote.getGrnHasItemList()) {// getGRnHasItemList
                                                                         // list eka illa gnnwa eke
                                                                         // thiyenwa
                                                                         // grnrHasItem
                gil.setGrn_id(goodReceiveNote);// drn id ekata purchaseOrder set krnw
            }

            goodReceiveNoteDao.save(goodReceiveNote);

            for (GrnItemList ghi : goodReceiveNote.getGrnHasItemList()) {
                // new inventory record ekk add krnw
                Inventory newInventory = new Inventory();
                newInventory.setTotal_qty(ghi.getReceivedQuantity());// set total qty
                newInventory.setAvailable_qty(ghi.getReceivedQuantity());// set available qty
                newInventory.setItem_id(ghi.getItem_id());// set item
                newInventory.setSales_price(ghi.getSales_price());// set sales price

                // save inventory record
                inventoryDao.save(newInventory);
            }
            // grn eka complete nm porder eke complete kiyla set krnw
            PurchaseOrder porderOb = purchaseOrderDao.getReferenceById(goodReceiveNote.getPurchaseOrder_id().getId());
            porderOb.setPurchaseorder_status_id(purchaseOrderStatusDao.getReferenceById(2));
            purchaseOrderDao.save(porderOb);
            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

    @GetMapping(value = "/grn/listBySupplier/{supplierid}", produces = "application/json")
    public List<GoodReceiveNote> getAllDataBySupplier(@PathVariable("supplierid") Integer supplierid) {
        return goodReceiveNoteDao.getBySupplier(supplierid);
    }

}

// // item eka already thiyenwnm eka update krla nttn aluth ekk add krnw
// for (GrnItemList ghi : goodReceiveNote.getGrnHasItemList()) {
// // get item
// Item item = ghi.getItem_id();
// // item eka thiyenwda blnwa inventory eke
// Inventory existingInventory = inventoryDao.getByItemId(item);

// if (existingInventory != null) {// inventory eke item eka thiyenwnm ea item
// eke
// existingInventory // available qty ekta grn eke received qty eka add krnw
// .setAvailable_qty(existingInventory.getAvailable_qty() +
// ghi.getReceivedQuantity());
// existingInventory.setSales_price(ghi.getSales_price());// sales price eka
// update krnw
// inventoryDao.save(existingInventory);
// } else {// inventory eke item eka nttm
// // new inventory record ekk add krnw
// Inventory newInventory = new Inventory();
// newInventory.setTotal_qty(ghi.getTotalQuantity());// set total qty
// newInventory.setAvailable_qty(ghi.getReceivedQuantity());// set available qty
// newInventory.setItem_id(ghi.getItem_id());// set item
// newInventory.setSales_price(ghi.getSales_price());// set sales price

// // save inventory record
// inventoryDao.save(newInventory);
// }

// }
