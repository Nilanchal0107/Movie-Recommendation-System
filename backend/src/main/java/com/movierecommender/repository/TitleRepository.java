package com.movierecommender.repository;

import com.movierecommender.entity.Title;
import com.movierecommender.entity.enums.CertificationBand;
import com.movierecommender.entity.enums.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TitleRepository extends JpaRepository<Title, Long> {
    Optional<Title> findByTmdbId(Long tmdbId);
    boolean existsByTmdbId(Long tmdbId);

    /**
     * Hard-filter candidates for matching: returns titles within the required
     * certification band ceiling, filtered by media type, and the given language.
     * Genre and keyword filtering (JSON_OVERLAPS) is done in-memory after this
     * initial DB fetch since MySQL's JSON functions don't benefit from normal indexes.
     */
    @Query("""
        SELECT t FROM Title t
        WHERE t.mediaType = :mediaType
          AND (t.certificationBand IS NULL OR t.certificationBand <= :certBand)
          AND t.originalLanguage IN :languages
        ORDER BY t.voteAverage DESC
        """)
    List<Title> findCandidates(
        @Param("mediaType") MediaType mediaType,
        @Param("certBand") CertificationBand certBand,
        @Param("languages") List<String> languages
    );
}
