package com.tka.sams.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tka.sams.api.entity.AdminDeletionRequest;
import com.tka.sams.api.service.AdminDeletionRequestService;

@RestController
@RequestMapping("/admin-deletion")
@CrossOrigin
public class AdminDeletionRequestController {

	@Autowired
	private AdminDeletionRequestService service;

	@PostMapping("/request")
	public ResponseEntity<?> createRequest(@RequestParam String targetAdmin, @RequestParam String requestedBy) {
		AdminDeletionRequest request = service.createRequest(targetAdmin, requestedBy);
		if (request != null) {
			return new ResponseEntity<>(request, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>("Failed to submit admin deletion request.", HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/all-pending")
	public ResponseEntity<List<AdminDeletionRequest>> getAllPendingRequests() {
		List<AdminDeletionRequest> list = service.getAllPendingRequests();
		return new ResponseEntity<>(list, HttpStatus.OK);
	}

	@PostMapping("/grant/{id}")
	public ResponseEntity<String> grantRequest(@PathVariable Long id) {
		boolean success = service.grantRequest(id);
		if (success) {
			return new ResponseEntity<>("Admin deletion request granted! Target admin account deleted.", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to grant request.", HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/deny/{id}")
	public ResponseEntity<String> denyRequest(@PathVariable Long id) {
		boolean success = service.denyRequest(id);
		if (success) {
			return new ResponseEntity<>("Admin deletion request denied.", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to deny request.", HttpStatus.BAD_REQUEST);
		}
	}
}
