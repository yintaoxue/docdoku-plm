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

import com.docdoku.core.product.Marker;
import com.docdoku.core.services.MarkerNotFoundException;

import java.util.Locale;

import javax.persistence.EntityManager;

public class MarkerDAO {

    private EntityManager em;
    private Locale mLocale;

    public MarkerDAO(Locale pLocale, EntityManager pEM) {
        em = pEM;
        mLocale = pLocale;
    }

    public void createMarker(Marker pMarker) {
        em.persist(pMarker);
        em.flush();
    }

    public Marker loadMarker(int pId) throws MarkerNotFoundException {
        Marker marker = em.find(Marker.class, pId);
        if (marker == null) {
            throw new MarkerNotFoundException(mLocale, pId);
        } else {
            return marker;
        }
    }

    public void removeMarker(int pId) throws MarkerNotFoundException {
        Marker marker = loadMarker(pId);
        em.remove(marker);
    }

}
