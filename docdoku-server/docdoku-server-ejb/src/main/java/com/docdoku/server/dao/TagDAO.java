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
package com.docdoku.server.dao;

import com.docdoku.core.services.CreationException;
import com.docdoku.core.services.TagAlreadyExistsException;
import com.docdoku.core.services.TagNotFoundException;
import com.docdoku.core.document.Tag;
import com.docdoku.core.document.TagKey;
import java.util.List;
import java.util.Locale;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceException;
import javax.persistence.Query;

public class TagDAO {

    private EntityManager em;
    private Locale mLocale;

    public TagDAO(Locale pLocale, EntityManager pEM) {
        em = pEM;
        mLocale = pLocale;
    }

    public Tag[] findAllTags(String pWorkspaceId) {
        Tag[] tags;
        Query query = em.createQuery("SELECT DISTINCT t FROM Tag t WHERE t.workspaceId = :workspaceId");
        List listTags = query.setParameter("workspaceId", pWorkspaceId).getResultList();
        tags = new Tag[listTags.size()];
        for (int i = 0; i < listTags.size(); i++) {
            tags[i] = (Tag) listTags.get(i);
        }

        return tags;
    }

    public void deleteOrphanTags(String pWorkspaceId) {
        Query query = em.createQuery("SELECT t FROM Tag t WHERE t.workspaceId = :workspaceId AND t.label <> ALL (SELECT t2.label FROM DocumentMaster m, IN (m.tags) t2 WHERE t2.workspaceId = :workspaceId)");
        List tags = query.setParameter("workspaceId", pWorkspaceId).getResultList();
        for (Object t : tags) {
            em.remove(t);
        }
    }

    public void removeTag(TagKey pTagKey) throws TagNotFoundException {
        Tag tag = em.find(Tag.class, pTagKey);
        if (tag == null) {
            throw new TagNotFoundException(mLocale, pTagKey);
        } else {
            em.remove(tag);
        }
    }

    public void createTag(Tag pTag) throws CreationException, TagAlreadyExistsException {
        try {
            //the EntityExistsException is thrown only when flush occurs
            em.persist(pTag);
            em.flush();
        } catch (EntityExistsException pEEEx) {
            throw new TagAlreadyExistsException(mLocale, pTag);
        } catch (PersistenceException pPEx) {
            //EntityExistsException is case sensitive
            //whereas MySQL is not thus PersistenceException could be
            //thrown instead of EntityExistsException
            throw new CreationException(mLocale);
        }
    }
}
