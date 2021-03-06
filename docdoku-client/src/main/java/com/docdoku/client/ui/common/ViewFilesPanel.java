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

import com.docdoku.client.localization.I18N;
import com.docdoku.core.common.BinaryResource;
import com.docdoku.core.common.FileHolder;

import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class ViewFilesPanel extends JPanel implements ActionListener {

    private JScrollPane mFilesScrollPane;
    private JList mFilesList;
    private JButton mDownloadButton;
    private JButton mOpenButton;
    private DefaultListModel mFilesListModel;
    private ActionListener mDownloadAction;
    private ActionListener mOpenAction;
    private FileHolder mFileHolder;

    public ViewFilesPanel(FileHolder pFileHolder, ActionListener pDownloadAction, ActionListener pOpenAction) {
        mFileHolder = pFileHolder;
        mFilesListModel = new DefaultListModel();
        mDownloadAction = pDownloadAction;
        mOpenAction = pOpenAction;
        Image img =
                Toolkit.getDefaultToolkit().getImage(ViewFilesPanel.class.getResource("/com/docdoku/client/resources/icons/download.png"));
        ImageIcon downloadIcon = new ImageIcon(img);
        mDownloadButton = new JButton(I18N.BUNDLE.getString("DownloadFile_button"), downloadIcon);


        img =
                Toolkit.getDefaultToolkit().getImage(ViewFilesPanel.class.getResource(
                "/com/docdoku/client/resources/icons/gears.png"));
        ImageIcon openIcon = new ImageIcon(img);
        mOpenButton = new JButton(I18N.BUNDLE.getString("OpenFile_button"), openIcon);


        mFilesScrollPane = new JScrollPane();
        mFilesList = new JList(mFilesListModel);
        mFilesList.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        createLayout();
        createListener();
        for (BinaryResource file : pFileHolder.getAttachedFiles()) {
            mFilesListModel.addElement(file);
        }
    }

    public BinaryResource getSelectedFile() {
        return (BinaryResource) mFilesList.getSelectedValue();
    }

    public FileHolder getFileHolder() {
        return mFileHolder;
    }

    private void createLayout() {
        mDownloadButton.setHorizontalAlignment(SwingConstants.LEFT);
        mDownloadButton.setEnabled(false);
        mOpenButton.setHorizontalAlignment(SwingConstants.LEFT);
        mOpenButton.setEnabled(false);
        mFilesScrollPane.getViewport().add(mFilesList);
        setLayout(new GridBagLayout());
        GridBagConstraints constraints = new GridBagConstraints();
        constraints.anchor = GridBagConstraints.CENTER;
        constraints.insets = GUIConstants.INSETS;
        constraints.gridwidth = 1;

        constraints.gridheight = 3;
        constraints.gridx = 0;
        constraints.gridy = 0;
        constraints.weightx = 1;
        constraints.weighty = 1;
        constraints.fill = GridBagConstraints.BOTH;
        add(mFilesScrollPane, constraints);

        constraints.weightx = 0;
        constraints.weighty = 0;
        constraints.fill = GridBagConstraints.HORIZONTAL;
        constraints.gridheight = 1;
        constraints.gridx = 1;
        add(mDownloadButton, constraints);

        constraints.gridy = 1;
        add(mOpenButton, constraints);
    }

    private void createListener() {
        mOpenButton.addActionListener(this);
        mDownloadButton.addActionListener(this);
        mFilesList.addListSelectionListener(new ListSelectionListener() {

            public void valueChanged(ListSelectionEvent pE) {
                if (mFilesList.isSelectionEmpty()) {
                    mDownloadButton.setEnabled(false);
                    mOpenButton.setEnabled(false);
                } else {
                    mDownloadButton.setEnabled(true);
                    mOpenButton.setEnabled(true);
                }

            }
        });
    }

    public void actionPerformed(ActionEvent pAE) {
        String command = pAE.getActionCommand();
        if (command.equals(I18N.BUNDLE.getString("DownloadFile_button"))) {
            mDownloadAction.actionPerformed(new ActionEvent(this, 0, null));
        }

        if (command.equals(I18N.BUNDLE.getString("OpenFile_button"))) {
            mOpenAction.actionPerformed(new ActionEvent(this, 0, null));
        }
    }
}
