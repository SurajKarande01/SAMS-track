package com.tka.sams.api.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.tka.sams.api.entity.Subject;

@Repository
public class SubjectDao {
	@Autowired
	private SessionFactory factory;

	public Subject getSubjectById(long subjectId) {
		Session session = null;
		Subject subject = null;
		try {
			session = factory.openSession();
			subject = session.get(Subject.class, subjectId);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return subject;
	}

	public List<Subject> getAllSubjects() {
		Session session = null;
		List<Subject> list = null;
		try {
			session = factory.openSession();

			Criteria criteria = session.createCriteria(Subject.class);
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

	public Subject createSubject(Subject subject) {
		Session session = null;
		Subject sub = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();

			Criteria criteria = session.createCriteria(Subject.class);
			criteria.add(Restrictions.eq("name", subject.getName()));
			List<Subject> list = criteria.list();
			if (list.isEmpty()) {
				session.save(subject);
				transaction.commit();
				sub = subject;
			} else {
				transaction.rollback();
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
		return sub;
	}

	public Subject updateSubject(Subject subjectDetails) {
		Session session = null;
		Subject sub = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			session.update(subjectDetails);
			transaction.commit();
			sub = subjectDetails;
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
		return sub;
	}

	public String deleteSubject(long id) { //10
		Session session = null;
		String msg = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			Subject subject = session.get(Subject.class, id);
			
			if(subject!=null) {
				session.delete(subject);
				transaction.commit();
				msg = "deleted";
			}else {
				transaction.rollback();
				msg="not exists";
			}
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			msg = null;
			e.printStackTrace();
		} finally {
			if (session != null) {
				session.close();
			}
		}
		return msg;
	}
}
