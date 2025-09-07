package lk.Laknaw_Bookshop.pricelist;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.requestprice.RequestPrice;
import lk.Laknaw_Bookshop.requestprice.RequestPriceDao;
import lk.Laknaw_Bookshop.requestprice.RequestPriceStatusDao;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class PricelistController {

    @Autowired
    private PricelistDao pricelistdao;

    @Autowired
    private PriceListStatusDao priceliststatusdao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RequestPriceDao requestPriceDao;

    @Autowired
    private RequestPriceStatusDao requestPriceStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/pricelist")
    public ModelAndView pricelistUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView pricelistView = new ModelAndView();
        pricelistView.addObject("logusername", auth.getName());
        pricelistView.addObject("title", "Pricelist Management");
        pricelistView.setViewName("pricelist.html");
        return pricelistView;
    }

    @GetMapping(value = "/pricelist/alldata", produces = "application/json")
    public List<PriceList> allPricelistData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Pricelist");

        if (!logUserPrivi.get("select")) {
            return null;
        }

        return pricelistdao.findAll();
    }// Sort.by(Sort.Direction.DESC, "pricelist_no")

    @PostMapping(value = "/pricelist")
    public String savePricelist(@RequestBody PriceList pricelist) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Price_list");
        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set added date time
            pricelist.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            pricelist.setAddeduser_id(loggeduser.getId());

            // set next order code number
            String nextNumber = pricelistdao.getNextPriceListNumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                pricelist.setPricelist_no("PL0002");
            } else {
                pricelist.setPricelist_no(nextNumber);
            }

            // assosiastion table eke thiyena porder eka block krnw.eka nathuwa submit krnna
            // ba.eka nisa list eka aragena 1 by 1 purchase order eka set krnwa.
            for (ItemPriceList ipl : pricelist.getPricelistitems()) {// getPriceItemList
                                                                     // list eka illa gnnwa eke
                                                                     // thiyenwa
                                                                     // pricelistitems
                ipl.setPricelist_id(pricelist);// purchase order id ekata purchaseOrder set krnw
            }

            pricelistdao.save(pricelist);

            // set request price status based pricelist
            RequestPrice reqpriceOb = requestPriceDao.getReferenceById(pricelist.getRequest_price_id().getId());
            reqpriceOb.setRequest_price_status_id(requestPriceStatusDao.getReferenceById(2));
            requestPriceDao.save(reqpriceOb);

            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

    @PutMapping(value = "/pricelist")
    public String updatePriceList(@RequestBody PriceList priceList) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Price_list");

        if (!logUserPrivi.get("update")) {
            return "Update Not Complete : You haven't Privilege";
        }

        // check existing
        PriceList extPricelist = pricelistdao.getReferenceById(priceList.getId());
        if (extPricelist == null) {
            return "Update not completed: Price List not exists..!";
        }
        try {

            // set update date time
            priceList.setUpdatedatetime(LocalDateTime.now());
            // set update user id
            User loggeduser = userDao.getByUsername(auth.getName());
            priceList.setUpdateuser_id(loggeduser.getId());

            for (ItemPriceList ipl : priceList.getPricelistitems()) {
                ipl.setPricelist_id(priceList);
            }

            pricelistdao.save(priceList);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();

        }
    }

    @DeleteMapping(value = "/pricelist")
    public String deletePriceList(@RequestBody PriceList priceList) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Price_list");
        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : you haven't permission..!";
        }

        // check existence
        PriceList extPricelist = pricelistdao.getReferenceById(priceList.getId());
        if (extPricelist == null) {
            return "Delete not complete: You haven't permission..!";
        }
        try {

            // set delete date time
            priceList.setDeletedatetime(LocalDateTime.now());
            // set delete user id
            User loggeduser = userDao.getByUsername(auth.getName());
            priceList.setDeleteuser_id(loggeduser.getId());
            // soft delete
            PriceListStatus deleteStatus = priceliststatusdao.getReferenceById(2);
            extPricelist.setPricelist_status_id(deleteStatus);
            pricelistdao.save(extPricelist);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @GetMapping(value = "/pricelist/listBySupplierAndDate/{supplierid}/{requireddate}", produces = "application/json")
    public List<PriceList> getAllDataBySupplier(@PathVariable("supplierid") Integer supplierid,
            @PathVariable("requireddate") String requireddate) {
        return pricelistdao.getBySupplierAnddate(supplierid, requireddate);
    }

    @GetMapping(value = "/pricelist/expiredlist", produces = "application/json")
    public List<PriceList> getAllBydeadline() {
        return pricelistdao.getBydeadline();
    }

}
