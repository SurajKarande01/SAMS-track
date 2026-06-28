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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tka.sams.api.entity.User;
import com.tka.sams.api.model.LoginRequest;
import com.tka.sams.api.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

	@Autowired
	private UserService service;

	@Autowired
	private com.tka.sams.api.service.StudentService studentService;


	// http://localhost:8091/user/login-user
	@PostMapping("/login-user")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
		String username = request.getUsername();
		String password = request.getPassword();

		if (username == null || password == null) {
			return new ResponseEntity<>("Username and password are required", HttpStatus.BAD_REQUEST);
		}

		// 1. ADMIN / SUPERADMIN AUTH: logs in using Gmail (@gmail.com) only.
		if (username.endsWith("@gmail.com")) {
			User adminUser = service.getUserByName(username);
			// Auto-create default "admin@gmail.com" on first boot if missing
			if (adminUser == null && "admin@gmail.com".equals(username)) {
				adminUser = new User();
				adminUser.setUsername("admin@gmail.com");
				adminUser.setPassword("admin");
				adminUser.setEmail("admin@gmail.com");
				adminUser.setRole("admin");
				adminUser.setFirstName("System");
				adminUser.setLastName("Admin");
				service.registerUser(adminUser);
			}
			// Auto-create default "superadmin@gmail.com" on first boot if missing
			if (adminUser == null && "superadmin@gmail.com".equals(username)) {
				adminUser = new User();
				adminUser.setUsername("superadmin@gmail.com");
				adminUser.setPassword("superadmin");
				adminUser.setEmail("superadmin@gmail.com");
				adminUser.setRole("superadmin");
				adminUser.setFirstName("Super");
				adminUser.setLastName("Admin");
				service.registerUser(adminUser);
			}
			if (adminUser != null && ("admin".equals(adminUser.getRole()) || "superadmin".equals(adminUser.getRole()))) {
				if (adminUser.getPassword().equals(password)) {
					java.util.Map<String, Object> resp = new java.util.HashMap<>();
					resp.put("username", adminUser.getUsername());
					resp.put("email", adminUser.getEmail());
					resp.put("role", adminUser.getRole());
					resp.put("firstName", adminUser.getFirstName());
					resp.put("lastName", adminUser.getLastName());
					return new ResponseEntity<>(resp, HttpStatus.OK);
				} else {
					return new ResponseEntity<>("Invalid admin credentials", HttpStatus.UNAUTHORIZED);
				}
			} else {
				return new ResponseEntity<>("Admin account not found", HttpStatus.UNAUTHORIZED);
			}
		}

		// Validate non-admin logins (must be contact numbers, digits only)
		if (username.contains("@")) {
			return new ResponseEntity<>("Email-based login is restricted to Gmail (@gmail.com) for Admin only", HttpStatus.UNAUTHORIZED);
		}

		if (!username.matches("\\d+")) {
			return new ResponseEntity<>("Login username must be a contact number (digits only)", HttpStatus.UNAUTHORIZED);
		}

		// 2. STUDENT AUTH: logs in using their personal Contact Number.
		com.tka.sams.api.entity.Student student = studentService.getStudentByContactNo(username);
		if (student != null) {
			if (student.getPassword().equals(password)) {
				java.util.Map<String, Object> resp = new java.util.HashMap<>();
				resp.put("username", student.getContactNo());
				resp.put("role", "student");
				resp.put("name", student.getName());
				resp.put("studentId", student.getId());
				return new ResponseEntity<>(resp, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Invalid student credentials", HttpStatus.UNAUTHORIZED);
			}
		}

		// 3. PARENT AUTH: logs in using the Parent's Contact Number.
		com.tka.sams.api.entity.Student child = studentService.getStudentByParentNo(username);
		if (child != null) {
			if (child.getPassword().equals(password)) {
				java.util.Map<String, Object> resp = new java.util.HashMap<>();
				resp.put("username", child.getParentNo());
				resp.put("role", "parent");
				resp.put("name", "Parent of " + child.getName());
				resp.put("studentId", child.getId());
				return new ResponseEntity<>(resp, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Invalid parent credentials", HttpStatus.UNAUTHORIZED);
			}
		}

		// 4. FACULTY AUTH: standard User lookup (where username is their contact number)
		User user = service.getUserByName(username);
		if (user != null && "faculty".equals(user.getRole())) {
			if (user.getPassword().equals(password)) {
				java.util.Map<String, Object> resp = new java.util.HashMap<>();
				resp.put("username", user.getUsername());
				resp.put("role", "faculty");
				resp.put("firstName", user.getFirstName());
				resp.put("lastName", user.getLastName());
				return new ResponseEntity<>(resp, HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Invalid faculty credentials", HttpStatus.UNAUTHORIZED);
			}
		}

		return new ResponseEntity<>("Invalid contact number or password", HttpStatus.UNAUTHORIZED);
	}

	@CrossOrigin(methods = RequestMethod.POST)
	@PostMapping("/register-user")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		if ("faculty".equals(user.getRole())) {
			if (user.getUsername() == null || !user.getUsername().matches("\\d+")) {
				return new ResponseEntity<>("Faculty username must be a contact number (digits only)", HttpStatus.BAD_REQUEST);
			}
		} else if ("admin".equals(user.getRole())) {
			if (user.getUsername() == null || !user.getUsername().endsWith("@gmail.com")) {
				return new ResponseEntity<>("Admin username must be a Gmail address (ending in @gmail.com)", HttpStatus.BAD_REQUEST);
			}
		}
		
		User registerUser = service.registerUser(user);
		if (registerUser != null) {
			return new ResponseEntity<>("Registered", HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>("Something Went Wrong", HttpStatus.BAD_REQUEST);
		}
	}


	//localhost:8091/user/get-user-by-username/ram
	@GetMapping("/get-user-by-username/{username}")
	public User getUserById(@PathVariable String username) {
		return service.getUserByName(username);

	}

	@GetMapping("/get-all-user")
	public List<User> getAllUser() {
		return service.getAllUser();

	}
	
	@GetMapping("/get-all-admin")
	public List<User> getAllAdmins(){
	return service.getAllAdmins();
	}
	
	@GetMapping("/get-all-faculty")
	public List<User> getAllFaculties(){
	return service.getAllFaculties();
	}

	//localhost:8091/user/delete-user-by-username?username=ram
	
	@DeleteMapping("/delete-user-by-username")
	public ResponseEntity<String> deleteUserById(@RequestParam String username) {
		String result = service.deleteUserById(username);
		if ("deleted".equals(result)) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/update-user")
	public ResponseEntity<?> updateUser(@RequestBody User user) {
		User updated = service.updateUser(user);
		if (updated != null) {
			return new ResponseEntity<>(updated, HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Failed to update user", HttpStatus.BAD_REQUEST);
		}
	}

}
