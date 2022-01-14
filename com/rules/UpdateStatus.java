package com.rules;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.manick.database_DAO;


@WebServlet("/updateStatus")
public class UpdateStatus extends HttpServlet {
	
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		String ruleNames[] = req.getParameterValues("ruleNames[]");
		database_DAO db = new database_DAO();
		db.connect();
		db.updateStatus(ruleNames);
		db.closeConnection();
	}

}
