package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioBookRepository extends JpaRepository<AudioBook, Long> {
    boolean existsByTitle(String name);
    Page<AudioBook> findAllByOrderByListenCountDesc(Pageable pageable);
    @Query("SELECT ab FROM AudioBook ab LEFT JOIN ab.likes l GROUP BY ab ORDER BY COUNT(l) DESC")
    Page<AudioBook> findTopByLikeCount(Pageable pageable);
    @Query("SELECT ab FROM AudioBook ab LEFT JOIN ab.ratings r GROUP BY ab ORDER BY AVG(r.value) DESC")
    Page<AudioBook> findTopByAverageRating(Pageable pageable);
    @Query("SELECT DISTINCT a FROM AudioBook a " +
            "LEFT JOIN a.author author " +
            "LEFT JOIN a.categories category " +
            "WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(author.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<AudioBook> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    @Query("SELECT DISTINCT a FROM AudioBook a " +
            "JOIN a.categories c " +
            "WHERE c.id = :categoryId")
    Page<AudioBook> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

}
