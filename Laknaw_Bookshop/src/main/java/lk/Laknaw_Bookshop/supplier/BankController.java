package lk.Laknaw_Bookshop.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BankController {

    @Autowired
    private BankDao bankDao;

    @GetMapping(value = "/banks/alldata", produces = "application/json")
    public List<Bank> getAllData() {
        return bankDao.findAll();
    }
}
