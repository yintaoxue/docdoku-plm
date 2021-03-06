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

package com.docdoku.core.meta;

import java.util.Date;
import javax.persistence.Entity;

/**
 * Defines a date type custom attribute of a document.
 * 
 * @author Florent Garin
 * @version 1.0, 02/06/08
 * @since   V1.0
 */
@Entity
public class InstanceDateAttribute extends InstanceAttribute{

    
    @javax.persistence.Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date dateValue;
    
    public InstanceDateAttribute() {
    }
    
    public InstanceDateAttribute(String pName, Date pValue) {
        super(pName);
        setDateValue(pValue);
    }

    @Override
    public Date getValue() {
        return dateValue;
    }

    public Date getDateValue() {
        return dateValue;
    }

    public void setDateValue(Date dateValue) {
        this.dateValue = dateValue;
    }
    
    
    /**
     * perform a deep clone operation
     */
    @Override
    public InstanceDateAttribute clone() {
        InstanceDateAttribute clone = null;
        clone = (InstanceDateAttribute) super.clone();
        
        if(dateValue!=null)
            clone.dateValue = (Date) dateValue.clone();
        return clone;
    }

    @Override
    public boolean setValue(Object pValue) {
        if(pValue instanceof Date){
            dateValue=(Date)pValue;
            return true;
        }else
            return false;
    }

}
