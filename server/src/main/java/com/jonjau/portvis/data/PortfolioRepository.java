package com.jonjau.portvis.data;

import com.jonjau.portvis.data.model.Portfolio;
import com.jonjau.portvis.data.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findAllByUser(User user);
}
