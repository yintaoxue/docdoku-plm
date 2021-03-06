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

package com.docdoku.core.document;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlTransient;

/**
 * This is a link class used to connect two DocumentIteration objects.
 * Documents are not linked directly but rather through this class to get
 * a loosely coupling.  
 * 
 * @author Florent Garin
 * @version 1.0, 02/06/08
 * @since   V1.0
 */
@javax.persistence.IdClass(com.docdoku.core.document.DocumentToDocumentLinkKey.class)
@javax.persistence.Entity
public class DocumentToDocumentLink implements Serializable, Cloneable{
    
    
    
    @ManyToOne(optional=false, fetch=FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name="FROMDOCUMENT_ITERATION", referencedColumnName="ITERATION"),
        @JoinColumn(name="FROMDOCUMENT_DOCUMENTMASTER_ID", referencedColumnName="DOCUMENTMASTER_ID"),
        @JoinColumn(name="FROMDOCUMENT_DOCUMENTMASTER_VERSION", referencedColumnName="DOCUMENTMASTER_VERSION"),
        @JoinColumn(name="FROMDOCUMENT_WORKSPACE_ID", referencedColumnName="WORKSPACE_ID")
    })
    private DocumentIteration fromDocument;
    
    @Column(name = "FROMDOCUMENT_ITERATION", nullable = false, insertable = false, updatable = false)
    @javax.persistence.Id
    private int fromDocumentIteration;
    
    @Column(name = "FROMDOCUMENT_DOCUMENTMASTER_ID", length=50, nullable = false, insertable = false, updatable = false)
    @javax.persistence.Id
    private String fromDocumentDocumentMasterId="";
    
    @Column(name = "FROMDOCUMENT_DOCUMENTMASTER_VERSION", length=10, nullable = false, insertable = false, updatable = false)
    @javax.persistence.Id
    private String fromDocumentDocumentMasterVersion="";
    
    @Column(name = "FROMDOCUMENT_WORKSPACE_ID", length=50, nullable = false, insertable = false, updatable = false)
    @javax.persistence.Id
    private String fromDocumentWorkspaceId="";
    
    
    
    @Column(name = "TODOCUMENT_ITERATION")
    @javax.persistence.Id
    private int toDocumentIteration;

    @Column(name = "TODOCUMENT_DOCUMENTMASTER_ID", length=50)
    @javax.persistence.Id
    private String toDocumentDocumentMasterId="";

    @Column(name = "TODOCUMENT_DOCUMENTMASTER_VERSION", length=10)
    @javax.persistence.Id
    private String toDocumentDocumentMasterVersion="";

    @Column(name = "TODOCUMENT_WORKSPACE_ID", length=50)
    @javax.persistence.Id
    private String toDocumentWorkspaceId="";
    
    private String comment;
    
    
    public DocumentToDocumentLink() {
    }
    
    public DocumentToDocumentLink(DocumentIteration pFromDocument, DocumentIteration pToDocument, String pComment){
        setFromDocument(pFromDocument);
        setToDocument(pToDocument);
        comment=pComment;
    }
    
    public DocumentToDocumentLink(DocumentIteration pFromDocument, DocumentIterationKey pToDocumentKey){
        setFromDocument(pFromDocument);
        setToDocument(pToDocumentKey);
    }

    public DocumentIterationKey getToDocumentKey(){
        return new DocumentIterationKey(toDocumentWorkspaceId,toDocumentDocumentMasterId,toDocumentDocumentMasterVersion,toDocumentIteration);
    }
    
    public String getComment() {
        return comment;
    }

    @XmlTransient
    public DocumentIteration getFromDocument() {
        return fromDocument;
    }

    public int getFromDocumentIteration() {
        return fromDocumentIteration;
    }

    public String getFromDocumentDocumentMasterId() {
        return fromDocumentDocumentMasterId;
    }

    public String getFromDocumentDocumentMasterVersion() {
        return fromDocumentDocumentMasterVersion;
    }

    public String getFromDocumentWorkspaceId() {
        return fromDocumentWorkspaceId;
    }

    public int getToDocumentIteration() {
        return toDocumentIteration;
    }

    public String getToDocumentDocumentMasterId() {
        return toDocumentDocumentMasterId;
    }

    public String getToDocumentDocumentMasterVersion() {
        return toDocumentDocumentMasterVersion;
    }

    public String getToDocumentWorkspaceId() {
        return toDocumentWorkspaceId;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setToDocumentIteration(int toDocumentIteration) {
        this.toDocumentIteration = toDocumentIteration;
    }

    public void setToDocumentDocumentMasterId(String toDocumentDocumentMasterId) {
        this.toDocumentDocumentMasterId = toDocumentDocumentMasterId;
    }

    public void setToDocumentDocumentMasterVersion(String toDocumentDocumentMasterVersion) {
        this.toDocumentDocumentMasterVersion = toDocumentDocumentMasterVersion;
    }

    public void setToDocumentWorkspaceId(String toDocumentWorkspaceId) {
        this.toDocumentWorkspaceId = toDocumentWorkspaceId;
    }
    

    
    public void setFromDocument(DocumentIteration pFromDocument) {
        fromDocument = pFromDocument;
        fromDocumentIteration=fromDocument.getIteration();
        fromDocumentDocumentMasterId=fromDocument.getDocumentMasterId();
        fromDocumentDocumentMasterVersion=fromDocument.getDocumentMasterVersion();
        fromDocumentWorkspaceId=fromDocument.getWorkspaceId();
    }
    
    public void setToDocument(DocumentIteration pToDocument) {
        toDocumentIteration=pToDocument.getIteration();
        toDocumentDocumentMasterId=pToDocument.getDocumentMasterId();
        toDocumentDocumentMasterVersion=pToDocument.getDocumentMasterVersion();
        toDocumentWorkspaceId=pToDocument.getWorkspaceId();
    }
    
    public void setToDocument(DocumentIterationKey pToDocumentKey) {
        toDocumentIteration=pToDocumentKey.getIteration();
        toDocumentDocumentMasterId=pToDocumentKey.getDocumentMasterId();
        toDocumentDocumentMasterVersion=pToDocumentKey.getDocumentMasterVersion();
        toDocumentWorkspaceId=pToDocumentKey.getWorkspaceId();
    }
    
    @Override
    public String toString() {
        return toDocumentDocumentMasterId  + "-" + toDocumentDocumentMasterVersion + "-" + toDocumentIteration;
    }
    
    @Override
    public boolean equals(Object pObj) {
        if (this == pObj) {
            return true;
        }
        if (!(pObj instanceof DocumentToDocumentLink))
            return false;
        DocumentToDocumentLink link = (DocumentToDocumentLink) pObj;
        return ((link.fromDocumentWorkspaceId.equals(fromDocumentWorkspaceId))
        && (link.fromDocumentDocumentMasterId.equals(fromDocumentDocumentMasterId))
        && (link.fromDocumentDocumentMasterVersion.equals(fromDocumentDocumentMasterVersion))
        && (link.fromDocumentIteration==fromDocumentIteration)
        && (link.toDocumentWorkspaceId.equals(toDocumentWorkspaceId))
        && (link.toDocumentDocumentMasterId.equals(toDocumentDocumentMasterId))
        && (link.toDocumentDocumentMasterVersion.equals(toDocumentDocumentMasterVersion))
        && (link.toDocumentIteration==toDocumentIteration));
    }

    @Override
    public int hashCode() {
        int hash = 1;
	hash = 31 * hash + fromDocumentWorkspaceId.hashCode();
	hash = 31 * hash + fromDocumentDocumentMasterId.hashCode();
        hash = 31 * hash + fromDocumentDocumentMasterVersion.hashCode();
        hash = 31 * hash + fromDocumentIteration;
        hash = 31 * hash + toDocumentWorkspaceId.hashCode();
	hash = 31 * hash + toDocumentDocumentMasterId.hashCode();
        hash = 31 * hash + toDocumentDocumentMasterVersion.hashCode();
        hash = 31 * hash + toDocumentIteration;
	return hash;
    }
    

    @Override
    public DocumentToDocumentLink clone() {
        DocumentToDocumentLink clone = null;
        try {
            clone = (DocumentToDocumentLink) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new InternalError();
        }
        
        return clone;
    }
}
