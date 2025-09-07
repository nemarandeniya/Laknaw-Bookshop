package lk.Laknaw_Bookshop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeUser {
    private String username;
    private String oldusername;
    private String newpassword;
    private String oldpassword;
    private String email;
    private byte[] userphoto;
}
