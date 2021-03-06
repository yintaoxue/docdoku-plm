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

import com.docdoku.core.product.ConfigurationItemKey;
import com.docdoku.core.product.Layer;
import com.docdoku.core.services.LayerNotFoundException;
import java.util.List;
import java.util.Locale;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

public class LayerDAO {

    private EntityManager em;
    private Locale mLocale;

    public LayerDAO(Locale pLocale, EntityManager pEM) {
        em = pEM;
        mLocale = pLocale;
    }
    
    public LayerDAO(EntityManager pEM) {
        em = pEM;
        mLocale = Locale.getDefault();
    }

    public List<Layer> findAllLayers(ConfigurationItemKey pKey) {
        TypedQuery<Layer> query = em.createNamedQuery("Layer.findLayersByConfigurationItem", Layer.class);
        query.setParameter("workspaceId", pKey.getWorkspace());
        query.setParameter("configurationItemId", pKey.getId());
        return query.getResultList();
    }
    
    public Layer loadLayer(int pId) throws LayerNotFoundException {
        Layer layer = em.find(Layer.class, pId);
        if (layer == null) {
            throw new LayerNotFoundException(mLocale, pId);
        } else {
            return layer;
        }
    }

    public void createLayer(Layer pLayer) {
        em.persist(pLayer);
        em.flush();
    }
}
