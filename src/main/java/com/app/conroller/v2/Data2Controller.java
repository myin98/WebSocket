package com.app.conroller.v2;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.mapper.Temp1Mapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/v2")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://192.168.0.74:5500")
public class Data2Controller {

	private final Temp1Mapper tm;

	private final SimpMessagingTemplate messagingTemplate;

	@PostMapping(value = {"/findList", "/findList/{accept:[0-1]}"})
	public List<Map> findList(@PathVariable(name = "accept", required = false) String accept) {
		log.info("Accept : {}", accept);
		return tm.findList(accept);
	}

	@PostMapping("/save")
	public Map save(@RequestParam Map map) {
		log.info("Map : {}", map);
		tm.save(map);
		return map;
	}

	@PostMapping("/detail/{no:[0-9]+}")
	public Map detail(@PathVariable(name = "no") int no) {
		log.info("No : {}", no);
		Map map = tm.findOne(no);
		log.info("Map : {}", map);
		if (map != null) {
			map.put("status", true);
		} else {
			map = new HashMap<>();
			map.put("status", false);
		}
		return map;
	}

	@PostMapping("/detail/{no:[0-9]+}/{accept:[0-1]}")
	public Map detail(@PathVariable(name = "no") int no, @PathVariable(name = "accept") String accept, Map map) {
		log.info("No : {}, Accept : {}", no, accept);
		map.put("status", false);
		if (accept != null) {
			map.put("no", no);
			map.put("accept", accept);
			if (tm.accept(map) == 1) {
				map = tm.findOne(no);
				map.put("status", true);
				log.info("Map : {}", map);

				//소켓으로 리스트쪽 화면에 알림 보내기
				messagingTemplate.convertAndSend("/topic/accept", map);
			}
		}
		return map;
	}

	@PostMapping("/edit")
	public Map edit(@RequestParam Map map) {
		log.info("Map : {}", map);
		map.put("status", false);
		if (tm.edit(map) == 1) {
			map = tm.findOne(Integer.parseInt(map.get("no").toString()));
			map.put("status", true);
		}
		return map;
	}

}