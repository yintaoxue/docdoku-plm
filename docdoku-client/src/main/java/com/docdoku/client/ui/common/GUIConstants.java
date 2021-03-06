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

package com.docdoku.client.ui.common;

import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.datatransfer.DataFlavor;


public interface GUIConstants {

    public final static String DOCM_FLAVOR = DataFlavor.javaJVMLocalObjectMimeType +  ";class=com.docdoku.core.document.DocumentMaster";
    public final static Insets INSETS = new Insets(2, 5, 2, 5);
    public final static Insets MENU_INSETS = new Insets(0, 10, 0, 3);
    public final static String LARGE_ICON = "LargeIcon";
    public final static Border WORKFLOW_CANVAS_MARGIN_BORDER =  new EmptyBorder(60,60,60,60);;

}