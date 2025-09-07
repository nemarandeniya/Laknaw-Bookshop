package lk.Laknaw_Bookshop.supplier;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
public class SupplierController {

    @Autowired
    private SupplierDao supplierdao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private SupplierStatusDao supplierstatusdao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/supplier")
    public ModelAndView supplierUI() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplierView = new ModelAndView();
        supplierView.addObject("logusername", auth.getName());
        supplierView.addObject("title", "Supplier Management");
        supplierView.setViewName("supplier.html");
        return supplierView;
    }

    @GetMapping(value = "/supplier/alldata", produces = "application/json")
    public List<Supplier> allSupplierData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return supplierdao.findAll();
    }

    @PostMapping(value = "/supplier")
    public String saveSupplier(@RequestBody Supplier supplier) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        // check duplicate
        Supplier extSupplier = supplierdao.getSuppliername(supplier.getSuppliername());
        if (extSupplier != null) {
            return "Save not complete: You haven't permission..!";
        }

        try {
            // set added date time
            supplier.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            supplier.setAddeduser_id(loggeduser.getId());

            // set next reg number
            String nextNumber = supplierdao.getNextNumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                supplier.setRegno("03");
            } else {
                supplier.setRegno(nextNumber);
            }
            System.out.println(supplier);
            supplierdao.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

    @DeleteMapping(value = "/supplier")
    public String deleteSupplier(@RequestBody Supplier supplier) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier");
        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : you haven't permission..!";
        }

        // check existence
        Supplier extSupplier = supplierdao.getReferenceById(supplier.getId());
        if (extSupplier == null) {
            return "Delete not complete: You haven't permission..!";
        }
        try {

            // set delete date time
            supplier.setDeletedatetime(LocalDateTime.now());

            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            supplier.setDeleteuser_id(loggeduser.getId());

            // soft delete
            Supplierstatus deleteStatus = supplierstatusdao.getReferenceById(2);
            extSupplier.setSupplierstatus_id(deleteStatus);
            supplierdao.save(extSupplier);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/supplier")
    public String updateSupplier(@RequestBody Supplier supplier) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Supplier");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // check existing
        Supplier extSupplier = supplierdao.getReferenceById(supplier.getId());
        if (extSupplier == null) {
            return "Update not completed: Supplier not exists..!";
        }
        try {

            // set update date time
            supplier.setUpdatedatetime(LocalDateTime.now());

            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            supplier.setUpdateuser_id(loggeduser.getId());

            supplierdao.save(supplier);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();

        }
    }

    @GetMapping(value = "/supplier/supplierlist", produces = "application/json")
    public List<Supplier> getSupplierName() {
        return supplierdao.getSupplierName();
    }

    @GetMapping(value = "/supplier/listByItem/{itemid}", produces = "application/json")
    public List<Supplier> getAllDataByItem(@PathVariable("itemid") Integer itemid) {
        return supplierdao.getByItem(itemid);
    }

    @GetMapping(value = "/supplier/listBySupplierid/{supplierid}", produces = "application/json")
    public Supplier getAllDataBySupplier(@PathVariable("supplierid") Integer supplierid) {
        return supplierdao.getBySupplierId(supplierid);
    }

    @GetMapping(value = "/supplier/bankBySupplierid/{supplierid}", produces = "application/json")
    public Bank getBankBySupplier(@PathVariable("supplierid") Integer supplierid) {
        return supplierdao.getBySupplier(supplierid);
    }
}
