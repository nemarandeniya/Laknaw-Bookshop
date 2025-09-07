package lk.Laknaw_Bookshop.Invoice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentTypeController {

    @Autowired
    private PaymentTypeDao paymenttypedao;

    @GetMapping(value = "/paymenttype/alldata", produces = "application/json")
    public List<PaymentType> allPaymentTypeList() {
        return paymenttypedao.findAll();
    }
}
