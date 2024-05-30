package com.example.demo.controller;

import com.example.demo.Service.AnimalService;
import com.example.demo.entity.Animal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@RestController
@RequestMapping("/animals")
public class AnimalController {
    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PostMapping
    public ResponseEntity<Animal> addAnimal(@RequestBody Animal animal) {
        return animalService.addAnimal(animal)
                .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build()
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Animal>> getAllAnimals() {
        List<Animal> animals = animalService.getAllAnimals();
        return ResponseEntity.ok(animals);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        boolean deleted = animalService.deleteAnimalById(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long id) {
        Optional<Animal> animal = animalService.getAnimalById(id);
        return animal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Animal> updateAnimal(@PathVariable Long id, @RequestBody Animal updatedAnimal) {
        Animal animal = animalService.updateAnimal(id, updatedAnimal);
        return animal != null ? ResponseEntity.ok(animal) : ResponseEntity.notFound().build();
    }
    @Value("${app.images.path}")
    private String uploadDir;

    @PostMapping("/{animalId}/uploadImages")
    public ResponseEntity<String> uploadImages(
            @PathVariable Long animalId,
            @RequestParam("files") MultipartFile[] files
    ) {
        for (MultipartFile file : files) {
            try {
                byte[] bytes = file.getBytes();
                String extension = getFileExtension(file.getOriginalFilename());
                int imageNumber = getNextImageNumber(animalId, extension);
                String filename = animalId + "_" + imageNumber + "." + extension;
                writeToFile(animalId, filename, bytes);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Failed to upload " + file.getOriginalFilename());
            }
        }
        return ResponseEntity.ok("Files uploaded successfully");
    }

    private void writeToFile(Long animalId, String filename, byte[] data) throws IOException {
        Path directoryPath = Paths.get(uploadDir, animalId.toString());
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }
        Path filePath = directoryPath.resolve(filename);
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

    @GetMapping("/getImage")
    @ResponseBody
    public ResponseEntity<InputStreamResource> getImageDynamicType(@RequestParam("animalId") Long animalId, @RequestParam("filename") String filename, @RequestParam("jpg") boolean jpg) {
        MediaType contentType = jpg ? MediaType.IMAGE_JPEG : MediaType.IMAGE_PNG;
        Path filePath = Paths.get(uploadDir, animalId.toString(), filename);
        try {
            InputStream in = Files.newInputStream(filePath, StandardOpenOption.READ);
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .body(new InputStreamResource(in));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}

