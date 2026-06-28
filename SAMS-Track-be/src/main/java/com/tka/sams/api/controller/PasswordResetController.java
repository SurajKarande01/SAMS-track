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

import com.tka.sams.api.entity.PasswordResetRequest;
import com.tka.sams.api.service.PasswordResetService;

@RestController
@RequestMapping("/password-reset")
@CrossOrigin
public class PasswordResetController {

	@Autowired
	private PasswordResetService resetService;

	@PostMapping("/request")
	public ResponseEntity<?> createRequest(@RequestParam String contactNo, @RequestParam String role) {
		PasswordResetRequest request = resetService.createRequest(contactNo, role);
		if (request != null) {
			return new ResponseEntity<>(request, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>("Failed to submit password reset request.", HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/all-pending")
	public ResponseEntity<List<PasswordResetRequest>> getAllPendingRequests() {
		List<PasswordResetRequest> list = resetService.getAllPendingRequests();
		return new ResponseEntity<>(list, HttpStatus.OK);
	}

	@PostMapping("/approve/{id}")
	public ResponseEntity<String> approveRequest(@PathVariable Long id) {
		boolean success = resetService.approveRequest(id);
		if (success) {
			return new ResponseEntity<>("Password reset approved! User password has been reset to their mobile number.", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to approve request or user not found.", HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/reject/{id}")
	public ResponseEntity<String> rejectRequest(@PathVariable Long id) {
		boolean success = resetService.rejectRequest(id);
		if (success) {
			return new ResponseEntity<>("Password reset request rejected.", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to reject request.", HttpStatus.BAD_REQUEST);
		}
	}
}
