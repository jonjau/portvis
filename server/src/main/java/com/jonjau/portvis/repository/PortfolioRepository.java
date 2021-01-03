package com.jonjau.portvis.repository;

import com.jonjau.portvis.repository.entity.Portfolio;
import com.jonjau.portvis.repository.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findAllByUser(User user);
}
