package com.tka.sams.api.dao;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.tka.sams.api.entity.Mark;

@Repository
public class MarkDao {

    @Autowired
    private SessionFactory factory;

    public Mark createMark(Mark mark) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();
            session.save(mark);
            transaction.commit();
            return mark;
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

    public Mark updateMark(Mark mark) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();
            session.update(mark);
            transaction.commit();
            return mark;
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

    public String deleteMark(long id) {
        Session session = null;
        Transaction transaction = null;
        String msg = "not exists";
        try {
            session = factory.openSession();
            transaction = session.beginTransaction();
            Mark mark = session.get(Mark.class, id);
            if (mark != null) {
                session.delete(mark);
                transaction.commit();
                msg = "deleted";
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            msg = "error";
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return msg;
    }

    public Mark getMarkById(long id) {
        Session session = null;
        try {
            session = factory.openSession();
            return session.get(Mark.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<Mark> getAllMarks() {
        Session session = null;
        try {
            session = factory.openSession();
            return session.createQuery("from Mark", Mark.class).list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<Mark> getMarksByStudent(long studentId) {
        Session session = null;
        try {
            session = factory.openSession();
            return session.createQuery("from Mark m where m.student.id = :studentId", Mark.class)
                    .setParameter("studentId", studentId)
                    .list();
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
