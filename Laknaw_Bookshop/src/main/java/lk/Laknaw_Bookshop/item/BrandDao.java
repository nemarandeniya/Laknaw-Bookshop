package lk.Laknaw_Bookshop.item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BrandDao extends JpaRepository<Brand, Integer> {

    // define query for get brand by given category
    @Query(value = "select b from Brand b where b.id in(select bhc.brand_id.id from BrandHasCategory bhc where bhc.category_id.id=?1)")
    List<Brand> getByCategory(Integer categoryid);

}
