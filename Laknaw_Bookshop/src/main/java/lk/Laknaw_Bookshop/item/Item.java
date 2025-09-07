package lk.Laknaw_Bookshop.item;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

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
@Table(name = "item")

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(value = Include.NON_NULL) // all data gnnkota null data hide krnw
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "barcode")
    @NotNull
    private String barcode;

    @Column(name = "itemname")
    @NotNull
    private String itemname;

    @Column(name = "description")
    public String description;

    @Column(name = "isbn")
    public String isbn;

    @Column(name = "rop")
    public String rop;

    @Column(name = "roq")
    public String roq;

    @Column(name = "profitrate")
    public Double profitrate;

    @Column(name = "publishdate")
    public String publishdate;

    @Column(name = "publisher")
    public String publisher;

    @Column(name = "addeddate")
    @NotNull
    private LocalDateTime addeddate;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id")
    private ItemStatus itemstatus_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brand brand_id;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category_id;

    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id")
    private SubCategory subcategory_id;

    // cascade--> item module eke save,update,delete dewal klama ewa orderItemList
    // eke ewatth apply wenw
    // orphanRemoval --> orderItemList ob ekk dlete kloth orderItems list eken eka
    // database ekenuth remove wenw
}
