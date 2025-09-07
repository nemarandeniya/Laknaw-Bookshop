package lk.Laknaw_Bookshop.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "designation")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Designation {
    @Id // integrate primery key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // set Auto Increment
    @Column(name = "id", unique = true) // map with id column and set as uique
    private Integer id;

    @Column(name = "name")
    private String name;
}
