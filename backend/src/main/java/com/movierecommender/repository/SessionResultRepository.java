package com.movierecommender.repository;

import com.movierecommender.entity.SessionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionResultRepository extends JpaRepository<SessionResult, Long> {
    List<SessionResult> findBySessionIdOrderByRankAsc(Long sessionId);
    List<SessionResult> findBySessionIdAndRankBetweenOrderByRankAsc(Long sessionId, int rankStart, int rankEnd);
    List<Long> findTitleIdsBySessionId(Long sessionId);
}
