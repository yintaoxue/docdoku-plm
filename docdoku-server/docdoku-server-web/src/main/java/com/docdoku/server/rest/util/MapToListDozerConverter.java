/*
 * DocDoku, Professional Open Source
 * Copyright 2006, 2007, 2008, 2009, 2010, 2011, 2012 DocDoku SARL
 *
 * This file is part of DocDoku.
 *
 * DocDoku is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DocDoku is distributed in the hope that it will be useful,  
 * but WITHOUT ANY WARRANTY; without even the implied warranty of  
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  
 * GNU General Public License for more details.  
 *  
 * You should have received a copy of the GNU General Public License  
 * along with DocDoku.  If not, see <http://www.gnu.org/licenses/>.  
 */
package com.docdoku.server.rest.util;

import com.docdoku.core.meta.InstanceAttribute;
import com.docdoku.server.rest.dto.DocumentIterationDTO;
import com.docdoku.server.rest.dto.InstanceAttributeDTO;
import java.lang.String;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.dozer.DozerConverter;
import org.dozer.Mapper;
import org.dozer.MapperAware;

/**
 *
 * @author Yassine Belouad
 */
public class MapToListDozerConverter extends DozerConverter<Map, List> implements MapperAware {

    private Mapper mapper;

    @Override
    public void setMapper(Mapper mapper) {
        this.mapper = mapper;
    }

    public MapToListDozerConverter() {
        super(Map.class, List.class);
    }

    @Override
    public List convertTo(Map source, List destination) {
        if (source==null)
            return null;
        
        List<InstanceAttributeDTO> convertedList = new ArrayList<InstanceAttributeDTO>();
        for (Object object : source.values()) {
            InstanceAttributeDTO mappedItem = mapper.map(object, InstanceAttributeDTO.class);
            convertedList.add(mappedItem);
        }
        return convertedList;
    }

    @Override
    public Map convertFrom(List source, Map destination) {
        if (source==null)
            return null;
        
        Map<String, InstanceAttribute> convertedMap = new HashMap<String, InstanceAttribute>();
        for (Object object : source) {
            InstanceAttribute mappedItem = mapper.map(object, InstanceAttribute.class);
            convertedMap.put(mappedItem.getName(), mappedItem);
        }
        return convertedMap;
    }
}