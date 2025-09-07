package lk.Laknaw_Bookshop.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class RoleController {
    @Autowired
    private RoleDao dao;

    @GetMapping(value = "/role/listwithoutadmin", produces = "application/json")
    public List<Role> getRolesWithoutAdmin() {
        return dao.getRolesWithoutAdmin();
    }
}
