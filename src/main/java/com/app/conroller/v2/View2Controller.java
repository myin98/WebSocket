package com.app.conroller.v2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/v2")
public class View2Controller {

	@GetMapping("/findList")
	public String findList() {
		return "v2/list";
	}

	@GetMapping("/new")
	public String newPage() {
		return "v2/new";
	}

	@GetMapping("/detail/{no:[0-9]+}")
	public String detail(@PathVariable(name="no") int no) {
		log.info("NO : {}", no);
		return "v2/detail";
	}

}
