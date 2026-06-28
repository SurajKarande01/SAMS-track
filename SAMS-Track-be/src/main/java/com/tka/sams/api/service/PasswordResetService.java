package com.tka.sams.api.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tka.sams.api.dao.PasswordResetDao;
import com.tka.sams.api.dao.StudentDao;
import com.tka.sams.api.dao.UserDao;
import com.tka.sams.api.entity.PasswordResetRequest;
import com.tka.sams.api.entity.Student;
import com.tka.sams.api.entity.User;

@Service
public class PasswordResetService {

	@Autowired
	private PasswordResetDao resetDao;

	@Autowired
	private StudentDao studentDao;

	@Autowired
	private UserDao userDao;

	public PasswordResetRequest createRequest(String contactNo, String role) {
		String dateStr = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());
		PasswordResetRequest request = new PasswordResetRequest(contactNo, role, dateStr, "PENDING");
		return resetDao.createRequest(request);
	}

	public List<PasswordResetRequest> getAllPendingRequests() {
		return resetDao.getAllPendingRequests();
	}

	public boolean approveRequest(Long requestId) {
		PasswordResetRequest request = resetDao.getById(requestId);
		if (request == null || !"PENDING".equals(request.getStatus())) {
			return false;
		}

		String contactNo = request.getContactNo();
		String role = request.getRole();

		if ("student".equalsIgnoreCase(role) || "parent".equalsIgnoreCase(role)) {
			Student student = studentDao.getStudentByContactNo(contactNo);
			if (student == null) {
				student = studentDao.getStudentByParentNo(contactNo);
			}
			if (student != null) {
				student.setPassword(student.getContactNo()); // Reset password to student's contact number
				studentDao.updateStudent(student);
			} else {
				return false;
			}
		} else {
			User user = userDao.getUserByName(contactNo);
			if (user != null) {
				user.setPassword(user.getUsername()); // Reset password to mobile number
				userDao.updateUser(user);
			} else {
				return false;
			}
		}

		request.setStatus("APPROVED");
		resetDao.updateRequest(request);
		return true;
	}

	public boolean rejectRequest(Long requestId) {
		PasswordResetRequest request = resetDao.getById(requestId);
		if (request == null || !"PENDING".equals(request.getStatus())) {
			return false;
		}
		request.setStatus("REJECTED");
		resetDao.updateRequest(request);
		return true;
	}
}
