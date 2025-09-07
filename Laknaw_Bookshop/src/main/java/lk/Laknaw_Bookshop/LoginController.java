package lk.Laknaw_Bookshop;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.employee.EmployeeDao;
import lk.Laknaw_Bookshop.privilege.Role;
import lk.Laknaw_Bookshop.privilege.RoleDao;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class LoginController {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserDao userdao;

    @Autowired
    private EmployeeDao empdao;

    @Autowired
    private RoleDao roledao;

    @RequestMapping(value = "/login")
    public ModelAndView loginUI() {
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");
        return loginView;
    }

    // @PostMapping(value = "/login/getOtp")
    // public String getOTP(@RequestBody ForgetPassword forgetPassword) {
    // User extUserEmail = userdao.GetByEmail(forgetPassword.getEmail());
    // if (extUserEmail == null) {
    // return "This Email not exists!";
    // } else {
    // try {
    // // generate 6 digit otp between 0 to 999999
    // // new Random().nextInt(999999)--> between 0 to 999999
    // // %06d --> 6 digit issrahin 0 ekka
    // // (issrhin 0 enna onenttn String.format() onena
    // // --> 100000+new Random().nextInt(999999))
    // String generateOTP = String.format("%06d", new Random().nextInt(999999));
    // extUserEmail.setOtp(generateOTP);
    // userdao.save(extUserEmail);

    // System.out.println(extUserEmail.getOtp());
    // return "OK";
    // } catch (Exception e) {
    // return "Something wrong : " + e.getMessage();
    // }
    // }
    // }

    @RequestMapping(value = "/errorpage")
    public ModelAndView errorpageUI() {
        ModelAndView errorpageView = new ModelAndView();
        errorpageView.setViewName("error.html");
        return errorpageView;
    }

    @RequestMapping(value = "/dashboard")
    public ModelAndView dashboardUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userdao.getByUsername(auth.getName());

        ModelAndView dashboardView = new ModelAndView();
        // dashboardView.addObject("loggedUserRole",
        // loggedUser.getRoles().iterator().next());
        // dashboardView.addObject("loguserimage", loggedUser.getUserphoto());
        dashboardView.addObject("logusername", auth.getName());
        dashboardView.addObject("loguserphoto", loggedUser.getUser_photo());
        dashboardView.addObject("title", "Dashboard");
        dashboardView.setViewName("dashboard.html");
        return dashboardView;
    }

    @GetMapping(value = "/createadmin")
    public String generateAdmin() {

        User extUser = userdao.getByUsername("Admin");
        if (extUser == null) {

            User adminUser = new User();

            adminUser.setUsername("Admin");
            adminUser.setPassword(bCryptPasswordEncoder.encode("1234"));
            adminUser.setEmail("admin@gmail.com");
            adminUser.setAdded_dateTime(LocalDateTime.now());
            adminUser.setStatus(true);
            adminUser.setEmployee_id(empdao.getReferenceById(2));

            Set<Role> userRoles = new HashSet<>();
            userRoles.add(roledao.getReferenceById(4));
            adminUser.setRoles(userRoles);

            userdao.save(adminUser);
        }
        return "<script>window.location.replace('/login');</script>";
    }

    @RequestMapping(value = "/changeuserprofile")
    public ModelAndView userprofilepageUI() {
        ModelAndView userprofilepageView = new ModelAndView();
        userprofilepageView.setViewName("changeuserprofile.html");
        return userprofilepageView;
    }

    @RequestMapping(value = "/loggeduserdetail")
    public ChangeUser getLoggeduserDetail() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userdao.getByUsername(auth.getName());

        ChangeUser changeUser = new ChangeUser();
        changeUser.setUsername(loggedUser.getUsername());
        changeUser.setOldusername(loggedUser.getUsername());
        changeUser.setEmail(loggedUser.getEmail());
        changeUser.setUserphoto(loggedUser.getUser_photo());
        return changeUser;
    }

    @PostMapping(value = "/changeuserdetails/insert")
    public String insertUserDetails(@RequestBody ChangeUser changeUser) {

        // check if user exists
        User extUser = userdao.getByUsername(changeUser.getOldusername());
        if (extUser == null) {
            return "save not complete : this User not exists..!";
        }

        // check duplicate
        // check email duplicate
        // User extUserByEmail = userdao.GetByEmail(changeUser.getEmail());
        // if (extUserByEmail != null) {
        // return "Save not complete : this email already exists..!";
        // }
        // check username duplicate
        User extUserByUsername = userdao.getByUsername(changeUser.getUsername());
        if (extUserByUsername != null && extUser.getId() != extUserByUsername.getId()) {
            return "save not complete : this User already exists..!";
        }

        try {
            // password ekk thiyenwnm
            if (changeUser.getOldpassword() != null) {

                // db eke thiyen pw ekai changeuser eke thiyena pw ekai samanada blnw
                if (bCryptPasswordEncoder.matches(changeUser.getOldpassword(), extUser.getPassword())) {
                    // changes welada blnw
                    if (!bCryptPasswordEncoder.matches(changeUser.getNewpassword(), extUser.getPassword())) {
                        extUser.setPassword(bCryptPasswordEncoder.encode(changeUser.getNewpassword()));
                    } else {
                        return "Password didn't change";
                    }
                } else {
                    return "Change not Complete: User old Password doesn't match";
                }
            }

            extUser.setUsername(changeUser.getUsername());
            extUser.setEmail(changeUser.getEmail());
            extUser.setUser_photo(changeUser.getUserphoto());
            userdao.save(extUser);

            return "OK";
        } catch (Exception e) {
            return "Change not Complete : " + e.getMessage();
        }
    }

}
