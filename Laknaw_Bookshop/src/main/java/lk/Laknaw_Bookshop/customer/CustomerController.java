package lk.Laknaw_Bookshop.customer;

import java.math.BigDecimal;
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
public class CustomerController {

    @Autowired // userDao instance ekk hdnwa. mokda meya interface ekk.interface wlin data gnna
    private UserDao userDao;// ba.eya wenma controller ekk hadagena method define krgena apita meka hdla
                            // denwa.ethkota apita me instance use krla ea method cll krnna plwn.mkda
                            // interface wla thiyena abstract method apita direct cll krnn ba define nokra

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private CustomerDao customerdao;

    @Autowired
    private CustomerStatusDao customerstatusdao;

    @RequestMapping(value = "/customer")
    public ModelAndView customerUI() {

        // get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView customerView = new ModelAndView();
        customerView.addObject("logusername", auth.getName());
        customerView.addObject("title", "Customer Management");
        customerView.setViewName("customer.html");
        return customerView;
    }

    @GetMapping(value = "/customer/alldata", produces = "application/json")
    public List<Customer> allCustomerData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Customer");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return customerdao.findAll();
    }

    // post mapping
    // define post mapping for save employee record
    @PostMapping(value = "/customer")
    // json ob eka java ob ekkta convert krnwa
    public String addCustomer(@RequestBody Customer customer) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Customer");

        if (!logUserPrivi.get("insert")) {
            return "Insert Not Complete : You haven't Privilege";
        }

        // check duplicate email
        // customer dao eken id ekata adala email eka genna ganna blnw.awoth save krnna
        // denne na
        Customer extCustomerByEmail = customerdao.getByEmail(customer.getEmail());
        if (extCustomerByEmail != null) {
            return "Save not Completed : Given Email Already exists..!";
        }

        try {
            // set added date time
            customer.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            customer.setAddeduser_id(loggeduser.getId());

            // set auto generated value
            String nextNumber = customerdao.getNextCustomerNumber();
            if (nextNumber == null) {
                customer.setCustomerNumber("E0003");
            } else {
                customer.setCustomerNumber(nextNumber);
            }
            customer.setLoyalty_points(BigDecimal.ZERO);

            System.out.println(customer);
            customerdao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/customer")
    public String deleteEmployee(@RequestBody Customer customer) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Customer");
        if (!logUserPrivi.get("delete")) {
            return "Delete Not Complete : You haven't Privilege";
        }

        Customer extCustomer = customerdao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Delete not completed : Employee not exists";
        }

        try {
            // set delete date time
            customer.setDeletedatetime(LocalDateTime.now());

            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            customer.setDeleteuser_id(loggeduser.getId());

            // soft delete
            CustomerStatus deleteStatus = customerstatusdao.getReferenceById(2);
            extCustomer.setCustomerstatus_id(deleteStatus);
            customerdao.save(extCustomer);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/customer")
    public String updateEmployee(@RequestBody Customer customer) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Customer");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // duplicate and existing
        // get existing customer object getReference by id function-->
        Customer extCustomer = customerdao.getReferenceById(customer.getId());
        if (extCustomer == null) {
            return "Update not completed: customer not available..!";
        }

        // get exist customer object by using frontend customer object email value and
        // assign in to ectcustomerByEmail variable
        // Customer extCustomer = customerdao.getByEmail(customer.getEmail());
        // if (extEmployeeByEmail != null && extEmployeeByEmail.getId() !=
        // customer.getId()) {
        // return "Update Not Completed :change " + customer.getEmail();
        // }

        try {

            // set update date time
            customer.setUpdatedatetime(LocalDateTime.now());

            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            customer.setUpdateuser_id(loggeduser.getId());

            customerdao.save(customer);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }

    }

    @GetMapping(value = "/customer/loyaltiPointById/{customerId}", produces = "application/json")
    public BigDecimal getLoyaltyPointById(@PathVariable("customerId") Integer customerId) {
        return customerdao.getLoyaltypointById(customerId);
    }
}
