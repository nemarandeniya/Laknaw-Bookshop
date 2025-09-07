package lk.Laknaw_Bookshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import lk.Laknaw_Bookshop.privilege.Role;
import lk.Laknaw_Bookshop.user.UserDao;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional // role ekenui user ekenui dekenma data gnna nisa
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // get logged user by given username
        lk.Laknaw_Bookshop.user.User extUser = userDao.getByUsername(username);
        System.out.println(extUser.getUsername());

        ArrayList<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : extUser.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new User(extUser.getUsername(), extUser.getPassword(), extUser.getStatus(), true, true, true,
                authorities);

        // return
        // org.springframework.security.core.userdetails.User(extUser.getUsername(),
        // extUser.getPassword(),
        // extUser.getStatus(), false, false, false, GrantedAuthorities);
    }

}
