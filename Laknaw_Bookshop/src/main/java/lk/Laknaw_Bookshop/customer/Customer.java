package lk.Laknaw_Bookshop.customer;

import java.math.BigDecimal;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "cust_number")
    @NotNull
    private String customerNumber;

    @Column(name = "customer_name")
    @NotNull
    private String customerName;

    @Column(name = "email")
    private String email;

    @Column(name = "contact")
    @NotNull
    private String contact;

    @Column(name = "loyalty_points")
    private BigDecimal loyalty_points;

    @Column(name = "privious_loyaltypoints")
    private BigDecimal privious_loyaltypoints;

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

    @ManyToOne // relationship format
    @JoinColumn(name = "customer_status_id", referencedColumnName = "id") // join column
    private CustomerStatus customerstatus_id;
}
