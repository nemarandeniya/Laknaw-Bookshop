package lk.Laknaw_Bookshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // request filter
        httpSecurity.authorizeHttpRequests((auth) -> {
            auth
                    .requestMatchers("/resources/**").permitAll()
                    .requestMatchers("/login").permitAll()
                    .requestMatchers("/createadmin").permitAll()
                    // .requestMatchers("/errorpage").permitAll()
                    .requestMatchers("/dashboard").hasAnyAuthority("Admin", "Manager", "Cashier", "Store-Manager")
                    .requestMatchers("/loggeduserdetail")
                    .hasAnyAuthority("Admin", "Manager", "Cashier", "Store-Manager")
                    .requestMatchers("/module/listByLoggedUser")
                    .hasAnyAuthority("Admin", "Manager", "Cashier", "Store-Manager")
                    .requestMatchers("/employee/**").hasAnyAuthority("Admin", "Manager", "Cashier")
                    .requestMatchers("/user/**").hasAnyAuthority("Admin", "Manager")
                    .requestMatchers("/privilage/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Store-Manager")
                    .requestMatchers("/item/**").hasAnyAuthority("Admin", "Manager", "Cashier", "Store-Manager")
                    .requestMatchers("/supplier/**").hasAnyAuthority("Admin", "Manager")
                    .anyRequest().authenticated();
        })

                // login detail
                .formLogin((login) -> {
                    login.loginPage("/login")
                            .usernameParameter("username")// login usename parameter
                            .passwordParameter("password")// login password parameter
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=invalidusernamepassword");
                })

                // log out detail
                .logout((logout) -> {
                    logout.logoutUrl("/logout").logoutSuccessUrl("/login");
                })

                // csrf detail
                .csrf((csrf) -> {
                    csrf.disable();// meka default enable wela thiyenne.ehema enable unoth apite findall wge //
                                   // services web page eka athulen gnna ba url eka nathuwa
                })

                // exception handeling
                .exceptionHandling((exception) -> {
                    exception.accessDeniedPage("/errorpage");
                });

        return httpSecurity.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}
