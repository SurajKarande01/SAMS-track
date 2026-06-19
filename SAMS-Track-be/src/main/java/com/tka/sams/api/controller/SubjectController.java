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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.tka.sams.api.entity.Subject;
import com.tka.sams.api.service.SubjectService;

@RestController
@RequestMapping("/subject")
@CrossOrigin("*")
public class SubjectController {

	@Autowired
	private SubjectService subjectService;

	@GetMapping("/get-all-subjects")
	public List<Subject> getAllSubjects() {
		return subjectService.getAllSubjects();
	}

	@PostMapping("/add-subject")
	@CrossOrigin(methods = RequestMethod.POST)
	public org.springframework.http.ResponseEntity<?> createSubject(@RequestBody Subject subject) {
		Subject created = subjectService.createSubject(subject);
		if (created != null) {
			return new org.springframework.http.ResponseEntity<>(created, org.springframework.http.HttpStatus.CREATED);
		} else {
			return new org.springframework.http.ResponseEntity<>("Failed to create subject or subject already exists", org.springframework.http.HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/get-subject-by-id/{id}")
	public Subject getSubjectById(@PathVariable long id) {
		return subjectService.getSubjectById(id);
	}
	
	@PutMapping("/update-subject")
	@CrossOrigin(methods = RequestMethod.PUT)
	public org.springframework.http.ResponseEntity<?> updateSubject(@RequestBody Subject subjectDetails) {
		Subject updated = subjectService.updateSubject(subjectDetails);
		if (updated != null) {
			return new org.springframework.http.ResponseEntity<>(updated, org.springframework.http.HttpStatus.OK);
		} else {
			return new org.springframework.http.ResponseEntity<>("Failed to update subject", org.springframework.http.HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/delete-subject/{id}")
	public org.springframework.http.ResponseEntity<String> deleteSubject(@PathVariable long id) {
		String result = subjectService.deleteSubject(id);
		if ("deleted".equals(result)) {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
		} else {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/faculty/{facultyUsername}")
	public List<Subject> getSubjectsByFaculty(@PathVariable String facultyUsername) {
		return subjectService.getSubjectsByFaculty(facultyUsername);
	}
}
