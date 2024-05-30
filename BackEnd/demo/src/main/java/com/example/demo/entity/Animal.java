package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.type.descriptor.jdbc.VarcharJdbcType;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

@Entity
@Data
@Table(name = "animal")
public class Animal {


    public enum AnimalStatuss{
         free,
         taken,
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
        private Date creation_date;
        private Date update_date;
        private Long owner_id;
        @Transient
        private ArrayList<String> images;

        @PrePersist
        protected void onCreate() {
            creation_date = new Date();
            update_date = creation_date;
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
    }

