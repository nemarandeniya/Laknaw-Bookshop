package lk.Laknaw_Bookshop.user;

import java.time.LocalDateTime;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.Laknaw_Bookshop.employee.Employee;
import lk.Laknaw_Bookshop.privilege.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private int id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "photopath")
    private String photopath;

    @Column(name = "user_photo")
    private byte[] user_photo;

    // @Column(name = "userphoto")
    // private byte[] userphoto;

    @Column(name = "added_datetime")
    private LocalDateTime added_dateTime;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "note")
    private String note;

    @Column(name = "otp")
    private String otp;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;
}
