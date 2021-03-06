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

import com.docdoku.core.document.DocumentMaster;

import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.IOException;

public class DocMSelection implements Transferable {

    private DataFlavor mDocMFlavor;
    private DocumentMaster mDocM;

    public DocMSelection(DocumentMaster pDocM) {
        mDocM = pDocM;
        try {
            mDocMFlavor = new DataFlavor(GUIConstants.DOCM_FLAVOR);
        } catch (ClassNotFoundException pCNFEx) {
            throw new RuntimeException("Unexpected error: unrecognized data flavor", pCNFEx);
        }
    }

    public DataFlavor[] getTransferDataFlavors() {
        return new DataFlavor[]{mDocMFlavor, DataFlavor.javaFileListFlavor};
    }

    public boolean isDataFlavorSupported(DataFlavor pFlavor) {
        return (pFlavor.equals(mDocMFlavor) || pFlavor.equals(DataFlavor.javaFileListFlavor));
    }

    public Object getTransferData(DataFlavor pFlavor) throws UnsupportedFlavorException, IOException {
        if (pFlavor.equals(mDocMFlavor)) {
            return mDocM;
        } else if (pFlavor.equals(DataFlavor.javaFileListFlavor)) {
            //TODO javaFileListFlavor
            return null;
        } else {
            throw new UnsupportedFlavorException(pFlavor);
        }
    }
}
