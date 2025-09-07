package lk.Laknaw_Bookshop.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class DesignationController {

    @Autowired
    private DesignationDao dao;

    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> allDesignationList() {
        return dao.findAll();
    }
}
