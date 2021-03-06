<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
    <fmt:setBundle basename="com.docdoku.server.localization.explorer_resource"/>
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="chrome=1"/>
        <title><fmt:message key="title"/></title>

        <link rel="Shortcut Icon" type="image/ico" href="<%=request.getContextPath()%>/images/favicon.ico"/>
        <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/font-awesome.css"/>      
	<link rel="stylesheet/less" href="<%=request.getContextPath()%>/less/style.less">
        <link rel="stylesheet/less" href="<%=request.getContextPath()%>/less/document-management/style.less">

        
		<script src="<%=request.getContextPath()%>/js/lib/less-1.2.1.min.js"></script>

		<script src="<%=request.getContextPath()%>/js/lib/date.format.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/underscore-1.4.2.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/mustache-0.5.0-dev.js"></script>
                <script src="<%=request.getContextPath()%>/js/lib/kumo.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/jquery-1.7.1.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/jquery-ui-1.8.19.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/jquery.maskedinput-1.3.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/backbone-0.9.2.min.js"></script>
		<script src="<%=request.getContextPath()%>/js/lib/bootstrap-2.0.2.min.js"></script>

		<script src="<%=request.getContextPath()%>/js/lib/require/1.0.8/require.min.js"></script>
		<script type="text/javascript">
			var APP_CONFIG = {
				workspaceId: "${workspaceID}",
				login: "${login}"
			};
			require.config({
				baseUrl: "${request.contextPath}/js",
				paths: {
					"require": "lib/require/1.0.8/require.min",
					"text": "lib/require/1.0.8/text.min"
				},
				locale: "<%=request.getLocale()%>"
			});
			require(["app"]);

            $(document).ready(function() {
                populateProductsMenu();
            });
            
		</script>
    </head>    
    <body>
        <%@ include file="/WEB-INF/header.jspf" %>
		<div id="workspace"></div>
    </body>
</html>
