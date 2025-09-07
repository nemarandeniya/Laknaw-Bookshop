package lk.Laknaw_Bookshop.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SupplierstatusController {

    @Autowired
    private SupplierStatusDao supplierstatusdao;

    @GetMapping(value = "/supplierstatus/alldata", produces = "application/json")
    public List<Supplierstatus> getAllData() {
        return supplierstatusdao.findAll();
    }
}
