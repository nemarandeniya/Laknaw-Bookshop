package lk.Laknaw_Bookshop.Invoice;

import java.math.BigDecimal;
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
import lk.Laknaw_Bookshop.customer.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "invoice_number")
    @NotNull
    private String invoiceNumber;

    @Column(name = "invoice_date")
    @NotNull
    public LocalDateTime invoiceDate;

    @Column(name = "total_amount")
    @NotNull
    private BigDecimal total_amount;

    @Column(name = "net_amount")
    @NotNull
    private BigDecimal net_amount;

    @Column(name = "loyalty_points")
    private BigDecimal loyalty_points;

    @Column(name = "paid_amount")
    @NotNull
    private BigDecimal paid_amount;

    @Column(name = "balance")
    @NotNull
    private BigDecimal balance;

    @Column(name = "transaction_no")
    private String transactionNo;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @ManyToOne
    @JoinColumn(name = "payment_type_id", referencedColumnName = "id")
    private PaymentType paymentType_id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "cardtype_id", referencedColumnName = "id")
    private CardType cardtype_id;

    @ManyToOne
    @JoinColumn(name = "seasonaldiscount_id", referencedColumnName = "id")
    private SeasonalDiscount seasonaldiscount_id;

    @OneToMany(mappedBy = "invoice_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceHasItem> invoiceHasItemList;

}
