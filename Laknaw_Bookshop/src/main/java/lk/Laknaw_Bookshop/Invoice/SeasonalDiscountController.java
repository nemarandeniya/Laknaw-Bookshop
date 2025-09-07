package lk.Laknaw_Bookshop.Invoice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SeasonalDiscountController {

    @Autowired
    private SeasonalDiscountDao seasonalDiscountDao;

    @GetMapping(value = "/seasonaldiscount/alldata", produces = "application/json")
    public List<SeasonalDiscount> allSeasonalDiscountList() {
        return seasonalDiscountDao.findAll();
    }

    @GetMapping(value = "/seasonaldiscount/getdiscount/{categoryid}", produces = "application/json")
    public List<SeasonalDiscount> getDiscountByCategory(@PathVariable("categoryid") Integer categoryid) {
        return seasonalDiscountDao.getDiscountBycategoryid(categoryid);
    }
}
