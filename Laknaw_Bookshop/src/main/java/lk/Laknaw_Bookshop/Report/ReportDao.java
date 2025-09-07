package lk.Laknaw_Bookshop.Report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.Laknaw_Bookshop.employee.Employee;

public interface ReportDao extends JpaRepository<Employee, Integer> {

    @Query(value = "SELECT s.suppliername, sum(po.total_amount) FROM laknaw_bookshop.purchase_order as po join laknaw_bookshop.supplier as s on po.supplier_id = s.id where date(po.addeddatetime) between current_date() - interval 6 MONTH and current_date() group by s.suppliername;", nativeQuery = true)
    String[][] getPaymentForSixMonth();// date()--> datetime eke time kalla ain krla date eka witharak gnnw

    @Query(value = "SELECT monthname(po.addeddatetime), sum(po.total_amount) FROM laknaw_bookshop.purchase_order as po where date(po.addeddatetime) between ?1 and ?2 group by monthname(po.addeddatetime);", nativeQuery = true)
    String[][] getPaymentByMonth(String startdate, String enddate);

    @Query(value = "SELECT week(po.addeddatetime), sum(po.total_amount) FROM laknaw_bookshop.purchase_order as po where date(po.addeddatetime) between ?1 and ?2 group by week(po.addeddatetime);", nativeQuery = true)
    String[][] getPaymentByWeek(String startdate, String enddate);

    @Query(value = "SELECT s.suppliername, sum(po.total_amount) FROM laknaw_bookshop.purchase_order as po join laknaw_bookshop.supplier as s on po.supplier_id = s.id where date(po.addeddatetime) between ?1 and ?2 group by s.suppliername;", nativeQuery = true)
    String[][] getPaymentBySupplier(String startdate, String enddate);

    // for sales report

    // data gnnwa sales wla categary ekata adala item qty.
    @Query(value = "SELECT c.name,sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.category as c on ihi.category_id=c.id where i.invoice_date >=date_sub(curdate(),interval 1 month) group by c.name", nativeQuery = true)
    String[][] getSalesForlastMonth();

    // date_sub(curdate(),interval 1 month) date sub eken krnne date ekkin time
    // interval ekk adu krnw. methandi current date eken 1 month adu krnw.
    // curdate->current date

    @Query(value = "SELECT c.name,sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.category as c on ihi.category_id=c.id where date(i.invoice_date) between ?1 and ?2 group by c.name;", nativeQuery = true)
    String[][] getSalesByCategory(String startdate, String enddate);

    @Query(value = "SELECT sc.name,sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.subcategory as sc on ihi.subcategory_id=sc.id where date(i.invoice_date) between ?1 and ?2 group by sc.name;", nativeQuery = true)
    String[][] getSalesBySubCategory(String startdate, String enddate);

    @Query(value = "SELECT monthname(i.invoice_date),sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.category as c on ihi.category_id=c.id where date(i.invoice_date) between ?1 and ?2 group by monthname(i.invoice_date);", nativeQuery = true)
    String[][] getSalesByMonth(String startdate, String enddate);

    @Query(value = "SELECT date(i.invoice_date),sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.category as c on ihi.category_id=c.id where date(i.invoice_date) between ?1 and ?2 group by date(i.invoice_date);", nativeQuery = true)
    String[][] getSalesByDate(String startdate, String enddate);

    @Query(value = "SELECT it.itemname,sum(ihi.quantity) FROM laknaw_bookshop.invoice as i join laknaw_bookshop.invoice_has_item as ihi on i.id = ihi.invoice_id join laknaw_bookshop.item as it on ihi.item_id=it.id where date(i.invoice_date) between ?1 and ?2 group by it.itemname;", nativeQuery = true)
    String[][] getSalesByItemname(String startdate, String enddate);

}
// get purchase amount for 6month
// @Query(value = "SELECT monthname(po.addeddatetime), sum(po.total_amount) FROM
// laknaw_bookshop.purchase_order as po where date(po.addeddatetime) between
// current_date() - interval 6 MONTH and current_date() group by
// monthname(po.addeddatetime);", nativeQuery = true)