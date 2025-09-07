package lk.Laknaw_Bookshop.requestprice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestPriceStatusController {
    @Autowired
    private RequestPriceStatusDao dao;

    @GetMapping(value = "/requestpricestatus/alldata", produces = "application/json")
    public List<RequestPriceStatus> getAllDataList() {
        return dao.findAll();
    }
}
