package lk.Laknaw_Bookshop.pricelist;

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
import lk.Laknaw_Bookshop.requestprice.RequestPrice;
import lk.Laknaw_Bookshop.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pricelist")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "pricelist_no")
    @NotNull
    private String pricelist_no;

    @Column(name = "received_date")
    @NotNull
    private LocalDate received_date;

    @Column(name = "deadline_date")
    @NotNull
    private LocalDate deadline_date;

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
    @JoinColumn(name = "request_price_id", referencedColumnName = "id")
    private RequestPrice request_price_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "pricelist_status_id", referencedColumnName = "id")
    private PriceListStatus pricelist_status_id;

    @OneToMany(mappedBy = "pricelist_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPriceList> pricelistitems;
}
