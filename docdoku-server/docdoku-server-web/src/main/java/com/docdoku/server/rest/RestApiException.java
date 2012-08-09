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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;


public class RestApiException extends WebApplicationException {

    public RestApiException(String technicalDetail, String userMessage) {
        super(Response.status(Status.BAD_REQUEST).header("Reason-Phrase",
                userMessage).entity(technicalDetail).build());
    }
}



class ClientException extends WebApplicationException {
    public ClientException(int status, String userMessage, String technicalReason, String stackTraceArray) {
        super(Response.status(400)
                .entity(getJsonString(status, userMessage, technicalReason, stackTraceArray))
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build());
    }

    public ClientException() {
        this(400, "Client Error", "Unknown Reason", "[]");
    }



    public ClientException(String userMessage, Throwable ex) {
        this(400, userMessage, ex.getLocalizedMessage(), getStackTraceJsonArray(ex));
    }

    public ClientException(int status, String userMessage, Throwable ex) {
        this(status, userMessage, ex.getLocalizedMessage(), getStackTraceJsonArray(ex));
    }

    public ClientException(int status, Throwable ex) {
        this(status, ex.getLocalizedMessage(), ex.getLocalizedMessage(), getStackTraceJsonArray(ex));
    }

    public ClientException( Throwable ex) {
        this(400, ex.getLocalizedMessage(), ex.getLocalizedMessage(), getStackTraceJsonArray(ex));
    }

    static String getJsonString(int status, String userMessage, String technicalReason, String stackTraceArray) {
        if (!stackTraceArray.startsWith("[")) {
            stackTraceArray = "[]";//maybe malformed array
        }
        return "{\"status\":" + status + ",\n" +
                "\"message\":\"" + userMessage.replaceAll("\\\"", "\\'") + "\"," +
                "\"reason\":\"" + technicalReason.replaceAll("\\\"", "\\'") + "\"," +
                "\"stack\":" + stackTraceArray.replaceAll("\\\"", "\\'") + //it's a json array, no need for additional quotes
                "}";
    }

    static String getStackTraceJsonArray(Throwable ex) {
        return "[\"" + join(ex.getStackTrace(), "\",\"") + "\"]";
    }

    /**
     * From StackOverflow : http://stackoverflow.com/questions/1515437/java-function-for-arrays-like-phps-join
     */
    static String join(Object[] s, String glue) {
        int k = s.length;
        if (k == 0)
            return null;
        StringBuilder out = new StringBuilder();
        out.append(s[0].toString());
        for (int x = 1; x < k; ++x)
            out.append(glue).append(s[x].toString());
        return out.toString();
    }
}

//TODO Localization
class NotAuthorizedException extends ClientException {
    public NotAuthorizedException(Throwable ex) {
        super(401, "User is not authorized", ex);
    }
}



class ServerException extends WebApplicationException{
    public ServerException(Throwable ex) {
        super(Response.status(500)
                .entity(ClientException.getJsonString(
                        500,
                        ex.getLocalizedMessage(),
                        ex.getLocalizedMessage(),
                        ClientException.getStackTraceJsonArray(ex)))
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build());
    }
}