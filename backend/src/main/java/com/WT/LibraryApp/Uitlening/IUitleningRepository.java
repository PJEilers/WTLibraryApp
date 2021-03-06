package com.WT.LibraryApp.Uitlening;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.WT.LibraryApp.Exemplaar.Exemplaar;

public interface IUitleningRepository extends JpaRepository<Uitlening, Integer>{
	Optional<Uitlening> findByExemplaarId(int exemplaarId);
	Optional<Uitlening> findByExemplaarIdAndEindDatum(int exemplaarId, Date eindDatum);
	List<Uitlening> findByPersoonId(int persoonId);
	int countByExemplaar(Exemplaar exemplaar);
}
