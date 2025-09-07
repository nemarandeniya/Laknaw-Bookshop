package lk.Laknaw_Bookshop.Invoice;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.Laknaw_Bookshop.inventory.Inventory;
import lk.Laknaw_Bookshop.item.Category;
import lk.Laknaw_Bookshop.item.Item;
import lk.Laknaw_Bookshop.item.SubCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "line_price")
    @NotNull
    private BigDecimal line_price;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category_id;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id")
    private SubCategory subcategory_id;

    @ManyToOne
    @JoinColumn(name = "inventory_id", referencedColumnName = "id")
    private Inventory inventory_id;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;

    @ManyToOne
    @JsonIgnore // me data property eka read krna eka block krnw
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    private Invoice invoice_id;
}
