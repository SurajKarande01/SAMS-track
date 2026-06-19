package com.tka.sams.api.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tka.sams.api.entity.Mark;
import com.tka.sams.api.service.MarkService;

@RestController
@RequestMapping("/marks")
@CrossOrigin("*")
public class MarkController {

    @Autowired
    private MarkService markService;

    @GetMapping("/get-all-marks")
    public List<Mark> getAllMarks() {
        return markService.getAllMarks();
    }

    @GetMapping("/get-marks-by-student/{studentId}")
    public List<Mark> getMarksByStudent(@PathVariable long studentId) {
        return markService.getMarksByStudent(studentId);
    }

    @PostMapping("/add-mark")
    public ResponseEntity<?> createMark(@RequestBody Mark mark) {
        Mark created = markService.createMark(mark);
        if (created != null) {
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to create mark record", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-mark")
    public ResponseEntity<?> updateMark(@RequestBody Mark mark) {
        Mark updated = markService.updateMark(mark);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to update mark record", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete-mark/{id}")
    public ResponseEntity<String> deleteMark(@PathVariable long id) {
        String result = markService.deleteMark(id);
        if ("deleted".equals(result)) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        }
    }
}
