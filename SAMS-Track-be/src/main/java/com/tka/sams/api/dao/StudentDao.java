package com.tka.sams.api.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.tka.sams.api.entity.Student;

@Repository

public class StudentDao {

	@Autowired
	private SessionFactory factory;

	public List<Student> getAllStudentsById(List<Long> studentIds) {
		Session session = null;
		List<Student> students = null;
		try {
			session = factory.openSession();
			students = session.byMultipleIds(Student.class).multiLoad(studentIds);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return students;
	}

	public List<Student> getAllStudents() {
		Session session = null;
		List<Student> list = null;
		try {
			session = factory.openSession();

			Criteria criteria = session.createCriteria(Student.class);
			list = criteria.list();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return list;
	}

	public Student createStudent(Student student) {
		Session session = null;
		Student s = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			session.save(student);
			transaction.commit();
			s = student;
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return s;
	}

	public Student getStudentsById(long id) {
		Session session = null;
		Student student = null;
		try {
			session = factory.openSession();
			student = session.get(Student.class, id);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return student;
	}

	public Student updateStudent(Student studentDetails) {
		Session session = null;
		Student s = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			Student existing = session.get(Student.class, studentDetails.getId());
			if (existing != null) {
				// Check if it's a full update or partial update
				if (studentDetails.getUsername() != null) {
					// Full update: copy all fields including subjects
					existing.setName(studentDetails.getName());
					existing.setEmail(studentDetails.getEmail());
					existing.setUsername(studentDetails.getUsername());
					existing.setContactNo(studentDetails.getContactNo());
					existing.setParentNo(studentDetails.getParentNo());
					if (studentDetails.getPassword() != null && !studentDetails.getPassword().trim().isEmpty()) {
						existing.setPassword(studentDetails.getPassword());
					}
					existing.setAddress(studentDetails.getAddress());
					if (studentDetails.getSubjects() != null) {
						existing.setSubjects(new java.util.HashSet<>(studentDetails.getSubjects()));
					}
				} else {
					// Partial update: copy only provided non-null fields
					if (studentDetails.getName() != null) {
						existing.setName(studentDetails.getName());
					}
					if (studentDetails.getEmail() != null) {
						existing.setEmail(studentDetails.getEmail());
					}
					if (studentDetails.getContactNo() != null) {
						existing.setContactNo(studentDetails.getContactNo());
					}
					if (studentDetails.getParentNo() != null) {
						existing.setParentNo(studentDetails.getParentNo());
					}
					if (studentDetails.getPassword() != null && !studentDetails.getPassword().trim().isEmpty()) {
						existing.setPassword(studentDetails.getPassword());
					}
					if (studentDetails.getAddress() != null) {
						existing.setAddress(studentDetails.getAddress());
					}
				}
				session.update(existing);
				s = existing;
			} else {
				session.update(studentDetails);
				s = studentDetails;
			}
			transaction.commit();
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return s;
	}

	public String deleteStudent(long id) {
		Session session = null;
		String msg = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			Student student = session.get(Student.class, id);

			if (student != null) {
				session.createQuery("delete from Mark where student.id = :id").setParameter("id", id).executeUpdate();
				session.createNativeQuery("delete from attendance_students where student_id = :id").setParameter("id", id).executeUpdate();
				session.createNativeQuery("delete from student_subjects where student_id = :id").setParameter("id", id).executeUpdate();
				session.delete(student);
				transaction.commit();
				msg = "Deleted !!";
			} else {
				msg = "Not Exists !!";
			}
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return msg;
	}

	public Student getStudentByContactNo(String contactNo) {
		Session session = null;
		try {
			session = factory.openSession();
			List<Student> list = session.createQuery("from Student where contactNo = :contactNo", Student.class)
					.setParameter("contactNo", contactNo)
					.list();
			return list.isEmpty() ? null : list.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}

	public Student getStudentByParentNo(String parentNo) {
		Session session = null;
		try {
			session = factory.openSession();
			List<Student> list = session.createQuery("from Student where parentNo = :parentNo", Student.class)
					.setParameter("parentNo", parentNo)
					.list();
			return list.isEmpty() ? null : list.get(0);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}

}

