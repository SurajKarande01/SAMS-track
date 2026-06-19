package com.tka.sams.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.sams.api.entity.Student;
import com.tka.sams.api.service.StudentService;

@RestController
@RequestMapping("/student")
@CrossOrigin("*")
public class StudentController {

	@Autowired
	private StudentService studentService;

	@GetMapping("/get-all-students")
	public List<Student> getAllStudents() {
		return studentService.getAllStudents();
	}

	@PostMapping("/add-student")
	public org.springframework.http.ResponseEntity<?> createStudent(@RequestBody Student student) {
		Student created = studentService.createStudent(student);
		if (created != null) {
			return new org.springframework.http.ResponseEntity<>(created, org.springframework.http.HttpStatus.CREATED);
		} else {
			return new org.springframework.http.ResponseEntity<>("Failed to create student", org.springframework.http.HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/get-student-by-id/{id}")
	public Student getStudentById(@PathVariable Long id) {
		return studentService.getStudentById(id);
	}

	@PutMapping("/update-student")
	public org.springframework.http.ResponseEntity<?> updateStudent(@RequestBody Student studentDetails) {
		Student updated = studentService.updateStudent(studentDetails);
		if (updated != null) {
			return new org.springframework.http.ResponseEntity<>(updated, org.springframework.http.HttpStatus.OK);
		} else {
			return new org.springframework.http.ResponseEntity<>("Failed to update student", org.springframework.http.HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/delete-student/{id}")
	public org.springframework.http.ResponseEntity<String> deleteStudent(@PathVariable long id) {
		String result = studentService.deleteStudent(id);
		if ("Deleted !!".equals(result)) {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
		} else {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.NOT_FOUND);
		}
	}
}
