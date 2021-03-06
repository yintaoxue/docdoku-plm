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

import javax.swing.text.AttributeSet;
import javax.swing.text.BadLocationException;
import javax.swing.text.PlainDocument;
import java.awt.*;

public class MaxLengthDocument extends PlainDocument {

    private int mMaxChars;

    public MaxLengthDocument(int pMaxChars) {
        mMaxChars = pMaxChars;
    }

    @Override
    public void insertString(int pOffset, String pS, AttributeSet pA) throws BadLocationException {
        if (getLength() + pS.length() > mMaxChars) {
            Toolkit.getDefaultToolkit().beep();
            return;
        }
        super.insertString(pOffset, pS, pA);
    }
}
