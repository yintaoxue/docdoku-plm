/*
 * DocDoku, Professional Open Source
 * Copyright 2006, 2007, 2008, 2009 DocDoku SARL
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
package com.docdoku.gwt.explorer.client.actions;

import com.docdoku.gwt.explorer.client.data.ServiceLocator;
import com.docdoku.gwt.explorer.client.ui.ExplorerPage;
import com.docdoku.gwt.explorer.client.util.HTMLUtil;
import com.docdoku.gwt.explorer.common.MasterDocumentTemplateDTO;
import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 *
 * @author Florent GARIN
 */
public class UploadCompleteTemplateFileCommand implements Action {

    private ExplorerPage m_mainPage;

    public UploadCompleteTemplateFileCommand(ExplorerPage mainPage) {
        m_mainPage = mainPage;
    }

    public void execute(Object... userObject) {
        AsyncCallback<MasterDocumentTemplateDTO> callback = new AsyncCallback<MasterDocumentTemplateDTO>() {

            public void onSuccess(MasterDocumentTemplateDTO template) {
                m_mainPage.setEditTemplateFiles(template.getFiles());
            }

            public void onFailure(Throwable caught) {
                HTMLUtil.showError(caught.getMessage());
            }
        };
        MasterDocumentTemplateDTO template = m_mainPage.getLastOpenedMDocTemplate();
        ServiceLocator.getInstance().getExplorerService().getMDocTemplate(template.getWorkspaceId(), template.getId(), callback);

    }
}