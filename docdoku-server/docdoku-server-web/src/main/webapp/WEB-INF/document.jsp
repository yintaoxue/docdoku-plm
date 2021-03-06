<%@ page import="com.docdoku.core.common.*,com.docdoku.core.util.FileIO" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <fmt:setBundle basename="com.docdoku.server.localization.document_resource"/>
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
        <title><fmt:message key="title"/></title>
        <link rel="Shortcut Icon" type="image/ico" href="<%=request.getContextPath()%>/images/favicon.ico"/>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/switchPlayer.js"></script>
        <script type="text/javascript" src="<%=request.getContextPath()%>/js/swfobject/swfobject.js"></script>
    </head>

    <body>
        <div id="page">
            <div id="content">
                <div id="sidebar">
                        <h3><fmt:message key="sidebar.title1"/></h3>
                        <c:forEach var="item" varStatus="status" items="${docm.lastIteration.attachedFiles}">
                            <c:set scope="request" var="context" value="<%=request.getContextPath()%>" />
                            <c:set scope="request" var="filePath" value="${context}/files/${item.fullName}" />
                            <c:set scope="request" var="fileName" value="${item.name}" />
                            <c:set scope="request" var="index" value="${status.index}"/>
                            <jsp:useBean scope="request" type="java.lang.String" id="filePath"/>
                            <c:choose>
                                <c:when test="<%=FileIO.isDocFile(filePath)%>" >
                                    <%@include file="/WEB-INF/docPlayer.jspf"%>
                                </c:when>
                                <c:when test="<%=FileIO.isAVFile(filePath)%>" >
                                    <%@include file="/WEB-INF/audioVideoPlayer.jspf"%>
                                </c:when>
                                <c:when test="<%=FileIO.isImageFile(filePath)%>" >
                                    <%@include file="/WEB-INF/imagePlayer.jspf" %>
                                </c:when>
                                <c:otherwise>
                                    <table border="0">
                                        <tr>
                                            <td width="14px" height="14px">&nbsp;</td>
                                            <td><a href="<%=filePath%>">${item.name}</a></td>
                                        </tr>
                                    </table>
                                </c:otherwise>
                            </c:choose>
                        </c:forEach>

                        <h3><fmt:message key="sidebar.title2"/></h3>
                        <p>
                            <c:forEach var="item" items="${docm.lastIteration.linkedDocuments}">
                                <a href="<%=request.getContextPath()%>/documents/${item.toDocumentWorkspaceId}/${item.toDocumentDocumentMasterId}/${item.toDocumentDocumentMasterVersion}">${item.toDocumentDocumentMasterId}-${item.toDocumentDocumentMasterVersion}-${item.toDocumentIteration}</a><br/>
                            </c:forEach>
                        </p>
                </div>
            </div>

            <div id="main">
                <h2>${docm}</h2>

                <h3><fmt:message key="section1.title"/></h3>

                <table>
                    <tr>
                        <th scope="row"><fmt:message key="section1.author"/>:</th>
                        <td>${docm.author.name}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.date"/>:</th>
                        <td><fmt:formatDate type="both" value="${docm.creationDate}"/></td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.type"/>:</th>
                        <td>${docm.type}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.titledoc"/>:</th>
                        <td>${docm.title}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.checkout_user"/>:</th>
                        <td>${docm.checkOutUser.name}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.checkout_date"/>:</th>
                        <td><fmt:formatDate type="both" value="${docm.checkOutDate}"/></td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.state"/>:</th>
                        <td>${docm.lifeCycleState}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.tag"/>:</th>
                        <td>${docm.tags}</td>
                    </tr>
                    <tr>
                        <th scope="row"><fmt:message key="section1.description"/>:</th>
                        <td><textarea name="" rows="5" cols="35" readonly="readonly">${docm.description}</textarea></td>
                    </tr>
                </table>
            </div>

            <h3><fmt:message key="section2.title"/></h3>

            <table>
                <tr>
                    <th scope="row"><fmt:message key="section2.iteration"/>:</th>
                    <td>${docm.lastIteration.iteration}</td>
                </tr>
                <tr>
                    <th scope="row"><fmt:message key="section2.author"/>:</th>
                    <td>${docm.lastIteration.author.name}</td>
                </tr>
                <tr>
                    <th scope="row"><fmt:message key="section2.date"/>:</th>
                    <td><fmt:formatDate type="both" value="${docm.lastIteration.creationDate}"/></td>
                </tr>
                <tr>
                    <th scope="row"><fmt:message key="section2.revisionNote"/>:</th>
                    <td>${docm.lastIteration.revisionNote}</td>
                </tr>
            </table>
        </div>
    </body>
</html>