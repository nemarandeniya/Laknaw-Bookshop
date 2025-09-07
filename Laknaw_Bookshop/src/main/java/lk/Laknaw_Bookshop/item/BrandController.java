package lk.Laknaw_Bookshop.item;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BrandController {

    @Autowired
    private BrandDao branddao;

    @GetMapping(value = "/brand/alldata", produces = "application/json")
    public List<Brand> allBookBrandList() {
        return branddao.findAll();
    }

    @GetMapping(value = "/brand/listbycategory/{categoryid}", produces = "application/json")
    public List<Brand> getAllDataByCategory(@PathVariable("categoryid") Integer categoryid) {
        return branddao.getByCategory(categoryid);
    }

}
