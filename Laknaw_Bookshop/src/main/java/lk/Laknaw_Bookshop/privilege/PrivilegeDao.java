package lk.Laknaw_Bookshop.privilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    // create query for get privilege by given username and module name
    @Query(value = "SELECT bit_or(p.selpriv) as sel , bit_or(p.insertpriv) as inst, bit_or(p.updpriv) as upd , bit_or(p.delpriv) as del FROM laknaw_bookshop.privilege as p where p.role_id in (select uhr.role_id from laknaw_bookshop.user_has_role as uhr where uhr.user_id in (select u.id from laknaw_bookshop.user as u where u.username=?1)) and p.module_id in (select m.id from laknaw_bookshop.module as m where m.name=?2);", nativeQuery = true)
    public String getPrivilegeByUserModule(String username, String modulename);

    // @Query(value = "SELECT p.* FROM laknaw_bookshop.privilege as p join
    // laknaw_bookshop.role as r on p.role_id=r.id where r.name=?1", nativeQuery =
    // true)
    // public List<Privilege> getAllDataByRole(String name);
}
