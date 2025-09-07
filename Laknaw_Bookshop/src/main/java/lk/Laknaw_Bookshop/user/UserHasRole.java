package lk.Laknaw_Bookshop.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.Laknaw_Bookshop.privilege.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_has_role")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserHasRole {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user_id;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role_id;
}
