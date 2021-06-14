package com.lennox.test;


import java.io.IOException;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.lennox.functionallibrary.Baseclass;
import com.lennox.pageobjects.LoginPage;



public class LoginPage_TC extends Baseclass
{
	
 //Login to the Application
	
	@Test
	public void verifyLogin()  {
		
		LoginPage lp=new LoginPage(driver);		

				logger.info("QA Application is successfully launched");
				lp.LogIn();
				logger.info("Login Info");
				lp.enterUserName(username);
				logger.info("Entered username");
				
				lp.enterPassword(password);
				logger.info("Entered password");
				
				lp.clickSignIn();
						
				
				 if(driver.getTitle().equals("Homepage | LennoxPROs.com")) 
				 { 
					 Assert.assertTrue(true);
				 logger.info("Login test passed"); 
				 } 
				 
				 else { 
					 try {
						captureScreen(driver,"loginTC");
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				 Assert.assertTrue(false);
				 
				 logger.info("Login test failed"); }
					
			
		}
	
		
}
