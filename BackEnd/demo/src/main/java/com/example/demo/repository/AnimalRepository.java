package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Animal;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository  extends JpaRepository<Animal, Long>  {
}
