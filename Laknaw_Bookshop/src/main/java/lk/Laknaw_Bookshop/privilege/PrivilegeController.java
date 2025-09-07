package lk.Laknaw_Bookshop.privilege;

import java.util.List;
import java.time.LocalDateTime;
import java.util.HashMap;

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

import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class PrivilegeController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeDao dao;

    @RequestMapping(value = "/privilege")
    public ModelAndView privilegeUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegView = new ModelAndView();
        privilegView.addObject("logusername", auth.getName());
        privilegView.addObject("title", "Privilege Management");
        privilegView.setViewName("privilege.html");
        return privilegView;
    }

    @GetMapping(value = "/privilege/findall", produces = "application/json")
    public List<Privilege> getAllData() {
        return dao.findAll();
    }

    // post mapping for save privilege record
    @PostMapping(value = "/privilege")
    public String addPrivilege(@RequestBody Privilege privilege) {

        // // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(),
                "Privilege");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set krnwa add krpu date time eka
            privilege.setAddeddatetime(LocalDateTime.now());

            // set krnwa add krpu userwa
            User loggeduser = userDao.getByUsername(auth.getName());
            privilege.setAddeduser_id(loggeduser.getId());
            dao.save(privilege);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/privilege")
    public String deletePrivilege(@RequestBody Privilege privilege) {
        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(),
                "Privilege");
        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : you haven't permission..!";
        }
        // existing
        Privilege exPrivilege = dao.getReferenceById(privilege.getId());
        if (exPrivilege == null) {
            return "Delete Not Success : Privilege not exists..!";
        }

        try {
            exPrivilege.setSelpriv(false);
            exPrivilege.setInsertpriv(false);
            exPrivilege.setUpdpriv(false);
            exPrivilege.setDelpriv(false);

            // set krnwa delete krpu date time eka
            privilege.setDeletedatetime(LocalDateTime.now());

            // set krnwa delete krpu userwa
            User loggeduser = userDao.getByUsername(auth.getName());
            privilege.setDeleteuser_id(loggeduser.getId());
            dao.save(privilege);

            return "OK";
        } catch (Exception e) {
            return " Delete Not Success : " + e.getMessage();
        }
    }

    @PutMapping(value = "privilege")
    public String updatePrivilege(@RequestBody Privilege privilege) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = getPrivilegeByLogedUserModule("privilege");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        try {
            // set krnwa update,add,delete datetimes
            privilege.setAddeddatetime(LocalDateTime.now());
            privilege.setUpdatedatetime(LocalDateTime.now());
            privilege.setDeletedatetime(LocalDateTime.now());

            // set krnwa update krpu userwa
            User loggeduser = userDao.getByUsername(auth.getName());
            privilege.setUpdateuser_id(loggeduser.getId());
            dao.save(privilege);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    // get privilege by loged user module
    @GetMapping(value = "/privilegebylogedusermodule/{modulename}", produces = "application/json")
    public HashMap<String, Boolean> getPrivilegeByLogedUserModule(@PathVariable("modulename") String modulename) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return getPrivilegeByUserModule(auth.getName(), modulename);
    }

    public HashMap<String, Boolean> getPrivilegeByUserModule(String username, String modulename) {
        HashMap<String, Boolean> userPrivilege = new HashMap<String, Boolean>();

        if (username.equals("Admin")) {
            userPrivilege.put("select", true);
            userPrivilege.put("insert", true);
            userPrivilege.put("update", true);
            userPrivilege.put("delete", true);
            System.out.println(userPrivilege);
        } else {

            System.out.println(userPrivilege);
            String userprivi = dao.getPrivilegeByUserModule(username, modulename);
            System.out.println(userprivi);

            String[] userPriviList = userprivi.split(",");
            userPrivilege.put("select", userPriviList[0].equals("1"));
            userPrivilege.put("insert", userPriviList[1].equals("1"));
            userPrivilege.put("update", userPriviList[2].equals("1"));
            userPrivilege.put("delete", userPriviList[3].equals("1"));
            System.out.println(userPrivilege);
        }
        return userPrivilege;
    }

    // @GetMapping(value = "/privilegeByRole", produces = "application/json")
    // public List<Privilege> getAllDataByRole() {
    // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // return dao.getAllDataByRole(auth.getName());
    // }
}
