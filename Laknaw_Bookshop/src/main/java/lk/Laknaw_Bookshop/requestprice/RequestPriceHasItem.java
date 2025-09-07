package lk.Laknaw_Bookshop.requestprice;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lk.Laknaw_Bookshop.item.Item;

public class RequestPriceHasItem {

    @Id
    @ManyToOne
    @JoinColumn(name = "request_price_id", referencedColumnName = "id")
    private RequestPrice requestprice_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;
}
