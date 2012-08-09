package com.docdoku.server.rest.dto;

/**
 * Created by Nicolas Zozol
 * Date: 07/08/12
 */
public class WorkspaceDTO {


    DocumentMasterTemplateDTO[] templates;
    String [] documentTypes;
    UserDTO [] users;
    TagDTO[] tags;
    String id;

    public DocumentMasterTemplateDTO[] getTemplates() {
        return templates;
    }

    public void setTemplates(DocumentMasterTemplateDTO[] templates) {
        this.templates = templates;
    }

    public String[] getDocumentTypes() {
        return documentTypes;
    }

    public void setDocumentTypes(String[] documentTypes) {
        this.documentTypes = documentTypes;
    }

    public UserDTO[] getUsers() {
        return users;
    }

    public void setUsers(UserDTO[] users) {
        this.users = users;
    }

    public TagDTO[] getTags() {
        return tags;
    }

    public void setTags(TagDTO[] tags) {
        this.tags = tags;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
