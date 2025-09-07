package lk.Laknaw_Bookshop.supplier;

import java.time.LocalDateTime;
import java.util.Set;

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
import lk.Laknaw_Bookshop.item.Brand;
import lk.Laknaw_Bookshop.item.Category;
import lk.Laknaw_Bookshop.item.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "regno", unique = true)
    @NotNull
    private String regno;

    @Column(name = "suppliername")
    @NotNull
    private String suppliername;

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

    @Column(name = "contact")
    @NotNull
    private String contact;

    @Column(name = "agentname")
    @NotNull
    private String agentname;

    @Column(name = "branch")
    @NotNull
    private String branch;

    @Column(name = "accountname")
    @NotNull
    private String accountname;

    @Column(name = "accountno")
    @NotNull
    private String accountno;

    @Column(name = "address")
    @NotNull
    private String address;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "agentemail")
    @NotNull
    private String agentemail;

    @Column(name = "agentcontact")
    @NotNull
    private String agentcontact;

    @ManyToOne
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    private Bank bank_id;

    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id")
    private Supplierstatus supplierstatus_id;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand_id;

    @ManyToMany
    @JoinTable(name = "supplier_has_item", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private Set<Item> supplyItems;

}
