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

import java.awt.event.ActionEvent;

import javax.swing.Action;

import com.docdoku.client.localization.I18N;
import com.docdoku.client.ui.ExplorerFrame;

public class DisplayShortcutsAction extends ClientAbstractAction {
    
    public DisplayShortcutsAction(ExplorerFrame pOwner) {
        super(I18N.BUNDLE.getString("DisplayShortcuts_title"), "/com/docdoku/client/resources/icons/signpost.png", pOwner);
        putValue(Action.SHORT_DESCRIPTION, I18N.BUNDLE.getString("DisplayShortcuts_short_desc"));
        putValue(Action.LONG_DESCRIPTION, I18N.BUNDLE.getString("DisplayShortcuts_long_desc"));
        putValue(Action.MNEMONIC_KEY, new Integer(I18N.getCharBundle("DisplayShortcuts_mnemonic_key")));
    }
    
    @Override
    public void actionPerformed(ActionEvent pAE) {
        mOwner.showShortcutsPanel();
    }
}
