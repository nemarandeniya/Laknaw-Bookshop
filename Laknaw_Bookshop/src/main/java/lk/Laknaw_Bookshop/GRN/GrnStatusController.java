package lk.Laknaw_Bookshop.GRN;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class GrnStatusController {

    @Autowired
    private GrnStatusDao grnstatusdao;

    @GetMapping(value = "/grnstatus/alldata", produces = "application/json")
    public List<GrnStatus> allGrnStatusList() {
        return grnstatusdao.findAll();
    }
}
