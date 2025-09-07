package lk.Laknaw_Bookshop.user;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.employee.Employee;
import lk.Laknaw_Bookshop.employee.EmployeeDao;
import lk.Laknaw_Bookshop.privilege.PrivilegeController;

import java.time.LocalDateTime;

@RestController
public class UserController {

    @Autowired
    private UserDao dao;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/user/findall", produces = "application/json")
    public List<User> getAllData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return dao.findAll();
    }

    @RequestMapping(value = "/user")
    public ModelAndView userUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView userView = new ModelAndView();
        userView.addObject("logusername", auth.getName());
        userView.addObject("title", "User Management");
        userView.setViewName("user.html");
        return userView;
    }

    @PostMapping(value = "/user")
    public String insertUser(@RequestBody User user) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("insert")) {
            return "Insert Not Complete : You haven't Privilege";
        }
        // check duplicate
        // check email existing
        User extUserByEmail = dao.GetByEmail(user.getEmail());
        if (extUserByEmail != null) {
            return "Save not complete : this email already exists..!";
        }
        // check employee existing
        User extUserByEmployee = dao.getByEmployee(user.getEmployee_id().getId());
        if (extUserByEmployee != null) {
            return "save not complete : this employee already exists..!";
        }
        try {
            user.setAdded_dateTime(LocalDateTime.now());
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

            Employee empOb = employeeDao.getReferenceById(user.getEmployee_id().getId());
            user.setUser_photo(empOb.getEmp_photo());
            dao.save(user);

            return "OK";
        } catch (Exception e) {
            return "Save not complete : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/user")
    public String deleteUser(@RequestBody User user) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (!logUserPrivi.get("delete")) {
            return "Delete Not Complete : You haven't Privilege";
        }

        // existing
        User extUser = dao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Delete not completed : User not exists..!";
        }

        try {
            // hard delete
            // dao.delete(extUser);

            // soft delete
            extUser.setStatus(false);
            extUser.setNote("User account is removed...");
            dao.save(extUser);

            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/user")
    public String updateUser(@RequestBody User user) {

        // existing & duplicate check
        User extUser = dao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Update not complete : User not exists..!";
        }

        User extUserEmail = dao.GetByEmail(user.getEmail());
        if (extUserEmail != null && user.getId() != extUserEmail.getId()) {
            return "Update not completed : User email aiready exists..!";
        }

        User extUsername = dao.getByUsername(user.getUsername());
        if (extUsername != null && user.getId() != extUsername.getId()) {
            return "Update not completed : User email aiready exists..!";

        }

        try {
            dao.save(user);

            return "OK";
        } catch (Exception e) {
            return "Update not completed..!" + e.getMessage();
        }
    }
}
