package lk.Laknaw_Bookshop.customer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerStatusController {

    @Autowired
    private CustomerStatusDao customerstatusdao;

    @GetMapping(value = "/customerstatus/alldata", produces = "application/json")
    public List<CustomerStatus> allCustomerStatusList() {
        return customerstatusdao.findAll();
    }
}
