package com.example.demo.controller;

import com.example.demo.Service.AnimalService;
import com.example.demo.dto.ImageDto;
import com.example.demo.entity.Animal;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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
import java.util.UUID;
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
    public ResponseEntity<List<Animal>> getAllAnimals(Sort sort) {
        List<Animal> animals = animalService.getAllAnimals(sort);
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
        // Путь к директории для текущего животного
        Path directoryPath = Paths.get(uploadDir, animalId.toString());

        try {
            // Создаем директорию, если она не существует
            Files.createDirectories(directoryPath);

            // Обрабатываем каждый файл
            for (MultipartFile file : files) {
                // Генерируем уникальное имя файла
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

                // Сохраняем файл в директории
                byte[] bytes = file.getBytes();
                animalService.writeToFile(animalId, filename, bytes); // Используем writeToFile из AnimalService
            }

            return ResponseEntity.ok("Files uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to upload files");
        }
    }

    @GetMapping("/getImage/{animalId}/{filename}")
    @ResponseBody
    public ResponseEntity<InputStreamResource> getImageDynamicType(
            @PathVariable("animalId") Long animalId, @PathVariable("filename") String filename) {
        MediaType contentType = MediaType.IMAGE_PNG;
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

    @GetMapping("/animals/{animalId}/images")
    @ResponseBody
    public ResponseEntity<List<ImageDto>> getAnimalImages(@PathVariable("animalId") Long animalId) {
        try {
            List<ImageDto> images = animalService.getImagesForAnimal(animalId);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Animal> updateAnimalStatus(@PathVariable Long id, @RequestParam Animal.AnimalStatuss status) {
        Animal updatedAnimal = animalService.updateAnimalStatus(id, status);
        return ResponseEntity.ok(updatedAnimal);
    }
}

