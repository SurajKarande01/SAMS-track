package com.tka.sams.api.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.tka.sams.api.entity.AdminDeletionRequest;

@Repository
public class AdminDeletionRequestDao {

	@Autowired
	private SessionFactory factory;

	public AdminDeletionRequest createRequest(AdminDeletionRequest request) {
		Session session = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			session.save(request);
			transaction.commit();
			return request;
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}

	public List<AdminDeletionRequest> getAllPendingRequests() {
		Session session = null;
		try {
			session = factory.openSession();
			return session.createQuery("from AdminDeletionRequest where status = 'PENDING'", AdminDeletionRequest.class).list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}

	public AdminDeletionRequest getById(Long id) {
		Session session = null;
		try {
			session = factory.openSession();
			return session.get(AdminDeletionRequest.class, id);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}

	public AdminDeletionRequest updateRequest(AdminDeletionRequest request) {
		Session session = null;
		Transaction transaction = null;
		try {
			session = factory.openSession();
			transaction = session.beginTransaction();
			session.update(request);
			transaction.commit();
			return request;
		} catch (Exception e) {
			if (transaction != null) {
				transaction.rollback();
			}
			e.printStackTrace();
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}
	}
}
