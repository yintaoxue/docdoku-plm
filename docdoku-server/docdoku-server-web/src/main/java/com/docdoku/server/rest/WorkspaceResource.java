package com.docdoku.server.rest;

import com.docdoku.core.common.User;
import com.docdoku.core.document.DocumentMaster;
import com.docdoku.core.document.SearchQuery;
import com.docdoku.core.security.UserGroupMapping;
import com.docdoku.core.services.ApplicationException;
import com.docdoku.core.services.IDocumentManagerLocal;
import com.docdoku.server.rest.dto.DocumentMasterTemplateDTO;
import com.docdoku.server.rest.dto.TagDTO;
import com.docdoku.server.rest.dto.UserDTO;
import com.docdoku.server.rest.dto.WorkspaceDTO;
import org.dozer.DozerBeanMapperSingletonWrapper;
import org.dozer.Mapper;

import javax.annotation.PostConstruct;
import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.*;
import java.util.Set;
import java.util.TreeSet;

/**
 * Created by Nicolas Zozol.
 * Date: 08/08/12
 */
@Stateless
@Path("workspaces")
@DeclareRoles(UserGroupMapping.REGULAR_USER_ROLE_ID)
@RolesAllowed(UserGroupMapping.REGULAR_USER_ROLE_ID)
public class WorkspaceResource {

    @EJB
    private IDocumentManagerLocal workspaceService;

    private Mapper mapper;


    @PostConstruct
    public void init() {
        mapper = DozerBeanMapperSingletonWrapper.getInstance();
    }


    @GET
    @Produces("application/json;charset=UTF-8")
    @Path("{workspaceId}/find/documents/")
    //TODO use ?reference = for something matching the docId+title
    public Set<String> findDocumentById(@PathParam("workspaceId") String workspaceId, @QueryParam("id")String documentId){

        Set<String> result = new TreeSet<String>();
        SearchQuery queryId = new SearchQuery();
        queryId.setWorkspaceId(workspaceId);
        queryId.setDocMId(documentId);

        SearchQuery queryTitle = new SearchQuery();
        queryTitle.setWorkspaceId(workspaceId);
        queryTitle.setTitle(documentId);

        try {
            DocumentMaster[] documents = workspaceService.searchDocumentMasters(queryId);
            for (DocumentMaster doc : documents){
                result.add(doc.getId());
                //doc.get
            }
            

            /*documents = workspaceService.searchDocumentMasters(queryTitle);
            for (DocumentMaster doc : documents){
                result.add(doc.getId());
            }*/
        } catch (ApplicationException e) {
            throw new ClientException(e);
        }catch (Exception e){
            throw new WebApplicationException(e);
        }
        return result;
        
    }
    

    @GET
    @Produces("application/json;charset=UTF-8")
    @Path("{workspaceId}")
    public WorkspaceDTO getWorkspace(@PathParam("workspaceId") String workspaceId) {

        WorkspaceDTO dto = new WorkspaceDTO();

        try {
            //Users in workspace
            User[] users = workspaceService.getUsers(workspaceId);
            UserDTO[] usersDTO = new UserDTO[users.length];
            //mapping users
            for (int i = 0 ; i < users.length ; i++ ){
                User current = users[i];
                UserDTO author = mapper.map(current, UserDTO.class);
                usersDTO[i] = author;
            }
            dto.setUsers(usersDTO);

            //Tags
            TagResource tagResource = new TagResource();
            tagResource.documentService = this.workspaceService;
            TagDTO[] tags =tagResource.getTagsInWorkspace(workspaceId);
            dto.setTags(tags);

            //Templates
            DocumentTemplateResource templateResource = new DocumentTemplateResource();
            templateResource.setDocumentService(this.workspaceService);
            DocumentMasterTemplateDTO[] templates = templateResource.getDocumentMasterTemplates(workspaceId);
            dto.setTemplates(templates);

            //document Types
            Set<String> documentTypesSet = new TreeSet<String>();//types sorted by String comparator
            for (DocumentMasterTemplateDTO template : templates){
                documentTypesSet.add(template.getDocumentType());
            }
            String[]documentTypes = new String[documentTypesSet.size()];
            int i = 0;
            for( String documentType : documentTypesSet ){
                documentTypes[i] = documentType;
                i++;
            }
            dto.setDocumentTypes(documentTypes);
            dto.setId(workspaceId);

        } catch (ApplicationException e) {
            throw new ClientException(e);
        }catch (Exception e){
            throw new WebApplicationException(e);
        }

        return dto;
    }



}
