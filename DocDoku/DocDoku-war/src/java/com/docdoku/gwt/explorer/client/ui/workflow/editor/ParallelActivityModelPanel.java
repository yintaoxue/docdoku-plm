/*
 * ParallelActivityModelPanel.java
 * 
 * Copyright (c) 2009 Docdoku. All rights reserved.
 * 
 * This file is part of Docdoku.
 * 
 * Docdoku is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Docdoku is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Docdoku.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.docdoku.gwt.explorer.client.ui.workflow.editor;

import com.docdoku.gwt.explorer.client.ui.widget.SpinBox;
import com.docdoku.gwt.explorer.client.ui.widget.SpinBoxEvent;
import com.docdoku.gwt.explorer.client.ui.widget.SpinBoxListener;
import com.docdoku.gwt.explorer.client.ui.workflow.VerticalLink;
import com.docdoku.gwt.explorer.client.ui.workflow.editor.model.ActivityModelModel;
import com.docdoku.gwt.explorer.client.ui.workflow.editor.model.ParallelActivityEvent;
import com.docdoku.gwt.explorer.client.ui.workflow.editor.model.ParallelActivityModelListener;
import com.docdoku.gwt.explorer.client.ui.workflow.editor.model.ParallelActivityModelModel;
import com.docdoku.gwt.explorer.client.ui.workflow.editor.model.TaskModelModel;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.VerticalPanel;

/**
 *
 * @author Emmanuel Nhan {@literal <emmanuel.nhan@insa-lyon.fr>}
 */
public class ParallelActivityModelPanel extends ActivityModelPanel implements ParallelActivityModelListener, SpinBoxListener{

    private VerticalPanel privatePanel;
    private SpinBox spinBox;

    public ParallelActivityModelPanel(ScrollPanelUtil util) {
        super(util);
        spinBox = new SpinBox(1, 1, 1);
        privatePanel = new VerticalPanel();
        mainPanel.add(spinBox);
        mainPanel.add(privatePanel);
        privatePanel.setHorizontalAlignment(HasHorizontalAlignment.ALIGN_CENTER);
        spinBox.addListener(this);


    }

    @Override
    public void setModel(ActivityModelModel model) {
        if (this.model != null){
            ((ParallelActivityModelModel)this.model).removeListener(this);
        }
        if (model instanceof ParallelActivityModelModel) {
            ((ParallelActivityModelModel) model).addListener(this);
            this.model = model;
            setupUi();

        }
        

    }

    private void setupUi() {
        boolean first = true;
        for (TaskModelModel taskModel : model.getTasks()) {
            if (!first) {
                VerticalLink l = new VerticalLink();
                privatePanel.add(l);
            }

            TaskModelPanel taskPanel = new TaskModelPanel(model.getTasks().size() != 1, util);
            privatePanel.add(taskPanel);
            taskPanels.add(taskPanel);
            first = false;
            taskPanel.setModel(taskModel);
            taskPanel.addListener(this);
            
        }
        spinBox.setMaxValue(model.getTasks().size());
        spinBox.setValue(((ParallelActivityModelModel) model).getTaskToComplete());
    }

    public void onTaskRequiredChanged(ParallelActivityEvent event) {
        // nothing to do
    }

    protected  void addTask() {

        VerticalLink l = new VerticalLink();
        privatePanel.add(l);

        TaskModelPanel taskPanel = new TaskModelPanel(true, util);
        privatePanel.add(taskPanel);
        taskPanels.add(taskPanel);
        taskPanel.setModel(model.getTasks().get(model.getTasks().size()-1));
        taskPanel.addListener(this);
        spinBox.setMaxValue(model.getTasks().size());
        updateTaskPanels();

        

    }

    @Override
    protected void removeTask(int position) {
        if (position == 0 ){
            privatePanel.remove(0);
            privatePanel.remove(0);
        }else{
            privatePanel.remove(position*2-1);
            privatePanel.remove(position*2-1);
        }
        taskPanels.remove(position);
        updateTaskPanels();
        spinBox.setMaxValue(model.getTasks().size());
    }

    // TODO : not optimised...
    private void updateTaskPanels(){
        
        for (TaskModelPanel taskPanel : taskPanels) {
            taskPanel.setDeleteOptionEnabled(model.getTasks().size() != 1);
        }
    }

    public void onValueChanged(SpinBoxEvent event) {
        ((ParallelActivityModelModel)model).setTasksToComplete(event.getNewValue());
    }


}