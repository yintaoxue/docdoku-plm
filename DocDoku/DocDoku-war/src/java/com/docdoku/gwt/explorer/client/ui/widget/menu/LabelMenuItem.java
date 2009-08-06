/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.docdoku.gwt.explorer.client.ui.widget.menu;

import com.docdoku.gwt.explorer.client.ui.widget.*;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.Label;

/**
 *
 * @author Emmanuel Nhan
 */
public class LabelMenuItem extends AbstractMenuItem implements ClickHandler{

    private Label label ;

    public LabelMenuItem(String text) {
        label = new Label(text) ;
        initWidget(label);
        label.addClickHandler(this);
        setStyleName("itemMenu-notSelected");
    }

    @Override
    protected boolean beforeCommandCall() {
        return true ;
    }

    @Override
    protected void afterCommandCall() {       
    }

    public void setSelected(boolean selected) {
        if(selected){
            setStyleName("itemMenu-selected");
        }else{
            setStyleName("itemMenu-notSelected");
        }
    }

    public void onClick(ClickEvent event) {
        activate();
    }

}