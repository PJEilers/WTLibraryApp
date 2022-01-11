package com.WT.LibraryApp.Exemplaar;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExemplaarService {

	@Autowired
	private IExemplaarRepository repository;

	public Exemplaar maakExemplaarAan(Exemplaar exemplaar) {
		return repository.save(exemplaar);
	}

	public List<Exemplaar> vindAlleExemplaren() {
		return repository.findAll();
	}

	public void opslaanExemplaar(Exemplaar exemplaar) {
		repository.save(exemplaar);

	}

}