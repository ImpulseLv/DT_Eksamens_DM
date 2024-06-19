package com.example.demo.Service;

import com.example.demo.dto.ImageDto;
import com.example.demo.entity.Animal;
import com.example.demo.repository.AnimalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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

    @Value("${app.images.path}")
    private String uploadDir;
    public Optional<Animal> addAnimal(Animal animal){
            return Optional.of(animalRepository.save(animal));
    }

    public List<Animal> getAllAnimals(Sort sort) {
        List<Animal> animals = animalRepository.findAll(sort);
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

    public List<ImageDto> getImagesForAnimal(Long animalId) {
        List<ImageDto> images = new ArrayList<>();
        Path animalDir = Paths.get(uploadDir, animalId.toString());

        if (Files.exists(animalDir) && Files.isDirectory(animalDir)) {
            try (Stream<Path> paths = Files.walk(animalDir)) {
                List<String> imagePaths = paths
                        .filter(Files::isRegularFile)
                        .map(Path::toString)
                        .collect(Collectors.toList());

                for (String imagePath : imagePaths) {
                    Path path = Paths.get(imagePath);
                    String fileName = path.getFileName().toString();
                    String imageUrl =  animalId + "/" + fileName;
                    images.add(new ImageDto(imageUrl));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return images;
    }


    public List<String> getAllAnimalImages() {
    List<String> images = new ArrayList<>();
    try (Stream<Path> paths = Files.walk(Paths.get(uploadDir))) {
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
                existingAnimal.setPrice(updatedAnimal.getPrice());
                existingAnimal.setTakenBy(updatedAnimal.getTakenBy());
        return animalRepository.save(existingAnimal);
    }
    public Animal updateAnimalStatus(Long animalId, Animal.AnimalStatuss status) {
        Optional<Animal> animalOpt = animalRepository.findById(animalId);
        if (!animalOpt.isPresent()) {
            throw new EntityNotFoundException("Animal not found");
        }
        Animal animal = animalOpt.get();
        animal.setStatuss(status);
        return animalRepository.save(animal);
    }

    public void writeToFile(Long animalId, String filename, byte[] data) throws IOException {
        Path directoryPath = Paths.get(uploadDir, animalId.toString());
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        String extension = getFileExtension(filename);

        int nextImageNumber = getNextImageNumber(animalId, extension);

        String uniqueFilename = animalId + "_" + nextImageNumber + "." + extension;

        Path filePath = directoryPath.resolve(uniqueFilename);
        try (OutputStream os = Files.newOutputStream(filePath, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            os.write(data);
        }
    }

    private int getNextImageNumber(Long animalId, String extension) throws IOException {
        Path directoryPath = Paths.get(uploadDir, animalId.toString());
        if (!Files.exists(directoryPath)) {
            return 1;
        }
        try (Stream<Path> files = Files.list(directoryPath)) {
            return files
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .filter(name -> name.matches(animalId + "_\\d+\\." + extension))
                    .map(name -> name.replace(animalId + "_", "").replace("." + extension, ""))
                    .mapToInt(Integer::parseInt)
                    .max()
                    .orElse(0) + 1;
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1);
    }

}
