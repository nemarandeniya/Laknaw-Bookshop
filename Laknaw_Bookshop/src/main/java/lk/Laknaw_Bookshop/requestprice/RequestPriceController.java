package lk.Laknaw_Bookshop.requestprice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class RequestPriceController {

    @Autowired
    private RequestPriceDao reqpricedao;
    @Autowired
    private RequestPriceStatusDao reqpricestatusdao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @RequestMapping(value = "/requestprice")
    public ModelAndView requestpriceUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView requestpriceView = new ModelAndView();
        requestpriceView.addObject("logusername", auth.getName());
        requestpriceView.addObject("title", "Request Price Management");
        requestpriceView.setViewName("requestprice.html");
        return requestpriceView;
    }

    @GetMapping(value = "/requestprice/alldata", produces = "application/json")
    public List<RequestPrice> allReqpriceData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "RequestPrice");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return reqpricedao.findAll(Sort.by(Sort.Direction.DESC, "reqno"));
    }

    @PostMapping(value = "/requestprice")
    public String addRequestprice(@RequestBody RequestPrice requestPrice) {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Request_Price");

        if (!logUserPrivi.get("insert")) {
            return "Insert Not Complete : You haven't Privilege";
        }

        try {
            // set addeded datetime
            requestPrice.setAddeddatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            requestPrice.setAddeduser_id(loggeduser.getId());

            // set auto genarated value
            String nextNumber = reqpricedao.getReqPriceNumber();
            if (nextNumber == null) {
                requestPrice.setReqno("002");
            } else {
                requestPrice.setReqno(nextNumber);
            }
            reqpricedao.save(requestPrice);
            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    // @PutMapping(value = "/requestprice")
    // public String updateRequestPrice(@RequestBody RequestPrice requestPrice) {

    // // get loged user authentication object
    // Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    // HashMap<String, Boolean> logUserPrivi =
    // privilegeController.getPrivilegeByUserModule(auth.getName(),
    // "Request_Price");

    // if (!logUserPrivi.get("update")) {
    // return "Update Not Complete : You haven't Privilege";
    // }

    // // check existing
    // RequestPrice extRequestPrice =
    // reqpricedao.getReferenceById(requestPrice.getId());
    // if (extRequestPrice == null) {
    // return "Update not completed: Request price not exists..!";
    // }
    // try {

    // // set update date time
    // requestPrice.setUpdatedatetime(LocalDateTime.now());

    // // set update user id
    // User loggedUser = userDao.getByUsername(auth.getName());
    // requestPrice.setUpdateuser_id(loggedUser.getId());

    // reqpricedao.save(requestPrice);
    // return "OK";
    // } catch (Exception e) {
    // return "Update Not Completed : " + e.getMessage();

    // }
    // }

    @DeleteMapping(value = "/requestprice")
    public String deleteRequestPrice(@RequestBody RequestPrice requestPrice) {

        // check User authentication & authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // get logged user privilege object by usename and module name
        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "RequestPrice");
        if (!logUserPrivi.get("delete")) {
            return "Delete not completed : you haven't permission..!";
        }

        // check existence
        RequestPrice extRequestPrice = reqpricedao.getReferenceById(requestPrice.getId());
        if (extRequestPrice == null) {
            return "Delete not complete: You haven't permission..!";
        }
        try {

            // set delete date time
            requestPrice.setDeletedatetime(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            requestPrice.setDeleteuser_id(loggeduser.getId());

            // soft delete
            RequestPriceStatus deleteStatus = reqpricestatusdao.getReferenceById(4);
            extRequestPrice.setRequest_price_status_id(deleteStatus);
            reqpricedao.save(extRequestPrice);
            return "OK";
        } catch (Exception e) {
            return "Delete not completed : " + e.getMessage();
        }
    }

    @GetMapping(value = "/requestprice/requestno", produces = "application/json")
    public List<RequestPrice> getReqNumber() {
        return reqpricedao.getReqNo();
    }

    @GetMapping(value = "/requestprice/listBySupplier/{supplierid}", produces = "application/json")
    public List<RequestPrice> getAllDataBySupplier(@PathVariable("supplierid") Integer supplierid) {
        return reqpricedao.getBySupplier(supplierid);
    }
}
