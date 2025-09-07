package lk.Laknaw_Bookshop.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User, Integer> {

    // create query to get user by given email
    @Query("select u from User u where u.email=?1")
    User GetByEmail(String email);

    @Query("select u from User u where u.employee_id.id=?1")
    User getByEmployee(Integer id);

    @Query("select u from User u where u.username=?1")
    User getByUsername(String username);

}
