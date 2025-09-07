package lk.Laknaw_Bookshop.supplier;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {
    // @Query(value = "SELECT
    // concat('s',year(current_date()),lpad(substring(max(s.regno),6)+1,4,0)) FROM
    // Laknaw_Bookshop.Supplier as s where year(s.addeddatetime) =
    // year(current_date());", nativeQuery = true)
    @Query(value = "SELECT lpad(max(s.regno)+1,3,0) FROM laknaw_bookshop.supplier as s;", nativeQuery = true)
    String getNextNumber();

    @Query(value = "select s from Supplier s where s.suppliername=?1")
    Supplier getSuppliername(String suppliername);

    @Query(value = "SELECT * FROM laknaw_bookshop.supplier", nativeQuery = true)
    List<Supplier> getSupplierName();

    @Query(value = "select s from Supplier s where s.id in(select shi.supplier_id.id from SupplierHasItem shi where shi.item_id.id=?1)")
    List<Supplier> getByItem(Integer itemid);

    // @Query(value = "SELECT b.* FROM laknaw_bookshop.supplier as s join
    // laknaw_bookshop.bank as b on s.bank_id=b.id where s.id=?1", nativeQuery =
    // true)
    @Query(value = "SELECT s.bank_id FROM Supplier as s where s.id=?1")
    Bank getBySupplier(Integer supplierid);

    @Query(value = "SELECT * FROM laknaw_bookshop.supplier as s where s.id=?1", nativeQuery = true)
    Supplier getBySupplierId(Integer supplierid);
}
