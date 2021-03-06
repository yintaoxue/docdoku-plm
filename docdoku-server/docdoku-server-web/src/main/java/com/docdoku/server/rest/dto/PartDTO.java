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

package com.docdoku.server.rest.dto;

import java.io.Serializable;
import java.util.List;

/**
 *
 * @author Florent Garin
 */
public class PartDTO implements Serializable{

    private String author;
    private String number;
    private String name;
    private String version;
    private int iteration;
    private String description;
    private List<GeometryDTO> files;
    private boolean standardPart;
    private boolean assembly;
    
    private int partUsageLinkId;
    private List<PartDTO> components;
    private List<CADInstanceDTO> instances;
    private List<InstanceAttributeDTO> attributes;
    public PartDTO(){
        
    }
    
    public PartDTO(String number) {
        this.number=number;
    }

    public String getNumber() {
        return number;
    }

    public boolean isAssembly() {
        return assembly;
    }

    public void setAssembly(boolean assembly) {
        this.assembly = assembly;
    }

    public boolean isStandardPart() {
        return standardPart;
    }

    public int getIteration() {
        return iteration;
    }

    public void setIteration(int iteration) {
        this.iteration = iteration;
    }

    public List<PartDTO> getComponents() {
        return components;
    }

    public String getDescription() {
        return description;
    }

    public List<GeometryDTO> getFiles() {
        return files;
    }

    public String getName() {
        return name;
    }

    public void setComponents(List<PartDTO> components) {
        this.components = components;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setFiles(List<GeometryDTO> files) {
        this.files = files;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPartUsageLinkId() {
        return partUsageLinkId;
    }

    public void setPartUsageLinkId(int partUsageLinkId) {
        this.partUsageLinkId = partUsageLinkId;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public void setStandardPart(boolean standardPart) {
        this.standardPart = standardPart;
    }

    public List<CADInstanceDTO> getInstances() {
        return instances;
    }

    public void setInstances(List<CADInstanceDTO> instances) {
        this.instances = instances;
    }

    public void setAttributes(List<InstanceAttributeDTO> attributes) {
        this.attributes = attributes;
    }

    public List<InstanceAttributeDTO> getAttributes() {
        return attributes;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

}
