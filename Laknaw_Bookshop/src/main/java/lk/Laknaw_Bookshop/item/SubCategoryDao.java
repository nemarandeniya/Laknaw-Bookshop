package lk.Laknaw_Bookshop.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SubCategoryDao extends JpaRepository<SubCategory, Integer> {

    // get sub category by given category id
    @Query("select subc from SubCategory subc where subc.category_id.id=?1")
    List<SubCategory> getByCategory(Integer categoryid);

}
