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

package com.docdoku.server.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.StreamingOutput;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;

/**
 * @author Julien Maffre
 */
public class StreamingBinaryResourceOutput implements StreamingOutput {

    private File file;
    private Range range;

    private final static int BLOCK_SIZE = 32 * 1024;

    public StreamingBinaryResourceOutput(File file, Range range) {
        this.file = file;
        this.range = range;
    }

    public StreamingBinaryResourceOutput(File file) {
        this.file = file;
    }

    @Override
    public void write(OutputStream output) throws IOException, WebApplicationException {

        RandomAccessFile raf = new RandomAccessFile(file, "r");

        int length;
        int totalWritedLength = 0;
        byte[] bytes = new byte[BLOCK_SIZE];

        if (range != null) {

            int lengthOfTheBytesRange = range.getlengthOfTheBytesRange();

            raf.skipBytes((int) range.getMin());

            while ((length = raf.read(bytes)) != -1) {
                if (totalWritedLength + length < lengthOfTheBytesRange) {
                    output.write(bytes, 0, length);
                    totalWritedLength += length;
                } else {
                    int lengthToWrite = lengthOfTheBytesRange - totalWritedLength;
                    output.write(bytes, 0, lengthToWrite);
                    totalWritedLength += lengthToWrite;
                    break;
                }
            }

        } else {
            while ((length = raf.read(bytes)) != -1) {
                output.write(bytes, 0, length);
                totalWritedLength += length;
            }
        }

        raf.close();
    }
}
