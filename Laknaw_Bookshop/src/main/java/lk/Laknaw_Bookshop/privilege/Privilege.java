package lk.Laknaw_Bookshop.privilege;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "privilege")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "insertpriv")
    private Boolean insertpriv;

    @Column(name = "updpriv")
    private Boolean updpriv;

    @Column(name = "selpriv")
    private Boolean selpriv;

    @Column(name = "delpriv")
    private Boolean delpriv;

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

    @ManyToOne
    @JoinColumn(name = "privilegestatus_id", referencedColumnName = "id")
    private PrivilegeStatus privilegestatus_id;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module module_id;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id;
}
