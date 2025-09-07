package lk.Laknaw_Bookshop.SupplierPayment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.Laknaw_Bookshop.GRN.GoodReceiveNote;
import lk.Laknaw_Bookshop.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "bill_no", unique = true)
    @NotNull
    private String billNo;

    @Column(name = "total_amount")
    @NotNull
    private BigDecimal totalAmount;

    @Column(name = "payment_amount")
    @NotNull
    private BigDecimal paymentAmount;

    @Column(name = "due_amount")
    @NotNull
    private BigDecimal dueAmount;

    @Column(name = "new_due_amount")
    @NotNull
    private BigDecimal newDueAmount;

    @Column(name = "check_no")
    private String checkNo;

    @Column(name = "transfer_no")
    private String transferNo;

    @Column(name = "transfer_date")
    public LocalDate transferDate;

    @Column(name = "bankname")
    private String bankname;

    @Column(name = "branch")
    private String branch;

    @Column(name = "accountname")
    private String accountname;

    @Column(name = "accountno")
    private String accountno;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "payment_date")
    @NotNull
    public LocalDate paymentDate;

    @ManyToOne
    @JoinColumn(name = "payment_method_id", referencedColumnName = "id")
    private PaymentMethod paymentMethod_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier Supplier_id;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private GoodReceiveNote grn_id;
}
