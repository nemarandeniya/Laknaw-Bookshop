package lk.Laknaw_Bookshop.privilege;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleDao extends JpaRepository<Role, Integer> {

    @Query("select r from Role r where r.name <>'Admin'")
    List<Role> getRolesWithoutAdmin();

}
