package com.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.app.dto.FileDTO;

@Mapper
public interface JsonMapper {

	@Select("select #{no} as no")
	public int test(int no);
	
	@Select("SELECT * FROM files WHERE type = ${type} AND del = 0")
	public List<FileDTO> findByType(int type);
	
	@Update("UPDATE files SET del = 1 WHERE no = ${no}")
	public int delete(int no);
	
	@Update("UPDATE files SET cnt = cnt + 1 WHERE no = ${no}")
	public int cnt(int no);
	
}
