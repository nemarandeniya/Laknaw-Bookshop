package lk.Laknaw_Bookshop.Invoice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CardTypeController {
    @Autowired
    private CardTypeDao cardTypeDao;

    @GetMapping(value = "/cardtype/alldata", produces = "application/json")
    public List<CardType> allCardTypeList() {
        return cardTypeDao.findAll();
    }
}
