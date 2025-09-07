package lk.Laknaw_Bookshop.Invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lk.Laknaw_Bookshop.item.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seasonaldiscount")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SeasonalDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "season_name")
    private String season_name;

    @Column(name = "discount_percentage")
    private BigDecimal discount_percentage;

    @Column(name = "startdate")
    private LocalDate startDate;

    @Column(name = "enddate")
    private LocalDate endDate;

    @ManyToMany
    @JoinTable(name = "seasonaldiscount_has_category", joinColumns = @JoinColumn(name = "seasonaldiscount_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> discountCategory;

}
