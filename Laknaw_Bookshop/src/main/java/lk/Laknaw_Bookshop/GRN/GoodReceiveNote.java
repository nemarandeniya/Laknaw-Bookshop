package lk.Laknaw_Bookshop.GRN;

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
import lk.Laknaw_Bookshop.purchaseorder.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grn")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodReceiveNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "grn_code")
    @NotNull
    private String grn_code;

    @Column(name = "received_date")
    @NotNull
    public LocalDate received_date;

    @Column(name = "total_amount")
    @NotNull
    private BigDecimal total_amount;

    @Column(name = "net_amount")
    @NotNull
    private BigDecimal net_amount;

    @Column(name = "paid_amount")
    @NotNull
    private BigDecimal paid_amount;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "supplier_invoice_no")
    @NotNull
    private String supplierInvoice_no;

    @Column(name = "note")
    private String note;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @ManyToOne
    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id")
    private GrnStatus grnstatus_id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchaseOrder_id;

    @OneToMany(mappedBy = "grn_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrnItemList> grnHasItemList;
}
