package lk.Laknaw_Bookshop.privilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ModuleDao extends JpaRepository<Module, Integer> {

    @Query(value = "SELECT m.name FROM laknaw_bookshop.module as m where m.id not in (SELECT p.module_id FROM laknaw_bookshop.privilege as p where p.role_id in (SELECT uhr.role_id FROM laknaw_bookshop.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM laknaw_bookshop.user as u where u.username=?1)) and p.selpriv = 1)", nativeQuery = true)
    public String[] getModuleByLogedUser(String username);

}
