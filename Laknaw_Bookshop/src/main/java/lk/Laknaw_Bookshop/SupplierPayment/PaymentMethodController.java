package lk.Laknaw_Bookshop.SupplierPayment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentMethodController {

    @Autowired
    private PaymentMethodDao paymentmethoddao;

    @GetMapping(value = "/paymentmethod/alldata", produces = "application/json")
    public List<PaymentMethod> allPaymentMethodList() {
        return paymentmethoddao.findAll();
    }
}
