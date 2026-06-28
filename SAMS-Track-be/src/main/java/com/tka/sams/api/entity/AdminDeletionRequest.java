package com.tka.sams.api.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AdminDeletionRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String targetAdminUsername;
	private String requestedByAdmin;
	private String requestDate;
	private String status; // PENDING, GRANTED, DENIED

	public AdminDeletionRequest() {
	}

	public AdminDeletionRequest(String targetAdminUsername, String requestedByAdmin, String requestDate, String status) {
		this.targetAdminUsername = targetAdminUsername;
		this.requestedByAdmin = requestedByAdmin;
		this.requestDate = requestDate;
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTargetAdminUsername() {
		return targetAdminUsername;
	}

	public void setTargetAdminUsername(String targetAdminUsername) {
		this.targetAdminUsername = targetAdminUsername;
	}

	public String getRequestedByAdmin() {
		return requestedByAdmin;
	}

	public void setRequestedByAdmin(String requestedByAdmin) {
		this.requestedByAdmin = requestedByAdmin;
	}

	public String getRequestDate() {
		return requestDate;
	}

	public void setRequestDate(String requestDate) {
		this.requestDate = requestDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
