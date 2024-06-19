package com.example.demo.entity;


import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.Date;

@Entity
@Data
@Table(name = "animal")
public class Animal {


    public enum AnimalStatuss{
         free,
         taken,
         notVerified,
         booked;

 }
        @Id
        @SequenceGenerator(name = "animal_animal_seq",sequenceName="animal_id_seq", allocationSize=1)
        @GeneratedValue(strategy = GenerationType.SEQUENCE)
        private Long id;
        private String name;
        private String type;
        @Enumerated(EnumType.STRING)
        private AnimalStatuss statuss;
        private Date date_of_birth;
        private String gender;
        private Date creationDate;
        private Date update_date;
        private Long owner_id;
        private Long price;
        private Long takenBy;
        @Transient
        private ArrayList<String> images;

        @PrePersist
        protected void onCreate() {
            creationDate = new Date();
            update_date = creationDate;
        }
        @PreUpdate
        protected void onUpdate(){
            update_date = new Date();
        }


    public ArrayList<String> getImages() {
        return images;
    }

    public void setImages(ArrayList<String> images) {
        this.images = images;
    }


    public AnimalStatuss getStatuss() {
        return statuss;
    }

    public void setStatuss(AnimalStatuss statuss) {
        this.statuss = statuss;
    }
}