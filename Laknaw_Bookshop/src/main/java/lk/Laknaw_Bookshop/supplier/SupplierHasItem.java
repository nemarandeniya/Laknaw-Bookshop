package lk.Laknaw_Bookshop.supplier;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.Laknaw_Bookshop.item.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_has_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierHasItem {
    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;

}
