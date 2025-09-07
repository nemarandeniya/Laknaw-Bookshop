package lk.Laknaw_Bookshop.GRN;

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
import lk.Laknaw_Bookshop.item.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grn_item_list")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnItemList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "unit_price")
    @NotNull
    private BigDecimal unit_price;

    @Column(name = "received_qty")
    @NotNull
    private Integer receivedQuantity;

    @Column(name = "total_qty")
    @NotNull
    private Integer totalQuantity;

    @Column(name = "line_price")
    @NotNull
    private BigDecimal line_price;

    @Column(name = "sales_price")
    @NotNull
    private BigDecimal sales_price;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;

    // @JsonBackReference(value = "grn-has-item") // ignore this property to break
    // the recursion
    @ManyToOne
    @JsonIgnore // me data property eka read krna eka block krnw
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private GoodReceiveNote grn_id;
}
