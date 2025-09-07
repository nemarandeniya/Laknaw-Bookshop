package lk.Laknaw_Bookshop.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class ModuleController {

    @Autowired
    private ModuleDao dao;

    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<Module> allModuleList() {
        return dao.findAll();
    }

    @GetMapping("/module/listByLoggedUser")
    public String[] getMethodName() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return dao.getModuleByLogedUser(auth.getName());
    }
}
