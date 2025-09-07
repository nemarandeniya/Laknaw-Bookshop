package lk.Laknaw_Bookshop;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgetPassword {

    private String password;
    private String otp;
    private String email;
}
