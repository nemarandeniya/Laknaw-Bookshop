package lk.Laknaw_Bookshop.employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationDao extends JpaRepository<Designation, Integer> {

    String findAll = null;
}
