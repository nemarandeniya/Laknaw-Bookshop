package lk.Laknaw_Bookshop.Report;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportController {

    @RequestMapping(value = "/userreport")
    public ModelAndView userreporteUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView userreportView = new ModelAndView();
        userreportView.addObject("logusername", auth.getName());
        userreportView.addObject("title", "User Report Management");
        userreportView.setViewName("userreport.html");
        return userreportView;
    }

    @RequestMapping(value = "/purchaseorderreport")
    public ModelAndView purchaseorderreportUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView purchaseorderreportView = new ModelAndView();
        purchaseorderreportView.addObject("logusername", auth.getName());
        purchaseorderreportView.addObject("title", "Purchaseorder Report Management");
        purchaseorderreportView.setViewName("purchaseorderreport.html");
        return purchaseorderreportView;
    }

    @RequestMapping(value = "/salesreport")
    public ModelAndView salesreportUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView salesreportView = new ModelAndView();
        salesreportView.addObject("logusername", auth.getName());
        salesreportView.addObject("title", "Sales Report Management");
        salesreportView.setViewName("salesreport.html");
        return salesreportView;
    }
}
