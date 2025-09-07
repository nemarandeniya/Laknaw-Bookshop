package lk.Laknaw_Bookshop.Report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportDataController {

    @Autowired
    private ReportDao reportDao;

    // GetMapping for get report data by weekly or month
    // [/invoicereport/bydateandtype?startdate=&enddate=&type= ]
    @GetMapping(value = "/invoicereport/bydateandtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getPaymentReportByType(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
        if (type.equals("Weekly")) {
            return reportDao.getPaymentByWeek(startdate, enddate);
        }
        if (type.equals("Monthly")) {
            return reportDao.getPaymentByMonth(startdate, enddate);
        }
        if (type.equals("Supplier")) {
            return reportDao.getPaymentBySupplier(startdate, enddate);
        }
        return null;
    }

    // get mapping for get sales for each subcategory and category by date
    @GetMapping(value = "/invoicereport/salesbydate", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getSalesbydate(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate, @RequestParam("type") String type) {
        if (type.equals("Category")) {
            return reportDao.getSalesByCategory(startdate, enddate);
        }
        if (type.equals("Sub-category")) {
            return reportDao.getSalesBySubCategory(startdate, enddate);
        }
        if (type.equals("Itemname")) {
            return reportDao.getSalesByItemname(startdate, enddate);
        }
        if (type.equals("Month")) {
            return reportDao.getSalesByMonth(startdate, enddate);
        }
        if (type.equals("Daily")) {
            return reportDao.getSalesByDate(startdate, enddate);
        }

        return null;
    }

    // GetMapping for get report data for 6 month
    @GetMapping(value = "/invoicereport/bysixmonth", produces = "application/json")
    public String[][] getReportForSixMonth() {
        return reportDao.getPaymentForSixMonth();
    }

    @GetMapping(value = "/invoicereport/salesforlastmonth", produces = "application/json")
    public String[][] getSalesForLastMonth() {
        return reportDao.getSalesForlastMonth();
    }

}
