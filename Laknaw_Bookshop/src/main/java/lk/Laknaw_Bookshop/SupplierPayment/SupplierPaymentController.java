package lk.Laknaw_Bookshop.SupplierPayment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.GRN.GoodReceiveNote;
import lk.Laknaw_Bookshop.GRN.GoodReceiveNoteDao;
import lk.Laknaw_Bookshop.GRN.GrnItemList;
import lk.Laknaw_Bookshop.GRN.GrnStatus;
import lk.Laknaw_Bookshop.GRN.GrnStatusDao;
import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class SupplierPaymentController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GoodReceiveNoteDao goodReceiveNoteDao;

    @Autowired
    private GrnStatusDao grnStatusDao;

    @RequestMapping(value = "/supplierpayment")
    public ModelAndView itemUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView supPaymentView = new ModelAndView();
        supPaymentView.addObject("logusername", auth.getName());
        supPaymentView.addObject("title", "Item Management");
        supPaymentView.setViewName("supplierPayment.html");
        return supPaymentView;
    }

    @GetMapping(value = "/supplierpayment/alldata", produces = "application/json")
    public List<SupplierPayment> allSupplierPaymentData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier_Payment");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return supplierPaymentDao.findAll();
    }

    @PostMapping(value = "/supplierpayment")
    public String saveSupPayment(@RequestBody SupplierPayment supplierPayment) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier_Payment");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set added date time
            supplierPayment.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            supplierPayment.setAddeduser_id(loggeduser.getId());

            // set next grn code number
            String nextNumber = supplierPaymentDao.getNextBillumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                supplierPayment.setBillNo("B0002");
            } else {
                supplierPayment.setBillNo(nextNumber);
            }

            supplierPaymentDao.save(supplierPayment);

            // set new paid amount
            GoodReceiveNote grnOB = goodReceiveNoteDao
                    .getReferenceById(supplierPayment.getGrn_id().getId());

            BigDecimal getPriviousPaidAmount = grnOB.getPaid_amount();

            BigDecimal getpaymentAmount = supplierPayment.getPaymentAmount();
            BigDecimal newPaidAmount = getPriviousPaidAmount.add(getpaymentAmount);
            grnOB.setPaid_amount(newPaidAmount);

            // set grn status based on paid amount
            BigDecimal paidAmount = grnOB.getPaid_amount();
            BigDecimal netAmount = grnOB.getNet_amount();

            if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {// paid amount = 0
                GrnStatus receivedStatus = grnStatusDao.getReferenceById(1);
                grnOB.setGrnstatus_id(receivedStatus);
            }
            if (paidAmount.compareTo(netAmount) >= 0) {// paid amount eka totla amount eka samanai or ovepaid krla
                GrnStatus completedStatus = grnStatusDao.getReferenceById(3); // (paidamount>=totalamount)
                grnOB.setGrnstatus_id(completedStatus);
            } else {
                GrnStatus partiallyPayStatus = grnStatusDao.getReferenceById(2); // (paidamount <totalamount)
                grnOB.setGrnstatus_id(partiallyPayStatus); // partially payment
            }

            for (GrnItemList gil : grnOB.getGrnHasItemList()) {// getGRnHasItemList
                                                               // list eka illa gnnwa eke
                                                               // thiyenwa
                                                               // grnrHasItem
                gil.setGrn_id(grnOB);// drn id ekata purchaseOrder set krnw
            }

            goodReceiveNoteDao.save(grnOB);

            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

}
