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

package com.docdoku.client.actions;

import com.docdoku.client.data.Config;
import com.docdoku.client.data.Prefs;
import com.docdoku.core.util.FileIO;
import com.docdoku.core.document.DocumentMaster;
import com.docdoku.client.ui.ExplorerFrame;
import com.docdoku.client.localization.I18N;

import java.awt.*;
import javax.swing.*;
import java.awt.event.*;

public class UndoCheckOutAction extends ClientAbstractAction {
    
    public UndoCheckOutAction(ExplorerFrame pOwner) {
        super(I18N.BUNDLE.getString("UndoCheckOut_title"), "/com/docdoku/client/resources/icons/undo.png", pOwner);
        putValue(Action.SHORT_DESCRIPTION, I18N.BUNDLE.getString("UndoCheckOut_short_desc"));
        putValue(Action.LONG_DESCRIPTION,
                I18N.BUNDLE.getString("UndoCheckOut_long_desc"));
        putValue(Action.MNEMONIC_KEY, new Integer(I18N.getCharBundle("UndoCheckOut_mnemonic_key")));
        putValue(Action.ACCELERATOR_KEY,
                KeyStroke.getKeyStroke('Z', Event.CTRL_MASK));
        setLargeIcon("/com/docdoku/client/resources/icons/undo_large.png");
    }
    
    public void actionPerformed(ActionEvent pAE) {
        DocumentMaster docM = mOwner.getSelectedDocM();
        MainController controller = MainController.getInstance();
        try {
            DocumentMaster newDocM = controller.undoCheckOut(docM);
            FileIO.rmDir(Config.getCheckOutFolder(newDocM));
            Prefs.removeDocNode(newDocM);
        } catch (Exception pEx) {
            String message = pEx.getMessage()==null?I18N.BUNDLE
                    .getString("Error_unknown"):pEx.getMessage();
            JOptionPane.showMessageDialog(null,
                    message, I18N.BUNDLE
                    .getString("Error_title"),
                    JOptionPane.ERROR_MESSAGE);
        }
        ExplorerFrame.unselectElementInAllFrame();
    }
}
