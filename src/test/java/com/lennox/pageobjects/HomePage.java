package com.lennox.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.lennox.functionallibrary.Baseclass;

public class HomePage extends Baseclass{
	
	
	WebDriver driver;
	public HomePage(WebDriver rdriver)
	{
		driver=rdriver;
		PageFactory.initElements(driver, this);

	}
	
	
	
	public void selectShopBy(String shopBy)
	{
		WebElement mainMenuselect=driver.findElement(By.xpath("//h4[text()='Shop by']/following::ul/li/a[text()='"+shopBy+"']"));
		mousehover(mainMenuselect);
		jsClick(mainMenuselect);
			}
	
	
	public void selectMainmenu(String mainMenu) throws InterruptedException
	{
	WebElement mainMenuselect=driver.findElement(By.xpath("//div[@class='yCmsComponent v2-navigation-tree']/child::div/a[text()='"+mainMenu+"']"));
	mousehover(mainMenuselect);
	Thread.sleep(3000);
	jsClick(mainMenuselect);
	
	}
	
	public void selectsubmenu(String subMenu) throws InterruptedException
	{
	WebElement subMenuselect=driver.findElement(By.xpath("//div[contains(@class,'current-selected-header-item')]/descendant::div/a[text()='"+subMenu+"']"));
	mousehover(subMenuselect);
	Thread.sleep(3000);

	jsClick(subMenuselect);
	
	}
	
}
