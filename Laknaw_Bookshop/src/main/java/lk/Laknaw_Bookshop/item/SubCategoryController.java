package lk.Laknaw_Bookshop.item;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubCategoryController {

    @Autowired
    private SubCategoryDao subcategorydao;

    @GetMapping(value = "/subcategory/alldata", produces = "application/json")
    public List<SubCategory> allSubCategoryList() {
        return subcategorydao.findAll();
    }

    // define mapping for get subcategory by given category
    // id[/subcategory/listbycategory?categoryid=]
    // query param
    @GetMapping(value = "/subcategory/listbycategory", params = { "categoryid" }, produces = "application/json")
    public List<SubCategory> getAllDataByCategory(@RequestParam("categoryid") Integer categoryid) {
        return subcategorydao.getByCategory(categoryid);
    }
}
