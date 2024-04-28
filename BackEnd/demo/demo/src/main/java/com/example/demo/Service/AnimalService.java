package com.example.demo.Service;

import com.example.demo.entity.Animal;
import com.example.demo.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
public class AnimalService {
    private final AnimalRepository animalRepository;
    public Optional<Animal> addAnimal(Animal animal){
            return Optional.of(animalRepository.save(animal));
    }

    public List<Animal> getAllAnimals() {

        return animalRepository.findAll();
    }

    public Optional<Animal> getAnimalById(Long id) {
        return animalRepository.findById(id);
    }
    public boolean deleteAnimalById(Long id) {
        animalRepository.deleteById(id);
        return true;
    }
    public Animal updateAnimal(Long id, Animal updatedAnimal) {
        Optional<Animal> animal = getAnimalById(id);
        if (animal.isEmpty()) {
            return null;
        }
        Animal existingAnimal = animal.get();
                existingAnimal.setName(updatedAnimal.getName());
                existingAnimal.setType(updatedAnimal.getType());
                existingAnimal.setStatuss(updatedAnimal.getStatuss());
                existingAnimal.setDate_of_birth(updatedAnimal.getDate_of_birth());
                existingAnimal.setGender(updatedAnimal.getGender());
        return animalRepository.save(existingAnimal);
    }
}
