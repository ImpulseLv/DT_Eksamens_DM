package com.example.demo.Service;

import com.example.demo.entity.Animal;
import com.example.demo.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequiredArgsConstructor
@Service
public class AnimalService {
    private final AnimalRepository animalRepository;
    private static final String IMAGES_PATH = "C:/Users/\u0414\u0430\u043d\u0438\u0438\u043b/images-1/";
    public Optional<Animal> addAnimal(Animal animal){
            return Optional.of(animalRepository.save(animal));
    }

    public List<Animal> getAllAnimals() {
        List<Animal> animals = animalRepository.findAll();
        List<String> images = getAllAnimalImages();

        // Группируем изображения по животным. Здесь предполагается, что изображения названы в формате "<animalId>_<imageNumber>.jpg"
        for (Animal animal : animals) {
            Long animalId = animal.getId();
            List<String> animalImages = images.stream()
                    .filter(image -> image.contains(animalId.toString()))
                    .collect(Collectors.toList());
            animal.setImages(new ArrayList<>(animalImages));
        }

        return animals;
    }
public List<String> getAllAnimalImages() {
    List<String> images = new ArrayList<>();
    try (Stream<Path> paths = Files.walk(Paths.get(IMAGES_PATH))) {
        images = paths
                .filter(Files::isRegularFile) // Фильтруем только файлы (исключаем директории)
                .map(path -> path.toString()) // Преобразуем Path в String
                .collect(Collectors.toList()); // Собираем в список
    } catch (IOException e) {
        e.printStackTrace();
    }
    return images;
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
