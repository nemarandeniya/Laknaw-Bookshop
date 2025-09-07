package lk.Laknaw_Bookshop.Invoice;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.Laknaw_Bookshop.item.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seasonaldiscount_has_category")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SesaonalDiscountHasCategory {

    @Id
    @ManyToOne
    @JoinColumn(name = "seasonaldiscount_id", referencedColumnName = "id")
    private SeasonalDiscount seasonaldiscount_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category_id;
}
