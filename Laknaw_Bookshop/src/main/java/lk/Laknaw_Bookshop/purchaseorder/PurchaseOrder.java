package lk.Laknaw_Bookshop.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.Laknaw_Bookshop.pricelist.PriceList;
import lk.Laknaw_Bookshop.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "purchase_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "order_code")
    @NotNull
    private String order_code;

    @Column(name = "required_date")
    @NotNull
    public LocalDate required_date;

    @Column(name = "total_amount")
    @NotNull
    private BigDecimal total_amount;

    @Column(name = "note")
    private String note;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_status_id", referencedColumnName = "id")
    private PurchaseOrderStatus purchaseorder_status_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "pricelist_id", referencedColumnName = "id")
    private PriceList pricelist_id;

    // @ManyToOne
    // @JoinColumn(name = "category_id", referencedColumnName = "id")
    // private Category category_id;

    // @ManyToOne
    // @JoinColumn(name = "brand_id", referencedColumnName = "id")
    // private Brand brand_id;

    @OneToMany(mappedBy = "purchaseOrder_id", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference(value = "purchase-order-has-item")
    private List<PurchaseOrderHasItem> purchaseOrderHasItemList;

    // mappedBy --> JPA ta kiynwa child entity eke mona property ekta me
    // relationship eka ayithida kiyla
    // orphanRemoval -->inner side eke ewa remove krnw
}
