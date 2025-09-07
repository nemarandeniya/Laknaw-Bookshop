package lk.Laknaw_Bookshop.pricelist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PriceListStatusController {

    @Autowired
    private PriceListStatusDao dao;

    @GetMapping(value = "/pricelistStatus/alldata", produces = "application/json")
    public List<PriceListStatus> getAllDataList() {
        return dao.findAll();
    }
}
