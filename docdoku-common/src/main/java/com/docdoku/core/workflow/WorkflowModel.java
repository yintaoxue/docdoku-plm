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

package com.docdoku.core.workflow;

import com.docdoku.core.common.User;
import com.docdoku.core.common.Workspace;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Date;
import java.util.LinkedList;
import javax.persistence.*;

/**
 * This class is the model used to create instances of 
 * <a href="Workflow.html">Workflow</a> attached to documents.
 * 
 * @author Florent Garin
 * @version 1.0, 02/06/08
 * @since   V1.0
 */
@javax.persistence.IdClass(com.docdoku.core.workflow.WorkflowModelKey.class)
@javax.persistence.Entity
public class WorkflowModel implements Serializable, Cloneable {
    

    @Column(length=50)
    @javax.persistence.Id
    private String id="";
    
    @javax.persistence.Column(name = "WORKSPACE_ID", length=50, nullable = false, insertable = false, updatable = false)
    @javax.persistence.Id
    private String workspaceId="";
    
    
    
    @OneToMany(mappedBy = "workflowModel", cascade=CascadeType.ALL, fetch=FetchType.EAGER)
    @OrderBy("step ASC")
    private List<ActivityModel> activityModels=new LinkedList<ActivityModel>();
    
    private String finalLifeCycleState;
    
    
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name="AUTHOR_LOGIN", referencedColumnName="LOGIN"),
        @JoinColumn(name="AUTHOR_WORKSPACE_ID", referencedColumnName="WORKSPACE_ID")
    })
    private User author;
    
    @javax.persistence.Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date creationDate;
    
    @javax.persistence.ManyToOne(optional=false, fetch=FetchType.EAGER)
    private Workspace workspace;
    
    
    public WorkflowModel() {

    }
    
    public WorkflowModel(Workspace pWorkspace, String pId, User pAuthor, String pFinalLifeCycleState) {
        this(pWorkspace,pId,pAuthor,pFinalLifeCycleState,new ArrayList<ActivityModel>());
    }
    
    public WorkflowModel(Workspace pWorkspace, String pId, User pAuthor, String pFinalLifeCycleState, ActivityModel[] pActivityModels) {
        this(pWorkspace, pId, pAuthor, pFinalLifeCycleState,new ArrayList<ActivityModel>(Arrays.asList(pActivityModels)));
    }
    public WorkflowModel(Workspace pWorkspace, String pId, User pAuthor, String pFinalLifeCycleState, List<ActivityModel> pActivityModels) {
        id=pId;
        setWorkspace(pWorkspace);
        author = pAuthor;
        finalLifeCycleState=pFinalLifeCycleState;
        activityModels = pActivityModels;
    }
    
    
    public void addActivityModel(int pStep, ActivityModel pActivity) {
        activityModels.add(pStep, pActivity);
        for(int i=pStep;i<activityModels.size();i++){
            activityModels.get(i).setStep(i);
        }   
    }

    public int numberOfSteps(){
        return activityModels.size();
    }
    
    public ActivityModel removeActivityModel(int pStep) {
        ActivityModel activityModel =activityModels.remove(pStep);
        for(int i=pStep;i<activityModels.size();i++){
            activityModels.get(i).setStep(i);
        }   
        return activityModel;
    }

    public List<ActivityModel> getActivityModels() {
        return activityModels;
    }

    public void setActivityModels(List<ActivityModel> activityModels) {
        this.activityModels = activityModels;
    }

    
    public ActivityModel setActivityModel(int pStep, ActivityModel pActivity) {
        pActivity.setStep(pStep);
        return activityModels.set(pStep, pActivity);
    }

    public Workflow createWorkflow() {
        Workflow workflow = new Workflow(finalLifeCycleState);
        List<Activity> activities = workflow.getActivities();
        for(ActivityModel model:activityModels){
            Activity activity = model.createActivity();
            activity.setWorkflow(workflow);
            activities.add(activity);
        }
        return workflow;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String lifeCycleStateOfStep(int pStep) {
        if(pStep == activityModels.size())
            return finalLifeCycleState;
        return activityModels.get(pStep).getLifeCycleState();
    }

    public ActivityModel getActivityModel(int pIndex) {
        return activityModels.get(pIndex);
    }


    public String getFinalLifeCycleState() {
        return finalLifeCycleState;
    }

    public void setFinalLifeCycleState(String pFinalLifeCycleState) {
        finalLifeCycleState = pFinalLifeCycleState;
    }
    
    public void setAuthor(User pAuthor) {
        author = pAuthor;
    }
    
    public User getAuthor() {
        return author;
    }
    
    public void setCreationDate(Date pCreationDate) {
        creationDate = pCreationDate;
    }
    
    public Date getCreationDate() {
        return creationDate;
    }
    
    public void setWorkspace(Workspace pWorkspace){
        workspace=pWorkspace;
        workspaceId=workspace.getId();
    }
    
    public Workspace getWorkspace(){
        return workspace;
    }
    
    public String getWorkspaceId(){
        return workspaceId;
    }
    
    public WorkflowModelKey getKey() {
        return new WorkflowModelKey(workspaceId, id);
    }
    
    public List<String> getLifeCycle(){
        List<String> lc=new LinkedList<String>();
        for(ActivityModel activityModel:activityModels)
            lc.add(activityModel.getLifeCycleState());
        
        return lc;
    }
    
    public String getId(){
        return id;
    }
    
    @Override
    public boolean equals(Object pObj) {
        if (this == pObj) {
            return true;
        }
        if (!(pObj instanceof WorkflowModel))
            return false;
        WorkflowModel workflow = (WorkflowModel) pObj;
        return ((workflow.id.equals(id)) && (workflow.workspaceId.equals(workspaceId)));
    }
    
    @Override
    public int hashCode() {
        int hash = 1;
	hash = 31 * hash + workspaceId.hashCode();
	hash = 31 * hash + id.hashCode();
	return hash;
    }
    
    @Override
    public String toString() {
        return id;
    }
    
    /**
     * perform a deep clone operation
     */
    @Override
    public WorkflowModel clone() {
        WorkflowModel clone = null;
        try {
            clone = (WorkflowModel) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new InternalError();
        }
        //perform a deep copy
        List<ActivityModel> clonedActivityModels = new LinkedList<ActivityModel>();
        for (ActivityModel activityModel : activityModels) {
            ActivityModel clonedActivityModel=activityModel.clone();
            clonedActivityModel.setWorkflowModel(clone);
            clonedActivityModels.add(clonedActivityModel);
        }
        clone.activityModels = clonedActivityModels;
        
        if(creationDate!=null)
            clone.creationDate = (Date) creationDate.clone();
        return clone;
    }

}
