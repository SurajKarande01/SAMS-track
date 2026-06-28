package com.tka.sams.api.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tka.sams.api.dao.AdminDeletionRequestDao;
import com.tka.sams.api.dao.UserDao;
import com.tka.sams.api.entity.AdminDeletionRequest;

@Service
public class AdminDeletionRequestService {

	@Autowired
	private AdminDeletionRequestDao dao;

	@Autowired
	private UserDao userDao;

	public AdminDeletionRequest createRequest(String targetAdmin, String requestedBy) {
		String dateStr = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
		AdminDeletionRequest request = new AdminDeletionRequest(targetAdmin, requestedBy, dateStr, "PENDING");
		return dao.createRequest(request);
	}

	public List<AdminDeletionRequest> getAllPendingRequests() {
		return dao.getAllPendingRequests();
	}

	public boolean grantRequest(Long id) {
		AdminDeletionRequest request = dao.getById(id);
		if (request == null || !"PENDING".equals(request.getStatus())) {
			return false;
		}
		userDao.deleteUserById(request.getTargetAdminUsername());
		request.setStatus("GRANTED");
		dao.updateRequest(request);
		return true;
	}

	public boolean denyRequest(Long id) {
		AdminDeletionRequest request = dao.getById(id);
		if (request == null || !"PENDING".equals(request.getStatus())) {
			return false;
		}
		request.setStatus("DENIED");
		dao.updateRequest(request);
		return true;
	}
}
