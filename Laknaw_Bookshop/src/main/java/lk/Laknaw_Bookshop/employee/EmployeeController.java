package lk.Laknaw_Bookshop.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

import java.time.LocalDateTime;
import java.util.*;

@RestController
public class EmployeeController {

    @Autowired // userDao instance ekk hdnwa. mokda meya interface ekk.interface wlin data gnna
    private UserDao userDao;// ba.eya wenma controller ekk hadagena method define krgena apita meka hdla
                            // denwa.ethkota apita me instance use krla ea method cll krnna plwn.mkda
                            // interface wla thiyena abstract method apita direct cll krnn ba define nokra
    @Autowired
    private EmployeeDao dao;

    @Autowired
    private EmployeeStatusDao empStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/employee")
    public ModelAndView empUI() {

        // get loged user authentiion object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // User loggedUser = userDao.getByUsername(auth.getName());

        ModelAndView empView = new ModelAndView();
        // empView.addObject("loggedUserRole", loggedUser.getRoles().iterator().next());
        // empView.addObject("loguserimage", loggedUser.getUserphoto());
        empView.addObject("logusername", auth.getName());
        // empView.addObject("logEmployeeName", dao.getByCallingName(auth.getName()));
        empView.addObject("title", "Employee Management");
        empView.setViewName("employee.html");
        return empView;
    }

    @GetMapping(value = "/employee/alldata", produces = "application/json")
    public List<Employee> allEmployeeData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Employee");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return dao.findAll();
    }

    // post mapping
    // define post mapping for save employee record
    @PostMapping(value = "/employee")
    // json ob eka java ob ekkta convert krnwa
    public String addEmployee(@RequestBody Employee employee) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Employee");

        if (!logUserPrivi.get("insert")) {
            return "Insert Not Complete : You haven't Privilege";
        }

        // check duplicate nic
        Employee extEmployeeByNic = dao.getByNic(employee.getNic());
        if (extEmployeeByNic != null) {
            return "Save not Completed : Given NIC Already exists..!";
        }

        // check duplicate email
        Employee extEmployeeByEmail = dao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null) {
            return "Save not Completed : Given Email Already exists..!";
        }

        try {
            // set added date time
            employee.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            employee.setAddeduser_id(loggeduser.getId());

            // set auto generated value
            String nextNumber = dao.getNextEmployeeNumber();
            if (nextNumber == null) {
                employee.setEmpno("03");
            } else {
                employee.setEmpno(nextNumber);
            }
            System.out.println(employee);
            dao.save(employee);

            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/employee")
    public String deleteEmployee(@RequestBody Employee employee) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Employee");
        if (!logUserPrivi.get("delete")) {
            return "Delete Not Complete : You haven't Privilege";
        }

        Employee extEmployee = dao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Delete not completed : Employee not exists";
        }

        try {
            // set delete date time
            employee.setDeletedatetime(LocalDateTime.now());

            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            employee.setDeleteuser_id(loggeduser.getId());

            // soft delete
            EmployeeStatus deleteStatus = empStatusDao.getReferenceById(3);
            extEmployee.setEmployeestatus_id(deleteStatus);
            dao.save(extEmployee);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/employee")
    public String updateEmployee(@RequestBody Employee employee) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Employee");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // duplicate and existing
        // get existing employee object getReference by id function-->
        Employee extEmployee = dao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Update not completed: employee not available..!";
        }
        // get exist employee object by using frontend employee object nic value and
        // assign in to ectEmployyeByNic variable
        Employee extEmployeeByNic = dao.getByNic(employee.getNic());
        if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
            return "Update Not Completed :change " + employee.getNic();
        }

        // get exist employee object by using frontend employee object email value and
        // assign in to ectEmployyeByEmail variable
        Employee extEmployeeByEmail = dao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
            return "Update Not Completed :change " + employee.getEmail();
        }

        try {

            // set update date time
            employee.setUpdatedatetime(LocalDateTime.now());

            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            employee.setUpdateuser_id(loggeduser.getId());

            dao.save(employee);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }

    }

    @GetMapping(value = "/employee/listwithoutuseraccount", produces = "application/json")
    public List<Employee> getEmployeeListWithoutUserAccount() {
        return dao.getListByWithOutUserAccount();
    }

    @GetMapping(value = "/employee/employeeCount", produces = "application/json")
    public Long getEmployeeCount() {
        return dao.currentEmployeeCount();
    }
}
