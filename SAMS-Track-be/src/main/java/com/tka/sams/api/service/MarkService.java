package com.tka.sams.api.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tka.sams.api.dao.MarkDao;
import com.tka.sams.api.entity.Mark;

@Service
public class MarkService {

    @Autowired
    private MarkDao dao;

    public Mark createMark(Mark mark) {
        return dao.createMark(mark);
    }

    public Mark updateMark(Mark mark) {
        return dao.updateMark(mark);
    }

    public String deleteMark(long id) {
        return dao.deleteMark(id);
    }

    public Mark getMarkById(long id) {
        return dao.getMarkById(id);
    }

    public List<Mark> getAllMarks() {
        return dao.getAllMarks();
    }

    public List<Mark> getMarksByStudent(long studentId) {
        return dao.getMarksByStudent(studentId);
    }
}
