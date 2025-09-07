package lk.Laknaw_Bookshop.inventory;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.Laknaw_Bookshop.item.Item;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "total_qty")
    @NotNull
    private int total_qty;

    @Column(name = "available_qty")
    @NotNull
    private int available_qty;

    @Column(name = "sales_price")
    @NotNull
    private BigDecimal sales_price;

    @OneToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;

}
