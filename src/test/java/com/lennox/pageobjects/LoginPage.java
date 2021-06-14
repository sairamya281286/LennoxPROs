package com.lennox.pageobjects;

import org.openqa.selenium.WebDriver;	
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.lennox.functionallibrary.Baseclass;


public class LoginPage extends Baseclass {
	
WebDriver driver;

public LoginPage(WebDriver rdriver){
driver=rdriver;
PageFactory.initElements(driver, this);
}
	@FindBy(linkText = "Sign In")	
	WebElement signInlink;
	
	@FindBy(id="j_username")
	WebElement userName;
	
	@FindBy(id="j_password")
	WebElement password;
		
	@FindBy(id="loginSubmit")
	WebElement signInbtn;
	
	 public void LogIn()
	    {
	    	signInlink.click();
	    }
				
    public void enterUserName(String uName)
	{
		userName.sendKeys(uName);
			}
   
    public void enterPassword(String pswd)
    {
    	password.sendKeys(pswd);
    }
    
    public void clickSignIn()
    {
    	signInbtn.click();
    }
}