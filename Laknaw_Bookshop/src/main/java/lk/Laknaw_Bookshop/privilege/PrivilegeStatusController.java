package lk.Laknaw_Bookshop.privilege;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PrivilegeStatusController {
    @Autowired
    private PrivilegeStatusDao privilegestatusdao;

    @GetMapping(value = "/privilegestatus/alldata", produces = "application/json")
    public List<PrivilegeStatus> getAllData() {
        return privilegestatusdao.findAll();
    }
}
