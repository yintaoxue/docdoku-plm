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

/**
 *
 * @author Yassine Belouad
 */
public class TagDTO implements Serializable {
    
    private String id;
    private String label;
    private String workspaceId;
    
    public TagDTO(){
    
    }
    
    public TagDTO(String label){
        this.label=label;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public String getId() {
        id= this.label;
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }
    
    
    
}
