package lk.Laknaw_Bookshop.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseorderstatusdao;

    @RequestMapping(value = "/purchaseorder")
    public ModelAndView purchaseorderUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView purchaseorderView = new ModelAndView();
        purchaseorderView.addObject("logusername", auth.getName());
        purchaseorderView.addObject("title", "PurchaseOderView Management");
        purchaseorderView.setViewName("purchaseorder.html");
        return purchaseorderView;
    }

    @GetMapping(value = "/purchaseorder/alldata", produces = "application/json")
    public List<PurchaseOrder> allPurchaseOrdertData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Purchase_Order");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return purchaseOrderDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @PostMapping(value = "/purchaseorder")
    public String savePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Purchase_Order");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set added date time
            purchaseOrder.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            purchaseOrder.setAddeduser_id(loggeduser.getId());

            // set next order code number
            String nextNumber = purchaseOrderDao.getNextOrderCodeNumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                purchaseOrder.setOrder_code("p002");
            } else {
                purchaseOrder.setOrder_code(nextNumber);
            }

            // assosiastion table eke thiyena porder eka block krnw.eka nathuwa submit krnna
            // ba.eka nisa list eka aragena 1 by 1 purchase order eka set krnwa.
            for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {// getPurchaseOrderHasItemList
                                                                                           // list eka illa gnnwa eke
                                                                                           // thiyenwa
                                                                                           // PurchaseOrderHasItem
                pohi.setPurchaseOrder_id(purchaseOrder);// purchase order id ekata purchaseOrder set krnw
            }

            purchaseOrderDao.save(purchaseOrder);
            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

    @PutMapping(value = "/purchaseorder")
    public String updatePriceList(@RequestBody PurchaseOrder purchaseOrder) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Purchase_Order");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // check existing
        PurchaseOrder extPurchaseorder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
        if (extPurchaseorder == null) {
            return "Update not completed: Purchase Order not exists..!";
        }
        try {

            // set update date time
            purchaseOrder.setUpdatedatetime(LocalDateTime.now());

            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            purchaseOrder.setUpdateuser_id(loggeduser.getId());

            // update krddi aphu PurchaseOrderHasItem eke item wlta setPurchaseOrder_id eka
            // set krnw
            for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                pohi.setPurchaseOrder_id(purchaseOrder);
            }

            purchaseOrderDao.save(purchaseOrder);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();

        }
    }

    @DeleteMapping(value = "/purchaseorder")
    public String deletePriceList(@RequestBody PurchaseOrder purchaseOrder) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Purchase_Order");
        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : you haven't permission..!";
        }

        // check existence
        PurchaseOrder extPurchaseorder = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
        if (extPurchaseorder == null) {
            return "Delete not complete: You haven't permission..!";
        }
        try {

            // set delete date time
            purchaseOrder.setDeletedatetime(LocalDateTime.now());
            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            purchaseOrder.setDeleteuser_id(loggeduser.getId());

            // soft delete
            PurchaseOrderStatus deleteStatus = purchaseorderstatusdao.getReferenceById(5);
            extPurchaseorder.setPurchaseorder_status_id(deleteStatus);
            purchaseOrderDao.save(extPurchaseorder);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @GetMapping(value = "/purchaseorder/listByOrderCode/{ordercode}", produces = "application/json")
    public BigDecimal getAllByOrderCode(@PathVariable("ordercode") String ordercode) {
        return purchaseOrderDao.getByAmountOrderCode(ordercode);
    }

    @GetMapping(value = "/purchaseorder/listByStatus", produces = "application/json")
    public List<PurchaseOrder> getAllByStatus() {
        return purchaseOrderDao.getByPurchaseOrderStatus();
    }

}
