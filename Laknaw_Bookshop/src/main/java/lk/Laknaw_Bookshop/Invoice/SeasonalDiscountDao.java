package lk.Laknaw_Bookshop.Invoice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SeasonalDiscountDao extends JpaRepository<SeasonalDiscount, Integer> {

    @Query(value = "SELECT * FROM laknaw_bookshop.seasonaldiscount as sd join laknaw_bookshop.seasonaldiscount_has_category as sdc on sd.id= sdc.seasonaldiscount_id where sdc.category_id=?1", nativeQuery = true)
    List<SeasonalDiscount> getDiscountBycategoryid(Integer categoryid);

}
