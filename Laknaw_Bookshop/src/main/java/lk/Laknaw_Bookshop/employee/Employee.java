package lk.Laknaw_Bookshop.employee;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    // default contructer ,meka no arge contructer eken auto generate krnwa
    // public Employee(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    // meka all args contructer eken auto generate krnw
    // public Employee(Integer id, @NotNull String empno, @NotNull String fullname,
    // @NotNull String callingname,
    // @Length(max = 12, min = 10, message = "value length between 10-12") @NotNull
    // String nic,
    // @NotNull String gender, @NotNull LocalDate dob, String mobile, @NotNull
    // String address,
    // @NotNull String civilstatus, @NotNull String email, byte[] emp_photo, String
    // emp_photo_name,
    // Integer addeduser_id, LocalDateTime addeddatetime, Integer updateuser_id,
    // LocalDateTime updatedatetime,
    // Integer deleteuser_id, LocalDateTime deletedatetime, Designation
    // designation_id,
    // EmployeeStatus employeestatus_id) {
    // this.id = id;
    // this.empno = empno;
    // this.fullname = fullname;
    // this.callingname = callingname;
    // this.nic = nic;
    // this.gender = gender;
    // this.dob = dob;
    // this.mobile = mobile;
    // this.address = address;
    // this.civilstatus = civilstatus;
    // this.email = email;
    // this.emp_photo = emp_photo;
    // this.emp_photo_name = emp_photo_name;
    // this.addeduser_id = addeduser_id;
    // this.addeddatetime = addeddatetime;
    // this.updateuser_id = updateuser_id;
    // this.updatedatetime = updatedatetime;
    // this.deleteuser_id = deleteuser_id;
    // this.deletedatetime = deletedatetime;
    // this.designation_id = designation_id;
    // this.employeestatus_id = employeestatus_id;
    // }

    @Column(name = "empnum", unique = true)
    @NotNull
    private String empno;

    @Column(name = "fullname")
    @NotNull
    private String fullname;

    @Column(name = "callingname")
    @NotNull // cannot be null
    private String callingname;
    // lombok wla inna @data wlin me gettrs settrs okkoma auto krla denwa
    // public void setCallingname(String callingname) {
    // this.callingname = callingname;
    // }

    // public String getCallingname() {
    // return this.callingname;
    // }

    @Column(name = "nic", unique = true, length = 8)
    @Length(max = 12, min = 10, message = "value length between 10-12")
    @NotNull // cannot be null
    private String nic;

    @Column(name = "gender")
    @NotNull // cannot be null
    private String gender;

    @Column(name = "dob")
    @NotNull // cannot be null
    private LocalDate dob;

    @Column(name = "mobile", length = 10)
    private String mobile;

    @Column(name = "address")
    @NotNull // cannot be null
    private String address;

    @Column(name = "civilstatus")
    @NotNull
    private String civilstatus;

    @Column(name = "email")
    @NotNull // cannot be null
    private String email;

    @Column(name = "emp_photo")
    private byte[] emp_photo;

    @Column(name = "emp_photo_name")
    private String emp_photo_name;

    @Column(name = "addeduser_id")
    private Integer addeduser_id;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updateuser_id")
    private Integer updateuser_id;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;

    @Column(name = "deleteuser_id")
    private Integer deleteuser_id;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @ManyToOne // relationship format
    @JoinColumn(name = "designation_id", referencedColumnName = "id") // join column
    private Designation designation_id;

    @ManyToOne // relationship format
    @JoinColumn(name = "employee_status_id", referencedColumnName = "id") // join column
    private EmployeeStatus employeestatus_id;

}
