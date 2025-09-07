package lk.Laknaw_Bookshop.Invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.Laknaw_Bookshop.customer.Customer;
import lk.Laknaw_Bookshop.customer.CustomerDao;
import lk.Laknaw_Bookshop.inventory.Inventory;
import lk.Laknaw_Bookshop.inventory.InventoryDao;
import lk.Laknaw_Bookshop.privilege.PrivilegeController;
import lk.Laknaw_Bookshop.user.User;
import lk.Laknaw_Bookshop.user.UserDao;

@RestController
public class InvoiceController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private InvoiceDao invoicedao;

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private CustomerDao customerDao;

    @RequestMapping(value = "/invoice")
    public ModelAndView invoiceUI() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView invoiceView = new ModelAndView();
        invoiceView.addObject("logusername", auth.getName());
        invoiceView.addObject("title", "Invoice Management");
        invoiceView.setViewName("invoice.html");
        return invoiceView;
    }

    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<Invoice> allInvoiceData() {

        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Invoice");

        if (!logUserPrivi.get("select")) {
            return null;
        }
        return invoicedao.getAllData();
    }

    @PostMapping(value = "/invoice")
    public String saveInvoice(@RequestBody Invoice invoice) {
        // get loged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
                "Invoice");

        if (!logUserPrivi.get("insert")) {
            return "Save not completed : you haven't permission..!";
        }

        try {
            // set added date time
            invoice.setInvoiceDate(LocalDateTime.now());

            // set added user id
            User loggeduser = userDao.getByUsername(auth.getName());
            invoice.setAddeduser_id(loggeduser.getId());

            // set next invoice number
            String nextNumber = invoicedao.getNextInvoiceNumber();
            if (nextNumber == null) {
                // nextNumber = "s" + LocalDate.now().getYear() + "0001";
                invoice.setInvoiceNumber("I0002");
            } else {
                invoice.setInvoiceNumber(nextNumber);
            }

            // add new loyalty points to customer
            Customer custOb = customerDao.getReferenceById(invoice.getCustomer_id().getId());
            if (!custOb.getCustomerName().equals("Walk-In-Customer")) {
                BigDecimal PriviousLoyaltyPoints = custOb.getLoyalty_points();
                custOb.setPrivious_loyaltypoints(PriviousLoyaltyPoints);

                BigDecimal netAmount = invoice.getNet_amount();
                // meken net amount eka split krnwa 2kkt.1st eka kochchra full 100 ewa
                // thiyenwada,anith eka thiyenne 100n beduwama remainder eka
                BigDecimal[] result = netAmount.divideAndRemainder(new BigDecimal("100"));
                // result array eke palweni value eka,ea kiynne full 100 ewa gana gnnwa
                BigDecimal newPoints = result[0];

                // adu wena loyalty point gana gnnw
                BigDecimal loyaltyRedeem = invoice.getLoyalty_points();
                if (loyaltyRedeem == null) {
                    loyaltyRedeem = BigDecimal.ZERO;
                }
                System.out.println(loyaltyRedeem);
                // aluth point gana thibb apoint wlata ekathu krla loyalty redeem eka adu krnwa
                BigDecimal finalPoints = PriviousLoyaltyPoints.add(newPoints).subtract(loyaltyRedeem);
                System.out.println(finalPoints);

                // finalpoint-0 < 0 nm final point eka 0 ta set krnw.methana >,<,== use krnne
                // ntte ewa thiyenne primitive type wlta(int,double)..compmareTo() use krnw
                // BigDecimal,String,Integer wlta
                if (finalPoints.compareTo(BigDecimal.ZERO) < 0) {
                    finalPoints = BigDecimal.ZERO;
                }
                custOb.setLoyalty_points(finalPoints);

            }

            customerDao.save(custOb);

            // eka for loop eke natuwa dekaka liyanne 1st eka fail unoth DB eka change wenne
            // na,stop everything.2nd eken thma stock eka adu krla invoice eka save krnne
            // mekedi 1st eken blnne ganna hama item ekema stock eka athi wenna thiyenwda
            // kiyla.eka confirm karagena thma inventory eken qty eka adu krla save krnne
            // eka loop ekaka okkoma liwwoth wenne 1item eka stock eka harida balala ek
            // stock eken qty adu krla save krnwa ilagata deweni eka balala stock eka nttn
            // err ekk enwa.ethkota 1item eke qty eka inventory eken adu wela eth invoice
            // eka save wenne na
            for (InvoiceHasItem iil : invoice.getInvoiceHasItemList()) {
                Inventory inventoryOb = iil.getInventory_id();

                int availableQty = inventoryOb.getAvailable_qty();
                int soldQty = iil.getQuantity();

                // stock eka check krnwa sold ganata wada quantity eka available da kiyla
                if (availableQty < soldQty) {
                    return "Not enough stock for the item: " + inventoryOb.getItem_id().getItemname();
                }
            }
            // availble qty eken sold qty eka adu krla inventory eke save krnw
            for (InvoiceHasItem iil : invoice.getInvoiceHasItemList()) {
                Inventory inventoryOb = iil.getInventory_id();

                int availableQty = inventoryOb.getAvailable_qty();
                int soldQty = iil.getQuantity();

                inventoryOb.setAvailable_qty(availableQty - soldQty);
                inventoryDao.save(inventoryOb);

                iil.setInvoice_id(invoice);
            }

            // assosiastion table eke thiyena invoice eka block krnw.eka nathuwa submit
            // krnna
            // ba.eka nisa list eka aragena 1 by 1 invoice eka set krnwa.
            // for (InvoiceHasItem ihi : invoice.getInvoiceHasItemList()) {//
            // getInvoiceHasItemist
            // // list eka illa gnnwa eke
            // // thiyenwa
            // // InvoiceHasItem
            // ihi.setInvoice_id(invoice);// drn id ekata purchaseOrder set krnw
            // }
            invoicedao.save(invoice);

            return "OK";
        } catch (Exception e) {
            return "save not complete" + e.getMessage();
        }
    }

    @GetMapping(value = "/invoice/monthInvoiceCount", produces = "application/json")
    public Long getInvoiceCount() {
        return invoicedao.getInvoiceCountForMonth();
    }

    @GetMapping(value = "/invoice/todayInvoiceCount", produces = "application/json")
    public Long getTodayInvoiceCount() {
        return invoicedao.getInvoiceCountForToday();
    }

}
