package lk.Laknaw_Bookshop.requestprice;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.Laknaw_Bookshop.item.Item;
import lk.Laknaw_Bookshop.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "request_price")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "request_no")
    @NotNull
    private String reqno;

    @Column(name = "required_date")
    @NotNull
    public LocalDate required_date;

    @Column(name = "note")
    public String note;

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
    @JoinColumn(name = "request_price_status_id", referencedColumnName = "id")
    private RequestPriceStatus request_price_status_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    // @ManyToOne
    // @JoinColumn(name = "category_id", referencedColumnName = "id")
    // private Category category_id;

    // @ManyToOne
    // @JoinColumn(name = "brand_id", referencedColumnName = "id")
    // private Brand brand_id;

    @ManyToMany
    @JoinTable(name = "request_price_has_item", joinColumns = @JoinColumn(name = "request_price_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private List<Item> items;

}
