package com.tka.sams.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.sams.api.entity.AttendanceRecord;
import com.tka.sams.api.entity.Student;
import com.tka.sams.api.entity.Subject;
import com.tka.sams.api.entity.User;
import com.tka.sams.api.model.AttendanceRecordRequest;
import com.tka.sams.api.service.AttendanceRecordService;
import com.tka.sams.api.service.StudentService;
import com.tka.sams.api.service.SubjectService;
import com.tka.sams.api.service.UserService;

@RestController
@RequestMapping("/attendance")
@CrossOrigin("*")
public class AttendanceController {

	@Autowired
	private AttendanceRecordService attendanceRecordService;

	@Autowired
	private UserService userService;

	@Autowired
	private SubjectService subjectService;

	@Autowired
	private StudentService studentService;

	@GetMapping("/get-all-attendance-records")
	public List<AttendanceRecord> getAllAttendanceRecords() {
		return attendanceRecordService.getAllAttendanceRecords();
	}
	
	 @GetMapping("/get-attendance-by-faculty/{facultyUsername}")
	    public List<AttendanceRecord> getAttendanceByFaculty(@PathVariable String facultyUsername) {
	        return attendanceRecordService.getAttendanceByFaculty(facultyUsername);
	    }
	
	
	@GetMapping({"/get-attendance-by-date-subjet/{date}/{subjectId}", "/get-attendance-by-date-subject/{date}/{subjectId}"})
	public List<AttendanceRecord> getAllAttendanceRecords(@PathVariable String date,@PathVariable long subjectId){
		return attendanceRecordService.getAllAttendanceRecords(date,subjectId);
	}
	
	@GetMapping("/get-attendance/{faculty}/{subjectId}/{date}")
	public List<AttendanceRecord> getAttendanceByFacultySubjectDate(
	        @PathVariable String faculty, 
	        @PathVariable long subjectId, 
	        @PathVariable String date) {
	    return attendanceRecordService.getAttendanceByFacultySubjectDate(faculty, subjectId, date);
	}


	@PostMapping("/take-attendance")
	public org.springframework.http.ResponseEntity<?> createAttendanceRecord(@RequestBody AttendanceRecordRequest request) {
		String username = request.getUsername() != null ? request.getUsername() : request.getFaculty();
		User user = userService.getUserByName(username);
		Subject subject = subjectService.getSubjectById(request.getSubjectId());
		
		java.util.Set<Student> studentSet = new java.util.HashSet<>();
		if (request.getStudents() != null) {
			studentSet.addAll(request.getStudents());
		}
		if (request.getStudentIds() != null) {
			for (Long sId : request.getStudentIds()) {
				Student student = studentService.getStudentById(sId);
				if (student != null) {
					studentSet.add(student);
				}
			}
		}
		
		AttendanceRecord attendanceRecord = new AttendanceRecord();
		attendanceRecord.setUser(user);
		attendanceRecord.setSubject(subject);
		attendanceRecord.setDate(request.getDate());
		attendanceRecord.setTime(request.getTime());
		attendanceRecord.setStudents(studentSet);
		attendanceRecord.setNumberOfStudents(studentSet.size());

		System.out.println(attendanceRecord);
		AttendanceRecord saved = attendanceRecordService.saveAttendance(attendanceRecord);
		if (saved != null) {
			return new org.springframework.http.ResponseEntity<>(saved, org.springframework.http.HttpStatus.CREATED);
		} else {
			return new org.springframework.http.ResponseEntity<>("Failed to record attendance", org.springframework.http.HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/delete-attendance/{id}")
	public org.springframework.http.ResponseEntity<String> deleteAttendance(@PathVariable String id) {
		String result = attendanceRecordService.deleteAttendanceRecord(id);
		if ("deleted".equals(result)) {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.OK);
		} else {
			return new org.springframework.http.ResponseEntity<>(result, org.springframework.http.HttpStatus.NOT_FOUND);
		}
	}
}
