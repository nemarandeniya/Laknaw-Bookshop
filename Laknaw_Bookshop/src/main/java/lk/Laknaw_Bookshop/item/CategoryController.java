package lk.Laknaw_Bookshop.item;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoryController {

    @Autowired
    private CategoryDao categorydao;

    @GetMapping(value = "/category/alldata", produces = "application/json")
    public List<Category> allCategoryList() {
        return categorydao.findAll();
    }
}
